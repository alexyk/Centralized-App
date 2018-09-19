import { locPriceUpdateTimerInfo } from './actionTypes';

export function setInitialSeconds(initialSeconds) {
  return {
    type: locPriceUpdateTimerInfo.SET_INITIAL_SECONDS,
    initialSeconds
  };
}

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