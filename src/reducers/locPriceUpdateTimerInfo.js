import { locPriceUpdateTimerInfo } from "../actions/actionTypes";

const initialState = {
  seconds: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case locPriceUpdateTimerInfo.SET_SECONDS:
      return {
        ...state,
        seconds: action.seconds < 0 ? 0 : action.seconds
      };

    case locPriceUpdateTimerInfo.RESET:
      return {
        ...state,
        seconds: null
      };

    default:
      return state;
  }
}
