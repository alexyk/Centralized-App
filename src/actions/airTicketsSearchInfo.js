import { airTicketsSearchInfo } from './actionTypes';

export function setFlightType(flightType) {
  return {
    type: airTicketsSearchInfo.SET_FLIGHT_TYPE,
    flightType
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

export function setChildren() {
  return {
    type: airTicketsSearchInfo.SET_CHILDREN
  };
}

export function setAirTicketsSearchInfo(flightType, flightClass, flightStops, departureTime, flightOrigin, flightDestination, startDate, endDate, adultsCount, hasChildren) {
  return {
    type: airTicketsSearchInfo.SET_AIR_TICKETS_SEARCH_INFO,
    flightType,
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