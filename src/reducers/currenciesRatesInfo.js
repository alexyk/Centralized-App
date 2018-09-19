import { currenciesRatesInfo } from '../actions/actionTypes';

const initialState = {
  rates: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case currenciesRatesInfo.SET_CURRENCY_RATES:
      return {
        ...state,
        rates: action.rates
      };

    default:
      return state;
  }
}