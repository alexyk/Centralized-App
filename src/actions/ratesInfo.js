import { ratesInfo } from './actionTypes';

export function setCurrencyRates(currenciesRates) {
  return {
    type: ratesInfo.SET_CURRENCY_RATES,
    currenciesRates
  };
}

export function setLocEurRate(locEurRate) {
  return {
    type: ratesInfo.SET_LOC_EUR_RATE,
    locEurRate
  };
}

export function setLocRateFiatAmount(locRateFiatAmount) {
  return {
    type: ratesInfo.SET_LOC_RATE_FIAT_AMOUNT,
    locRateFiatAmount
  };
}