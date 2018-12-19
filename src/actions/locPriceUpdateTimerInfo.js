import { locPriceUpdateTimerInfo } from "./actionTypes";

export function setSeconds(seconds) {
  return {
    type: locPriceUpdateTimerInfo.SET_SECONDS,
    seconds
  };
}

export function reset() {
  return {
    type: locPriceUpdateTimerInfo.RESET
  };
}
