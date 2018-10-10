import { airTicketsSearchInfo } from './actionTypes';

export function setRouting(routing) {
  return {
    type: airTicketsSearchInfo.SET_ROUTING,
    routing
  };
}

export function setFlightClass(flightClass) {
  return {
    type: airTicketsSearchInfo.SET_FLIGHT_CLASS,
    flightClass
  };
}

export function setFlightStops(flightStops) {
  return {
    type: airTicketsSearchInfo.SET_FLIGHT_STOPS,
    flightStops
  };
}

export function setDepartureTime(departureTime) {
  return {
    type: airTicketsSearchInfo.SET_DEPARTURE_TIME,
    departureTime
  };
}

export function setFlightOrigin(flightOrigin) {
  return {
    type: airTicketsSearchInfo.SET_FLIGHT_ORIGIN,
    flightOrigin
  };
}

export function setFlightDestination(flightDestination) {
  return {
    type: airTicketsSearchInfo.SET_FLIGHT_DESTINATION,
    flightDestination
  };
}

export function setDates(event, picker) {
  return {
    type: airTicketsSearchInfo.SET_DATES,
    startDate: picker.startDate,
    endDate: picker.endDate
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

export function setAirTicketsSearchInfo(routing, flightClass, flightStops, departureTime, flightOrigin, flightDestination, startDate, endDate, adultsCount, hasChildren) {
  return {
    type: airTicketsSearchInfo.SET_AIR_TICKETS_SEARCH_INFO,
    routing,
    flightClass,
    flightStops,
    departureTime,
    flightOrigin,
    flightDestination,
    startDate,
    endDate,
    adultsCount,
    hasChildren
  };
}