import { exchangeRatesInfo } from '../actions/actionTypes';

const initialState = {
  currencyExchangeRates: null,
  locEurRate: 0,
  locRateFiatAmount: 300
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case exchangeRatesInfo.SET_CURRENCY_EXCHANGE_RATES:
      return {
        ...state,
        currencyExchangeRates: action.currencyExchangeRates
      };

    case exchangeRatesInfo.SET_LOC_EUR_RATE:
      return {
        ...state,
        locEurRate: action.locEurRate
      };

    case exchangeRatesInfo.SET_LOC_RATE_FIAT_AMOUNT:
      return {
        ...state,
        locRateFiatAmount: action.locRateFiatAmount
      };

    default:
      return state;
  }
}