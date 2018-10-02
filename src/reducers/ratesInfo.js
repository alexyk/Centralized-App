import { ratesInfo } from '../actions/actionTypes';

const initialState = {
  currenciesRates: null,
  locEurRate: null,
  locRateFiatAmount: 1000
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ratesInfo.SET_CURRENCY_RATES:
      return {
        ...state,
        currenciesRates: action.currenciesRates
      };

    case ratesInfo.SET_LOC_EUR_RATE:
      return {
        ...state,
        locEurRate: action.locEurRate
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