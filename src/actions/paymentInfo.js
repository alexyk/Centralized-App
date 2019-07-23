import { paymentInfo } from "./actionTypes";

export function setCurrency(currency) {
  return {
    type: paymentInfo.SET_CURRENCY,
    currency
  };
}

export function setQuoteIdIsValidPollingEnabled(value) {
  return {
    type: paymentInfo.SET_QUOTEID_ISVALID_POLLING_ENABLED,
    value
  };
}
