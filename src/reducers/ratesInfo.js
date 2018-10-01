import { ratesInfo } from '../actions/actionTypes';

const initialState = {
  currenciesRates: null,
  baseLocRate: null,
  locRateFiatAmount: 1000
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ratesInfo.SET_CURRENCY_RATES:
      return {
        ...state,
        currenciesRates: action.currenciesRates
      };

    case ratesInfo.SET_BASE_LOC_RATE:
      return {
        ...state,
        baseLocRate: action.baseLocRate
      };

    case ratesInfo.SET_LOC_RATE_FIAT_AMOUNT:
      return {
        ...state,
        locRateFiatAmount: action.locRateFiatAmount
      };

    default:
      return state;
  }
}