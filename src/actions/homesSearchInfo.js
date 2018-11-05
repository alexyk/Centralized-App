import { homesSearchInfo } from './actionTypes';

export function setCountry(country) {
  return {
    type: homesSearchInfo.SET_COUNTRY,
    country
  };
}

export function setGuests(guests) {
  return {
    type: homesSearchInfo.SET_GUESTS,
    guests
  };
}

export function setHomesSearchInfo(country, guests) {
  return {
    type: homesSearchInfo.SET_HOMES_SEARCH_INFO,
    country,
    guests
  };
}