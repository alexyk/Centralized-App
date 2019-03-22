import * as _ from "ramda";

export default function orderFlights(arrayOfStopsToSort) {
  const groupByGroupIndex = _.groupBy(_.prop("group"));

  const orderStops = _.mapObjIndexed((stops, groupIndex) => {
    let firstOriginCode = findCodeOfFirstOrigin(stops);
    let sortedStops = [];
    let currentStop = stops.find(stop => stop.origin.code === firstOriginCode);
    while (currentStop) {
      sortedStops.push(currentStop);
      let currentDestination = currentStop.destination.code;
      currentStop = stops.find(stop => stop.origin.code === currentDestination);
    }
    return sortedStops;
  });

  const groupAndSortStops = _.pipe(
    groupByGroupIndex,
    orderStops
  );

  return groupAndSortStops(arrayOfStopsToSort);
}

function findCodeOfFirstOrigin(stops) {
  let _mapOfOriginsAndDestinations = stops.reduce(
    (mapOfOriginsAndDestinations, stop) => {
      if (mapOfOriginsAndDestinations.codes[stop.origin.code]) {
        mapOfOriginsAndDestinations.codes[stop.origin.code].count += 1;
        mapOfOriginsAndDestinations.codes[stop.origin.code].type = "origin";
        mapOfOriginsAndDestinations.codes[stop.origin.code].code =
          stop.origin.code;
      } else {
        mapOfOriginsAndDestinations.codes[stop.origin.code] = {
          count: 1,
          type: "origin",
          code: stop.origin.code
        };
      }

      if (mapOfOriginsAndDestinations.codes[stop.destination.code]) {
        mapOfOriginsAndDestinations.codes[stop.destination.code].count += 1;
        mapOfOriginsAndDestinations.codes[stop.destination.code].type =
          "destination";
        mapOfOriginsAndDestinations.codes[stop.destination.code].code =
          stop.destination.code;
      } else {
        mapOfOriginsAndDestinations.codes[stop.destination.code] = {
          count: 1,
          type: "destination",
          code: stop.destination.code
        };
      }
      return mapOfOriginsAndDestinations;
    },
    { codes: {} }
  );

  let firstOrigin = Object.values(_mapOfOriginsAndDestinations.codes).find(
    origin => origin.count === 1 && origin.type === "origin"
  ).code;

  return firstOrigin;
}
