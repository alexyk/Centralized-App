import { homesSearchInfo } from '../actions/actionTypes';

const initialState = {
  country: '',
  guests: '2'
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case homesSearchInfo.SET_REGION:
      return Object.assign({}, state, {
        region: action.region
      });
    case homesSearchInfo.SET_ROOMS_BY_COUNT_OF_ROOMS:
      return Object.assign({}, state, {
        rooms: handleRoomsChange(action.countOfRooms, state.rooms)
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