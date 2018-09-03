import { paymentInfo } from './actionTypes';

export function setCurrency(currency) {
  return {
    type: paymentInfo.SET_CURRENCY,
    currency
  };
}

export function setLocRate(locRate) {
  return {
    type: paymentInfo.SET_LOC_RATE,
    locRate
  };
}

export function setLocRateInEur(locRateInEur) {
  return {
    type: paymentInfo.SET_LOC_RATE_IN_EUR,
    locRateInEur
  };
}