import { searchDatesInfo } from './actionTypes';

export function asyncSetStartDate(startDate) {
  return function (dispatch) {
    return Promise.resolve(dispatch(setStartDate(startDate)));
  };
}

function setStartDate(startDate) {
  return {
    type: searchDatesInfo.SET_START_DATE,
    startDate: startDate,
  };
}

export function asyncSetEndDate(endDate) {
  return function (dispatch) {
    return Promise.resolve(dispatch(setEndDate(endDate)));
  };
}

function setEndDate(endDate) {
  return {
    type: searchDatesInfo.SET_END_DATE,
    endDate: endDate
  };
}