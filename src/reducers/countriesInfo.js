import { countriesInfo } from '../actions/actionTypes';

const initialState = {
  countries: null
};

const countriesReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case (countriesInfo.RECEIVE_COUNTRIES):
      return ({
        countries: action.countries
      });
    default:
      return state;
  }
};

export default countriesReducer;