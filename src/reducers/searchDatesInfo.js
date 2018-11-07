import { searchDatesInfo } from '../actions/actionTypes';
import moment from 'moment';

const initialState = {
  startDate: moment().add(1, 'days'),
  endDate: moment().add(2, 'days')
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case searchDatesInfo.SET_START_DATE:
      return Object.assign({}, state, {
        startDate: action.startDate
      });
    case searchDatesInfo.SET_END_DATE:
      return Object.assign({}, state, {
        endDate: action.endDate.isAfter(state.startDate) ? action.endDate : moment(state.startDate).add(1, 'day'),
      });
    default:
      return state;
  }
}