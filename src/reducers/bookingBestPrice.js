import { bookingBestPrice } from '../actions/actionTypes';

const initialState = {
  price: 0,
  rate: 0,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case bookingBestPrice.SET_BEST_PRICE:
      return {
        ...state,
        price: action.price,
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