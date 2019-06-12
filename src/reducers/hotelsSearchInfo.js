import { hotelsSearchInfo } from "../actions/actionTypes";

const initialState = {
  rooms: [{ adults: "2", children: [] }],
  adults: "2",
  hasChildren: false,
  region: null,
  nationality: null,
  cachedSearchString: ''
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case hotelsSearchInfo.SET_REGION:
      return Object.assign({}, state, {
        region: action.region
      });
    case hotelsSearchInfo.SET_ROOMS_BY_COUNT_OF_ROOMS:
      return Object.assign({}, state, {
        rooms: handleRoomsChange(action.countOfRooms, state.rooms)
      });
    case hotelsSearchInfo.SET_ROOMS:
      return Object.assign({}, state, {
        rooms: action.rooms
      });
    case hotelsSearchInfo.SET_ADULTS:
      return Object.assign({}, state, {
        adults: action.countOfAdults
      });
    case hotelsSearchInfo.SET_CHILDREN:
      return Object.assign({}, state, {
        hasChildren: !state.hasChildren,
        rooms: handleToggleChildren(state.hasChildren, state.rooms)
      });
    case hotelsSearchInfo.SET_NATIONALITY:
      return Object.assign({}, state, {
        nationality: action.value
      });
    case hotelsSearchInfo.SET_HOTELS_SEARCH_INFO:
      return Object.assign({}, state, {
        region: action.region,
        rooms: action.rooms,
        adults: action.adults,
        hasChildren: action.hasChildren
      });
    case hotelsSearchInfo.CACHE_CURRENT_SEARCH_STRING:
      return Object.assign({}, state, {
        cachedSearchString: action.searchString,
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
