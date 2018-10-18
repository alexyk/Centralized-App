import { airTicketsSearchInfo } from '../actions/actionTypes';
import moment from 'moment';

const initialState = {
  routing: null,
  flightClass: '0',
  stops: '-1',
  departureTime: '',
  origin: null,
  destination: null,
  departureDate: moment(),
  arrivalDate: moment().add(1, 'day'),
  adultsCount: 1,
  children: [],
  infants: 0,
  hasChildren: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case airTicketsSearchInfo.SET_ROUTING:
      return Object.assign({}, state, {
        routing: action.routing,
        arrivalDate: setArrivalDate(action.routing, state.departureDate, state.arrivalDate)
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
    case airTicketsSearchInfo.SET_DATES:
      return Object.assign({}, state, {
        departureDate: action.departureDate,
        arrivalDate: setArrivalDate(state.routing, action.departureDate, action.arrivalDate)
      });
    case airTicketsSearchInfo.SET_ADULTS:
      return Object.assign({}, state, {
        adultsCount: action.adultsCount,
      });
    case airTicketsSearchInfo.SET_HAS_CHILDREN:
      return Object.assign({}, state, {
        hasChildren: !state.hasChildren
      });
    case airTicketsSearchInfo.SET_CHILDREN:
      return Object.assign({}, state, {
        children: action.children
      });
    case airTicketsSearchInfo.SET_INFANTS:
      return Object.assign({}, state, {
        infants: action.infants
      });
    case airTicketsSearchInfo.SET_AIR_TICKETS_SEARCH_INFO:
      return Object.assign({}, state, {
        routing: action.routing,
        flightClass: action.flightClass,
        stops: action.stops,
        departureTime: action.departureTime,
        origin: action.origin,
        destination: action.destination,
        departureDate: action.departureDate,
        arrivalDate: setArrivalDate(action.routing, action.departureDate, action.arrivalDate),
        adultsCount: action.adultsCount,
        hasChildren: action.hasChildren,
        children: action.children,
        infants: action.infants
      });
    default:
      return state;
  }
}

function setArrivalDate(routing, departureDate, arrivalDate) {
  if (routing === '2') {
    if (arrivalDate && arrivalDate.diff(departureDate, 'days') !== 0) {
      return arrivalDate;
    }

    return moment(departureDate).add(1, 'day');
  }

  return null;
}