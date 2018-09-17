import { dynamicLocRatesInfo } from './actionTypes';

export function setLocRate(locRate) {
  return {
    type: dynamicLocRatesInfo.SET_LOC_RATE,
    locRate
  };
}

export function setLocEurRate(locEurRate) {
  return {
    type: dynamicLocRatesInfo.SET_LOC_EUR_RATE,
    locEurRate
  };
}

export function setBookingCofirmPage(isBookingConfirmPage) {
  return {
    type: dynamicLocRatesInfo.SET_IS_BOOKING_CONFIRM_PAGE,
    isBookingConfirmPage
  };
}

export function setFiatAmount(fiatAmount) {
  return {
    type: dynamicLocRatesInfo.SET_FIAT_AMOUNT,
    fiatAmount
  };
}