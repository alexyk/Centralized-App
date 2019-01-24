import { exchangeRatesInfo } from "./actionTypes";
import requester from "../requester";

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

export function fetchCurrencyRates() {
  return dispatch => {
    dispatch({ type: exchangeRatesInfo.FETCH_CURRENCY_EXCHANGE_RATES });
    requester.getCurrencyRates().then(res => {
      res.body.then(currencyExchangeRates => {
        dispatch(setCurrencyExchangeRates(currencyExchangeRates));
      });
    });
  };
}

export function fetchLocEurRate() {
  const baseCurrency = "EUR";
  return dispatch => {
    dispatch({ type: exchangeRatesInfo.FETCH_LOC_EUR_RATE });
    requester.getLocRateByCurrency(baseCurrency).then(res => {
      res.body.then(data => {
        dispatch(
          setLocEurRate(Number(data[0][`price_${baseCurrency.toLowerCase()}`]))
        );
      });
    });
  };
}
