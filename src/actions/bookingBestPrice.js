import { bookingBestPrice } from './actionTypes';

export function setBestLocPrice(locPrice) {
  return {
    type: bookingBestPrice.SET_BEST_LOC_PRICE,
    locPrice,
  };
} 