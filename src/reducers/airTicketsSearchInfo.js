import { airTicketsSearchInfo } from '../actions/actionTypes';
import moment from 'moment';

const initialState = {
  flightType: 'roundTrip',
  flightClass: 'any',
  flightStops: 'any',
  departureTime: 'any',
  flightOrigin: null,
  flightDestination: null,
  startDate: moment().add(1, 'day'),
  endDate: moment().add(2, 'day'),
  adultsCount: 1,
  hasChildren: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case airTicketsSearchInfo.SET_FLIGHT_TYPE:
      return Object.assign({}, state, {
        flightType: action.flightType
      });
    case airTicketsSearchInfo.SET_FLIGHT_CLASS:
      return Object.assign({}, state, {
        flightClass: action.flightClass
      });
    case airTicketsSearchInfo.SET_FLIGHT_STOPS:
      return Object.assign({}, state, {
        flightStops: action.flightStops
      });
    case airTicketsSearchInfo.SET_DEPARTURE_TIME:
      return Object.assign({}, state, {
        departureTime: action.departureTime
      });
    case airTicketsSearchInfo.SET_FLIGHT_ORIGIN:
      return Object.assign({}, state, {
        flightOrigin: action.flightOrigin
      });
    case airTicketsSearchInfo.SET_FLIGHT_DESTINATION:
      return Object.assign({}, state, {
        flightDestination: action.flightDestination
      });
    case airTicketsSearchInfo.SET_DATES:
      return Object.assign({}, state, {
        startDate: action.startDate,
        endDate: action.endDate //.diff(action.startDate, 'days') === 0 ? action.endDate.add(1, 'day') : action.endDate
      });
    case airTicketsSearchInfo.SET_ADULTS:
      return Object.assign({}, state, {
        adultsCount: action.adultsCount,
      });
    case airTicketsSearchInfo.SET_CHILDREN:
      return Object.assign({}, state, {
        hasChildren: !state.hasChildren
      });
    case airTicketsSearchInfo.SET_AIR_TICKETS_SEARCH_INFO:
      return Object.assign({}, state, {
        flightType: action.flightType,
        flightClass: action.flightClass,
        flightStops: action.flightStops,
        departureTime: action.departureTime,
        flightOrigin: action.flightOrigin,
        flightDestination: action.flightDestination,
        startDate: action.startDate,
        endDate: action.endDate.diff(action.startDate, 'days') === 0 ? action.endDate.add(1, 'day') : action.endDate,
        adultsCount: action.adultsCount,
        hasChildren: action.hasChildren
      });
    default:
      return state;
  }
}