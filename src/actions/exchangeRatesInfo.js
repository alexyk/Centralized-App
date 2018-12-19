import { exchangeRatesInfo } from "./actionTypes";

export function setCurrencyExchangeRates(currencyExchangeRates) {
  return {
    type: exchangeRatesInfo.SET_CURRENCY_EXCHANGE_RATES,
    currencyExchangeRates
  };
}

export function setLocEurRate(locEurRate) {
  return {
    type: exchangeRatesInfo.SET_LOC_EUR_RATE,
    locEurRate
  };
}

export function setLocRateFiatAmount(locRateFiatAmount) {
  return {
    type: exchangeRatesInfo.SET_LOC_RATE_FIAT_AMOUNT,
    locRateFiatAmount
  };
}
