import * as _ from "ramda";
import type { Filight } from "../flights.type.flow";
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

type OptionsForGeneratingFilters = {
  getCityNameForAirport: (airportId: string) => Promise<string>,
  getAirlines: () => Promise<[{ airlineId: string, airlineName: string }]>
};

export async function makeFiltersObjectFromResults(
  flightResults: [Filight],
  options: OptionsForGeneratingFilters
): GeneratedFilterOptions {
  /**
   * Gather options
   */
  let airports = await _gatherAirportsFromResultsAndServer(
    flightResults,
    options
  );
  let airlines = await _gatherAirlines(options);
  let prices = _gatherPrices(flightResults);
  let journeyTimes = _gatherJourneyTimes(flightResults);

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

async function _gatherAirlines(options) {
  const getAirlines = options.getAirlines || function() {};
  return await getAirlines();
}

/**
 * Journey Time
 */
function _gatherJourneyTimes(results) {
  let times = results.map(_calculateJourneyTime);
  let sorted = times.sort((a, b) => a - b);
  return {
    min: sorted[0],
    max: sorted[sorted.length - 1]
  };
}
function _calculateJourneyTime(flight) {
  let groups = Object.keys(flight.orderedSegments);
  return groups.reduce((acc, groupIndex) => {
    return acc + flight.orderedSegments[groupIndex][0].journeyTime;
  }, 0);
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
