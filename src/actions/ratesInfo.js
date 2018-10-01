import { ratesInfo } from './actionTypes';

export function setCurrencyRates(currenciesRates) {
  return {
    type: ratesInfo.SET_CURRENCY_RATES,
    currenciesRates
  };
}

export function setBaseLocRate(baseLocRate) {
  return {
    type: ratesInfo.SET_BASE_LOC_RATE,
    baseLocRate
  };
}

export function setLocRateFiatAmount(locRateFiatAmount) {
  return {
    type: ratesInfo.SET_LOC_RATE_FIAT_AMOUNT,
    locRateFiatAmount
  };
}