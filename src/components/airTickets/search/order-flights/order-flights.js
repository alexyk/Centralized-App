import * as _ from "ramda";

export default function orderFlights({ arrayOfStopsToSort, originCode }) {
  let groupedByGroupIndex = _.groupBy(_.prop("group"), arrayOfStopsToSort);
  let currentOrigin = originCode;
  let withOrderedStops = _.mapObjIndexed((stops, groupIndex) => {
    let sortedStops = [];
    let currentStop = stops.find(stop => stop.origin.code === currentOrigin);
    while (currentStop) {
      sortedStops.push(currentStop);
      let currentDestination = currentStop.destination.code;
      currentStop = stops.find(stop => stop.origin.code === currentDestination);
    }
    currentOrigin = sortedStops[sortedStops.length - 1].destination.code;
    return sortedStops;
  }, groupedByGroupIndex);
  return withOrderedStops;
}
