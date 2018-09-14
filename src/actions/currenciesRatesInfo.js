import { currenciesRatesInfo } from './actionTypes';

export function setCurrencyRates(rates) {
  return {
    type: currenciesRatesInfo.SET_CURRENCY_RATES,
    rates
  };
}