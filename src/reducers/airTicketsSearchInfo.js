import { airTicketsSearchInfo } from '../actions/actionTypes';
import moment from 'moment';

const initialState = {
  routing: '2',
  clazz: '0',
  stops: '-1',
  departureTime: '',
  origin: null,
  destination: null,
  startDate: moment().add(1, 'day'),
  endDate: moment().add(2, 'day'),
  adultsCount: 1,
  children: [],
  infants: 0,
  hasChildren: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case airTicketsSearchInfo.SET_ROUTING:
      return Object.assign({}, state, {
        routing: action.routing
      });
    case airTicketsSearchInfo.SET_CLASS:
      return Object.assign({}, state, {
        clazz: action.clazz
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
        startDate: action.startDate,
        endDate: action.endDate //.diff(action.startDate, 'days') === 0 ? action.endDate.add(1, 'day') : action.endDate
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
        clazz: action.clazz,
        stops: action.stops,
        departureTime: action.departureTime,
        origin: action.origin,
        destination: action.destination,
        startDate: action.startDate,
        endDate: action.endDate.diff(action.startDate, 'days') === 0 ? action.endDate.add(1, 'day') : action.endDate,
        adultsCount: action.adultsCount,
        hasChildren: action.hasChildren
      });
    default:
      return state;
  }
}