import { hotelsSearchInfo } from "./actionTypes";

export function setRegion(value) {
  return {
    type: hotelsSearchInfo.SET_REGION,
    region: value
  };
}

export function setRooms(rooms) {
  return {
    type: hotelsSearchInfo.SET_ROOMS,
    rooms
  };
}

export function setRoomsByCountOfRooms(countOfRooms) {
  return {
    type: hotelsSearchInfo.SET_ROOMS_BY_COUNT_OF_ROOMS,
    countOfRooms
  };
}

export function setAdults(countOfAdults) {
  return {
    type: hotelsSearchInfo.SET_ADULTS,
    countOfAdults
  };
}

export function setChildren() {
  return {
    type: hotelsSearchInfo.SET_CHILDREN
  };
}

export function setNationality(value) {
  return {
    type: hotelsSearchInfo.SET_NATIONALITY,
    value
  };
}

export function setHotelsSearchInfo(region, rooms, adults, hasChildren) {
  return {
    type: hotelsSearchInfo.SET_HOTELS_SEARCH_INFO,
    region,
    rooms,
    adults,
    hasChildren
  };
}
