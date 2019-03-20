import { searchDatesInfo } from "../actions/actionTypes";
import moment from "moment";

const initialState = {
  startDate: moment(),
  endDate: moment().add(1, "days")
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case searchDatesInfo.SET_START_DATE:
      return Object.assign({}, state, {
        startDate: action.startDate,
      });
    case searchDatesInfo.SET_END_DATE:
      return Object.assign({}, state, {
        endDate: action.endDate
      });
    default:
      return state;
  }
}
