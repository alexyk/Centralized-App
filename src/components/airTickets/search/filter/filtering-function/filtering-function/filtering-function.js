import * as _ from "ramda";
import type { Flight } from "../flights.type.flow";

export type Filters = {
  price?: {
    min: number,
    max: number
  },
  /** present changes are considered selected */
  changes?: [{ changesId: "0" | "1" | "2" }],
  /** all selected airlines are considered selected */
  airlines?: [{ airlineName: string }],
  journeyTime?: number,
  airports?: {
    /** all selected airports are marked with a flag */
    all?: [{ city: string, airportId: string, selected?: boolean }],
    /** present airports are considered to be selected */
    transfers?: [{ airportId: string }]
  }
};

// TODO: [Filters]: Advisable to unify the criteria for selected items in a list

export function filterFlights(filters: Filters, flights: [Flight]) {
  if (filters.price) {
    // let before = flights.length;
    flights = filterByPrice(filters, flights);
    // let after = flights.length;
    // let total = before - after;
    // console.log("[FILTER: price] filtered out " + total + " items");
  }
  if (filters.changes) {
    // let before = flights.length;
    flights = filterByChanges(filters, flights);
    // let after = flights.length;
    // let total = before - after;
    // console.log("[FILTER: stops] filtered out " + total + " items");
  }
  if (filters.airlines) {
    // let before = flights.length;
    flights = filterByAirlines(filters, flights);
    // let after = flights.length;
    // let total = before - after;
    // console.log("[FILTER: airlines] filtered out " + total + " items");
  }
  if (filters.journeyTime) {
    // let before = flights.length;
    flights = filterByJourneyTime(filters, flights);
    // let after = flights.length;
    // let total = before - after;
    // console.log("[FILTER: journeyTime] filtered out " + total + " items");
  }

  if (filters.airports && filters.airports.all) {
    // let before = flights.length;
    flights = filterByAirports(filters, flights);
    // let after = flights.length;
    // let total = before - after;
    // console.log("[FILTER: airports] filtered out " + total + " items");
  }
  if (filters.airports && filters.airports.transfers) {
    // let before = flights.length;
    flights = filterByTransfers(filters, flights);
    // let after = flights.length;
    // let total = before - after;
    // console.log("[FILTER: transfers] filtered out " + total + " items");
  }
  return flights;
}

/**
 * By Airports
 */
export function filterByAirports(filters, flights) {
  let onlySelectedAirports = filters.airports.all.filter(ap => ap.selected);
  return flights.filter(flight =>
    _allFlightAirportsAreSelected(flight, onlySelectedAirports)
  );
}

function _allFlightAirportsAreSelected(flight, allAirports) {
  let allAirportCodes = allAirports.map(_.prop("airportId"));
  let segmentsWithSelectedAirportOnly = flight.segments.filter(segment => {
    let hasOriginAirport = allAirportCodes.indexOf(segment.origin.code) !== -1;
    let hasDestinationAirport =
      allAirportCodes.indexOf(segment.destination.code) !== -1;
    return hasOriginAirport && hasDestinationAirport;
  });

  return segmentsWithSelectedAirportOnly.length === flight.segments.length;
}

/**
 * By Number Of Changes
 */
export function filterByChanges(filters, flights) {
  let selectedChanges = filters.changes.map(_.prop("changesId"));
  let lookingForDirect = selectedChanges.indexOf("0") !== -1;
  let lookingForUpToOneStop = selectedChanges.indexOf("1") !== -1;
  let lookingForMultiStop = selectedChanges.indexOf("2") !== -1;

  if (!lookingForDirect && !lookingForUpToOneStop && !lookingForMultiStop) {
    return [];
  }

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
    let matches = flightCarriers.filter(sa => {
      return selectedCarriers.indexOf(sa) !== -1;
    });

    return (
      // matches.length === selectedCarriers.length &&
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
    } else if (value.length === 1) {
      return [];
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
