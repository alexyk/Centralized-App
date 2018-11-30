import { airTicketsSearchInfo } from '../actions/actionTypes';

const initialState = {
  flightRouting: '1',
  flightClass: '0',
  stops: '-1',
  departureTime: '',
  origin: null,
  destination: null,
  adultsCount: '1',
  children: [],
  flexSearch: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case airTicketsSearchInfo.SET_FLIGHT_ROUTING:
      return Object.assign({}, state, {
        flightRouting: action.flightRouting
      });
    case airTicketsSearchInfo.SET_FLIGHT_CLASS:
      return Object.assign({}, state, {
        flightClass: action.flightClass
      });
    case airTicketsSearchInfo.SET_STOPS:
      return Object.assign({}, state, {
        stops: action.stops
      });
    case airTicketsSearchInfo.SET_DEPARTURE_TIME:
      return Object.assign({}, state, {
        departureTime: action.departureTime
      });
    case airTicketsSearchInfo.SET_ORIGIN:
      return Object.assign({}, state, {
        origin: action.origin
      });
    case airTicketsSearchInfo.SET_DESTINATION:
      return Object.assign({}, state, {
        destination: action.destination
      });
    case airTicketsSearchInfo.SET_ADULTS:
      return Object.assign({}, state, {
        adultsCount: action.adultsCount,
      });
    case airTicketsSearchInfo.SET_CHILDREN:
      return Object.assign({}, state, {
        children: action.children
      });
    case airTicketsSearchInfo.SET_FLEX_SEARCH:
      return Object.assign({}, state, {
        flexSearch: !state.flexSearch
      });
    case airTicketsSearchInfo.SET_AIR_TICKETS_SEARCH_INFO:
      return Object.assign({}, state, {
        flightRouting: action.flightRouting,
        flightClass: action.flightClass,
        stops: action.stops,
        departureTime: action.departureTime,
        origin: action.origin,
        destination: action.destination,
        adultsCount: action.adultsCount,
        children: action.children,
        flexSearch: action.flexSearch
      });
    default:
      return state;
  }
}