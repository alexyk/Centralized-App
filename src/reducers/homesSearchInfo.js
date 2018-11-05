import {
  homesSearchInfo
} from '../actions/actionTypes';

const initialState = {
  country: '',
  guests: '2'
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case homesSearchInfo.SET_COUNTRY:
      return Object.assign({}, state, {
        country: action.country
      });
    case homesSearchInfo.SET_GUESTS:
      return Object.assign({}, state, {
        guests: action.guests
      });
    case homesSearchInfo.SET_HOMES_SEARCH_INFO:
      return Object.assign({}, state, {
        country: action.country,
        guests: action.guests
      });
    default:
      return state;
  }
}
