import { searchInfo } from '../actions/actionTypes';
import moment from 'moment';

const initialState = {
  startDate: moment().add(1, 'days'),
  endDate: moment().add(2, 'days'),
  nights: 1,
  rooms: [{ adults: '2', children: [] }],
  adults: '2',
  hasChildren: false,
  guests: null,
  region: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case searchInfo.SET_START_DATE:
      return Object.assign({}, state, {
        startDate: action.startDate,
        nights: calculateNights(action.startDate, state.endDate)
      });
    case searchInfo.SET_END_DATE:
      return Object.assign({}, state, {
        endDate: action.endDate,
        nights: calculateNights(state.startDate, action.endDate)
      });
    case searchInfo.SET_REGION:
      return Object.assign({}, state, {
        region: action.region
      });
    case searchInfo.SET_ROOMS_BY_COUNT_OF_ROOMS:
      return Object.assign({}, state, {
        rooms: handleRoomsChange(action.countOfRooms, state.rooms)
      });
    case searchInfo.SET_ROOMS:
      return Object.assign({}, state, {
        rooms: action.rooms
      });
    case searchInfo.SET_ADULTS:
      return Object.assign({}, state, {
        adults: action.countOfAdults
      });
    case searchInfo.SET_CHILDREN:
      return Object.assign({}, state, {
        hasChildren: !state.hasChildren,
        rooms: handleToggleChildren(state.hasChildren, state.rooms)
      });
    case searchInfo.SET_SEARCH_INFO:
      return Object.assign({}, state, {
        startDate: action.startDate,
        endDate: action.endDate.diff(action.startDate, 'days') === 0 ? action.endDate.add(1, 'day') : action.endDate,
        nights: calculateNights(action.startDate, action.endDate),
        region: action.region,
        rooms: action.rooms,
        adults: action.adults,
        hasChildren: action.hasChildren
      });
    default:
      return state;
  }
}

function handleToggleChildren(hasChildren, rooms) {
  rooms = rooms.slice(0);
  if (hasChildren) {
    for (let i = 0; i < rooms.length; i++) {
      rooms[i].children = [];
    }
  }

  return rooms;
}

function handleRoomsChange(countOfRooms, rooms) {
  let cloneRooms = rooms.slice();
  if (cloneRooms.length < countOfRooms) {
    while (cloneRooms.length < countOfRooms) {
      cloneRooms.push({ adults: 1, children: [] });
    }
  } else if (cloneRooms.length > countOfRooms) {
    cloneRooms = cloneRooms.slice(0, countOfRooms);
  }

  return cloneRooms;
}

function calculateNights(startDate, endDate) {
  const checkIn = moment(startDate, 'DD/MM/YYYY');
  const checkOut = moment(endDate, 'DD/MM/YYYY');
  return (checkOut > checkIn) ? checkOut.diff(checkIn, 'days') : 0;
}