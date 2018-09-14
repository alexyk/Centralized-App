import { dynamicLocRates } from '../actions/actionTypes';

const initialState = {
  locRate: null,
  locRateInEur: null,
  isBookingConfirmPage: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case dynamicLocRates.SET_LOC_RATE:
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

    case dynamicLocRates.SET_LOC_RATE_IN_EUR:
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

    case dynamicLocRates.SET_IS_BOOKING_CONFIRM_PAGE:
      return {
        ...state,
        isBookingConfirmPage: action.isBookingConfirmPage
      };


    default:
      return state;
  }
}