import { bookingBestPrice } from './actionTypes';

export function setBestPrice(price) {
  return {
    type: bookingBestPrice.SET_BEST_PRICE,
    price,
  };
} 