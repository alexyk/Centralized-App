import { dynamicLocRates } from './actionTypes';

export function setLocRate(locRate, isBookingConfirmPage, page) {
  return {
    type: dynamicLocRates.SET_LOC_RATE,
    locRate,
    isBookingConfirmPage,
    page
  };
}

export function setLocRateInEur(locRateInEur, isBookingConfirmPage, page) {
  return {
    type: dynamicLocRates.SET_LOC_RATE_IN_EUR,
    locRateInEur,
    isBookingConfirmPage,
    page
  };
}

export function setBookingCofirmPage(isBookingConfirmPage) {
  return {
    type: dynamicLocRates.SET_IS_BOOKING_CONFIRM_PAGE,
    isBookingConfirmPage
  };
}