import { locPriceUpdateTimerInfo } from '../actions/actionTypes';

const initialState = {
  initialSeconds: null,
  seconds: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case locPriceUpdateTimerInfo.SET_INITIAL_SECONDS:
      return {
        ...state,
        initialSeconds: action.initialSeconds,
        seconds: action.initialSeconds
      };

    case locPriceUpdateTimerInfo.SET_SECONDS:
      return {
        ...state,
        seconds: action.seconds === 0 ? state.initialSeconds : action.seconds
      };

    case locPriceUpdateTimerInfo.RESET:
      return {
        ...state,
        initialSeconds: null,
        seconds: null
      };

    default:
      return state;
  }
}