import { countriesInfo } from './actionTypes';
import requester from '../requester';

function requestCountries() {
  return {
    type: countriesInfo.REQUEST_COUNTRIES,
  };
}

function receiveCountries(countries) {
  return {
    type: countriesInfo.RECEIVE_COUNTRIES,
    countries
  };
}

export function fetchCountries() {
  return dispatch => {
    dispatch(requestCountries());
    return requester.getCountries()
      .then(res => res.body)
      .then(countries => dispatch(receiveCountries(countries)));
  };
}