import { paymentInfo } from './actionTypes';

export function setCurrency(currency) {
  return {
    type: paymentInfo.SET_CURRENCY,
    currency
  };
}