import { bookingBestPrice } from '../actions/actionTypes';

const initialState = {
  locPrice: 0,
  rate: 0,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case bookingBestPrice.SET_BEST_LOC_PRICE:
      return {
        ...state,
        locPrice: action.locPrice,
      };
    case bookingBestPrice.SET_BEST_RATE:
      return {
        ...state,
        rate: action.rate
      };
    default:
      return state;
  }
} 