import * as _ from "ramda";
import type { Filight } from "../flights.type.flow";

export type Filters = {
  price?: {
    min: number,
    max: number
  },
  changes?: [{ changesId: "0" | "1" | "2" }],
  airlines?: [{ airlineName: string }],
  journeyTime?: number,
  airports?: {
    all?: [{ city: string, airportId: string }],
    transfers?: [{ airportId: string }]
  }
};

export function filterFlights(filters: Filters, flights: [Filight]) {
  if (filters.price) {
    flights = filterByPrice(filters, flights);
  }
  if (filters.changes && filters.changes.length) {
    flights = filterByChanges(filters, flights);
  }
  if (filters.airlines && filters.airlines.length) {
    flights = filterByAirlines(filters, flights);
  }
  if (filters.journeyTime) {
    flights = filterByJourneyTime(filters, flights);
  }

  if (filters.airports && filters.airports.all) {
    flights = filterByAirports(filters, flights);
  }
  if (filters.airports && filters.airports.transfers) {
    flights = filterByTransfers(filters, flights);
  }
  return flights;
}

/**
 * By Airports
 */
export function filterByAirports(filters, flights) {
  let allAirports = filters.airports.all;
  let groupedByCity = _.groupBy(_.prop("city"), allAirports);
  groupedByCity = _.filter(value => value.length > 1, groupedByCity);

  return flights.filter(flight => {
    return _passesForAllCities(flight, groupedByCity);
  });
}

function _passesForAllCities(flight, groupedByCity) {
  let cities = Object.keys(groupedByCity);
  let passesForCities = 0;
  cities.forEach(cityName => {
    if (_passesForCity(groupedByCity, cityName, flight)) {
      passesForCities += 1;
    }
  });
  return passesForCities === cities.length;
}

function _passesForCity(groupedByCity, cityName, flight) {
  let currentCityAirports = groupedByCity[cityName];
  let selectedAirports = currentCityAirports
    .filter(ap => ap.selected)
    .map(_.prop("airportId"));
  let nonSelectedAirports = currentCityAirports
    .filter(ap => !ap.selected)
    .map(_.prop("airportId"));

  let hasSelectedAirports = _hasSelectedAirports(flight, selectedAirports);
  let doesNotHaveNonSelectedAirports = _doesNotHaveNonSelectedAirports(
    flight,
    nonSelectedAirports
  );
  return hasSelectedAirports && doesNotHaveNonSelectedAirports;
}

function _doesNotHaveNonSelectedAirports(flight, nonSelectedAirports) {
  if (nonSelectedAirports.length === 0) {
    return true;
  }
  return (
    flight.segments.filter(segment => {
      let containedInOrigin =
        nonSelectedAirports.indexOf(segment.origin.code) !== -1;
      let containedInDestination =
        nonSelectedAirports.indexOf(segment.destination.code) !== -1;
      return containedInOrigin || containedInDestination;
    }).length === 0
  );
}

function _hasSelectedAirports(flight, selectedAirports) {
  return (
    flight.segments.filter(segment => {
      let containedInOrigin =
        selectedAirports.indexOf(segment.origin.code) !== -1;
      let containedInDestination =
        selectedAirports.indexOf(segment.destination.code) !== -1;
      return containedInOrigin || containedInDestination;
    }).length > 0
  );
}

/**
 * By Number Of Changes
 */
export function filterByChanges(filters, flights) {
  let selectedChanges = filters.changes.map(_.prop("changesId"));
  let lookingForDirect = selectedChanges.indexOf("0") !== -1;
  let lookingForUpToOneStop = selectedChanges.indexOf("1") !== -1;
  let lookingForMultiStop = selectedChanges.indexOf("2") !== -1;
  return flights.filter(flight => {
    if (lookingForMultiStop) {
      return flight;
    }
    if (lookingForUpToOneStop) {
      return _isWithUpToOneStop(flight);
    }
    if (lookingForDirect) {
      return _isDirect(flight);
    }
  });
}

function _isDirect(flight) {
  let segmentsByGroup = flight.orderedSegments;
  let allGroups = Object.values(segmentsByGroup);
  let groupsWithDirectFlights = allGroups.filter(
    segmentGroup => segmentGroup.length === 1
  );
  return groupsWithDirectFlights.length === allGroups.length;
}
function _isWithUpToOneStop(flight) {
  let segmentsByGroup = flight.orderedSegments;
  let allGroups = Object.values(segmentsByGroup);
  let groupsWithUpToOneStop = allGroups.filter(
    segmentGroup => segmentGroup.length <= 2
  );
  return groupsWithUpToOneStop.length === allGroups.length;
}

/**
 * By Airlines
 */
export function filterByAirlines(filters, flights) {
  let selectedCarriers = filters.airlines.map(_.prop("airlineName"));
  return flights.filter(flight => {
    let flightCarriers = flight.segments
      .map(_.path(["carrier", "name"]))
      .reduce((acc, current) => {
        return {
          ...acc,
          [current]: ""
        };
      }, {});
    flightCarriers = Object.keys(flightCarriers);
    let matches = selectedCarriers.filter(sa => {
      return flightCarriers.indexOf(sa) !== -1;
    });
    return (
      matches.length === selectedCarriers.length &&
      matches.length === flightCarriers.length
    );
  });
}

/**
 * By Transfers
 */
export function filterByTransfers(filters, flights) {
  let selectedTransfers = filters.airports.transfers.map(_.prop("airportId"));
  return flights.filter(flight => {
    let flightTransfers = _findTransfersInSegments(flight);
    let matches = flightTransfers.filter(st => {
      return selectedTransfers.indexOf(st) !== -1;
    });
    let allOfTheTransfersAreInSelected =
      matches.length === flightTransfers.length;
    return allOfTheTransfersAreInSelected;
  });
}

function _findTransfersInSegments(flight) {
  let { orderedSegments } = flight;
  let inGroups = orderedSegments;
  let transformedToTransfers = _.mapObjIndexed((value, index) => {
    if (value.length === 2) {
      let transfers = [value[1]];
      return transfers.map(_.path(["origin", "code"]));
    } else if (value.length > 2) {
      let transfers = value.slice(1);
      return transfers.map(_.path(["origin", "code"]));
    }
  }, inGroups);
  let list = Object.values(transformedToTransfers)
    .filter(_.identity)
    .reduce(_.concat);
  return _.uniq(list);
}

/**
 * By Price
 */
export function filterByPrice(filters, flights) {
  let { min: minPrice, max: maxPrice } = filters.price;
  return flights.filter(flight => {
    return flight.price.total >= minPrice && flight.price.total <= maxPrice;
  });
}

/**
 * By Journey Time
 */
export function filterByJourneyTime(filters, flights) {
  return flights.filter(flight => {
    let journeyTime = _calculateJourneyTime(flight);
    return journeyTime <= filters.journeyTime;
  });
}

function _calculateJourneyTime(flight) {
  let groups = Object.keys(flight.orderedSegments);
  return groups.reduce((acc, groupIndex) => {
    return acc + flight.orderedSegments[groupIndex][0].journeyTime;
  }, 0);
}
