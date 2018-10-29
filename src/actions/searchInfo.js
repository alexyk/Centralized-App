import { searchInfo } from './actionTypes';

export function setRegion(value) {
  return {
    type: searchInfo.SET_REGION,
    region: value
  };
}

export function setRooms(rooms) {
  return {
    type: searchInfo.SET_ROOMS,
    rooms
  };
}

export function setRoomsByCountOfRooms(countOfRooms) {
  return {
    type: searchInfo.SET_ROOMS_BY_COUNT_OF_ROOMS,
    countOfRooms
  };
}

export function setAdults(countOfAdults) {
  return {
    type: searchInfo.SET_ADULTS,
    countOfAdults
  };
}

export function setChildren() {
  return {
    type: searchInfo.SET_CHILDREN
  };
}

export function setSearchInfo(startDate, endDate, region, rooms, adults, hasChildren) {
  return {
    type: searchInfo.SET_SEARCH_INFO,
    startDate,
    endDate,
    region,
    rooms,
    adults,
    hasChildren
  };
}