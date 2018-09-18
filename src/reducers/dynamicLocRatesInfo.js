import { dynamicLocRatesInfo } from '../actions/actionTypes';

const initialState = {
  fiatAmount: 1000,
  locRate: null,
  locEurRate: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case dynamicLocRatesInfo.SET_FIAT_AMOUNT:
      return {
        ...state,
        fiatAmount: action.fiatAmount
      };

    case dynamicLocRatesInfo.SET_LOC_RATE:
      return {
        ...state,
        locRate: action.locRate
      };

    case dynamicLocRatesInfo.SET_LOC_EUR_RATE:
      return {
        ...state,
        locEurRate: action.locEurRate
      };

    default:
      return state;
  }
}