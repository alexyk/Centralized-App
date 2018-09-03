import { paymentInfo } from '../actions/actionTypes';

const initialState = {
  currency: localStorage['currency'] ? localStorage['currency'] : 'USD',
  currencySign: localStorage['currencySign'] ? localStorage['currencySign'] : '$',
  locRate: null,
  locRateInEur: null,
  isBookingConfirmPage: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case paymentInfo.SET_CURRENCY:
      localStorage['currency'] = action.currency;
      localStorage['currencySign'] = getCurrencySign(action.currency);
      return {
        ...state,
        currency: action.currency,
        currencySign: getCurrencySign(action.currency)
      };

    case paymentInfo.SET_LOC_RATE:
      if (state.isBookingConfirmPage === action.isBookingConfirmPage && action.page === 'ConfirmPage') {
        return {
          ...state,
          locRate: action.locRate
        };
      } else if (state.isBookingConfirmPage === action.isBookingConfirmPage && action.page === 'Nav') {
        return {
          ...state,
          locRate: action.locRate
        };
      }

      return state;

    case paymentInfo.SET_LOC_RATE_IN_EUR:
      if (state.isBookingConfirmPage === action.isBookingConfirmPage && action.page === 'ConfirmPage') {
        return {
          ...state,
          locRateInEur: action.locRateInEur
        };
      } else if (state.isBookingConfirmPage === action.isBookingConfirmPage && action.page === 'Nav') {
        return {
          ...state,
          locRateInEur: action.locRateInEur
        };
      }

      return state;

    case paymentInfo.SET_IS_BOOKING_CONFIRM_PAGE:
      return {
        ...state,
        isBookingConfirmPage: action.isBookingConfirmPage
      };
    default:
      return state;
  }
}

function getCurrencySign(currency) {
  let currencySign = '$';
  if (currency === 'GBP') currencySign = '£';
  if (currency === 'EUR') currencySign = '€';
  return currencySign;
}