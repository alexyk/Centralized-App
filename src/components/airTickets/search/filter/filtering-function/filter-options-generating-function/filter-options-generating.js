import * as _ from "ramda";
import type { Flight } from "../flights.type.flow";

/**
 * Generating The Filters Object
 */
export type GeneratedFilterOptions = {
  price: {
    max: number,
    min: number
  },
  changes: [{ changesId: "0" | "1" | "2", changesName: string }],
  airlines: [{ airlineName: string, airlineId: string }],
  journeyTime: {
    max: number,
    min: number
  },
  airports: {
    all: [{ city: string, airportId: string, airportName: string }],
    transfers: [{ airportId: string, airportName: string, city: string }]
  }
};

export type OptionsForGeneratingFilters = {
  getCityNameForAirport: (airportId: string) => Promise<string>,
  getAirlines: () => Promise<[{ airlineId: string, airlineName: string }]>
};

export async function makeFiltersObjectFromResults(
  flightResults: [Flight],
  options: OptionsForGeneratingFilters = {
    getCityNameForAirport() {},
    getAirlines() {
      return [];
    }
  }
): GeneratedFilterOptions {
  /**
   * Gather options
   */
  let airports = await _gatherAirportsFromResultsAndServer(
    flightResults,
    options
  );
  let prices = _gatherPrices(flightResults);
  let journeyTimes = _gatherJourneyTimes(flightResults);
  let allAirlines = await _gatherAirlines(options);
  let airlines = _removeUnusedAirlines(allAirlines, flightResults);
  /**
   * End result
   */
  return {
    airports: airports,
    airlines: airlines,
    price: prices,
    journeyTime: journeyTimes,
    changes: [
      { changesId: "0", changesName: "nonstop" },
      { changesId: "1", changesName: "onestop" },
      { changesId: "2", changesName: "twoormorestops" }
    ]
  };
}

function _removeUnusedAirlines(allAirlines, results) {
  let allAirlinesInResults = results.map(flight => {
    return flight.segments.map(segment => segment.carrier.name);
  });
  allAirlinesInResults = allAirlinesInResults.reduce(_.concat);
  allAirlinesInResults = _.uniq(allAirlinesInResults);

  return allAirlines.filter(
    airline => allAirlinesInResults.indexOf(airline.airlineName) !== -1
  );
}

async function _gatherAirlines(options) {
  const getAirlines = options.getAirlines || function() {};
  return await getAirlines();
}

/**
 * Journey Time
 */
function _gatherJourneyTimes(results) {
  let topTimesOfAllFlights = results.map(_findLargestJourneyTimeInFlight);
  let sortedTopTimesOfAllFlights = _.sort(
    (a, b) => a - b,
    topTimesOfAllFlights
  );
  return {
    min: sortedTopTimesOfAllFlights[0],
    max: sortedTopTimesOfAllFlights[sortedTopTimesOfAllFlights.length - 1]
  };
}
function _findLargestJourneyTimeInFlight(flight) {
  let flightSegmentsSortedByTime = flight.segments
    .map(_.prop("journeyTime"))
    .sort((a, b) => a - b);
  return flightSegmentsSortedByTime[flightSegmentsSortedByTime.length - 1];
}

/**
 * Prices
 */
function _gatherPrices(results) {
  let all = results.map(_.path(["price", "total"])).sort((a, b) => a - b);
  return {
    max: all[all.length - 1],
    min: all[0]
  };
}

/**
 * Airports
 */
async function _gatherAirportsFromResultsAndServer(results, options) {
  let allAirports = _gatherAllAirportsFromResults(results);

  const getCityNameForAirport = options.getCityNameForAirport || function() {};

  let allAirportsWithCityNames = await Promise.all(
    allAirports.map(async airport => {
      let cityName = await getCityNameForAirport(airport.airportId);
      return {
        ...airport,
        city: cityName
      };
    })
  );

  return {
    all: allAirportsWithCityNames,
    transfers: _gatherTransferAirportsFromResults(results)
  };
}

function _gatherAllAirportsFromResults(results) {
  let all = results.reduce((all, flight) => {
    let currentFlightAirports = _.compose(
      _.flatten,
      _.map(segment => {
        let originAirport = {
          airportId: segment.origin.code,
          airportName: segment.origin.name
        };
        let destinationAirport = {
          airportId: segment.destination.code,
          airportName: segment.destination.name
        };
        return [originAirport, destinationAirport];
      })
    )(flight.segments);
    return all.concat(currentFlightAirports);
  }, []);

  return _.uniqBy(_.prop("airportId"), all);
}

/**
 * Transfers
 */
function _gatherTransferAirportsFromResults(results) {
  let filtered = results.reduce((acc, flight) => {
    let transfers = _findTransferSegments(flight);
    return acc.concat(transfers);
  }, []);
  return _.uniqBy(_.prop("airportId"), filtered);
}

function _findTransferSegments(flight) {
  let { orderedSegments } = flight;
  let inGroups = orderedSegments;
  let transformedToTransfers = _.mapObjIndexed((value, index) => {
    let transfers = [];
    if (value.length === 2) {
      transfers = [value[1]];
    } else if (value.length > 2) {
      transfers = value.slice(1);
    }
    return transfers.map(t => {
      return {
        airportName: t.origin.name,
        airportId: t.origin.code
      };
    });
  }, inGroups);
  let list = Object.values(transformedToTransfers)
    .filter(_.identity)
    .reduce(_.concat);
  return _.uniqBy(_.prop("airportId"), list);
}
