import { airTicketsSearchInfo } from './actionTypes';

export function setFlightRouting(flightRouting) {
  return {
    type: airTicketsSearchInfo.SET_FLIGHT_ROUTING,
    flightRouting
  };
}

export function setFlightClass(flightClass) {
  return {
    type: airTicketsSearchInfo.SET_FLIGHT_CLASS,
    flightClass
  };
}

export function setStops(stops) {
  return {
    type: airTicketsSearchInfo.SET_STOPS,
    stops
  };
}

export function setDepartureTime(departureTime) {
  return {
    type: airTicketsSearchInfo.SET_DEPARTURE_TIME,
    departureTime
  };
}

export function setOrigin(origin) {
  return {
    type: airTicketsSearchInfo.SET_ORIGIN,
    origin
  };
}

export function setDestination(destination) {
  return {
    type: airTicketsSearchInfo.SET_DESTINATION,
    destination
  };
}

export function setAdults(adultsCount) {
  return {
    type: airTicketsSearchInfo.SET_ADULTS,
    adultsCount
  };
}

export function setHasChildren() {
  return {
    type: airTicketsSearchInfo.SET_HAS_CHILDREN
  };
}

export function setChildren(children) {
  return {
    type: airTicketsSearchInfo.SET_CHILDREN,
    children
  };
}

export function setInfants(infants) {
  return {
    type: airTicketsSearchInfo.SET_INFANTS,
    infants
  };
}

export function setAirTicketsSearchInfo(flightRouting, flightClass, stops, departureTime, origin, destination, adultsCount, children, infants, hasChildren) {
  return {
    type: airTicketsSearchInfo.SET_AIR_TICKETS_SEARCH_INFO,
    flightRouting,
    flightClass,
    stops,
    departureTime,
    origin,
    destination,
    adultsCount,
    children,
    infants,
    hasChildren
  };
}