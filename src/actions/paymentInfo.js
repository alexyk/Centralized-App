import { paymentInfo } from './actionTypes';

export function setCurrency(currency) {
  return {
    type: paymentInfo.SET_CURRENCY,
    currency
  };
}

export function setLocRate(locRate, isBookingConfirmPage, page) {
  return {
    type: paymentInfo.SET_LOC_RATE,
    locRate,
    isBookingConfirmPage,
    page
  };
}

export function setLocRateInEur(locRateInEur, isBookingConfirmPage, page) {
  return {
    type: paymentInfo.SET_LOC_RATE_IN_EUR,
    locRateInEur,
    isBookingConfirmPage,
    page
  };
}

export function setBookingCofirmPage(isBookingConfirmPage) {
  return {
    type: paymentInfo.SET_IS_BOOKING_CONFIRM_PAGE,
    isBookingConfirmPage
  };
}

export function setCurrencyRates(rates) {
  return {
    type: paymentInfo.SET_CURRENCY_RATES,
    rates
  };
}

export function updateLocAmounts(fiatAmount, locAmount) {
  return {
    type: paymentInfo.UPDATE_LOC_AMOUNTS,
    fiatAmount,
    locAmount
  };
}