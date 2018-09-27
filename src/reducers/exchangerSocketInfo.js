import { exchangerSocketInfo } from '../actions/actionTypes';

const initialState = {
  isLocPriceWebsocketConnected: false,
  isLocRateWebsocketConnected: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case exchangerSocketInfo.SET_LOC_PRICE_WEBSOCKET_CONNECTION:
      return {
        ...state,
        isLocPriceWebsocketConnected: action.isLocPriceWebsocketConnected
      };

    case exchangerSocketInfo.SET_LOC_RATE_WEBSOCKET_CONNECTION:
      return {
        ...state,
        isLocRateWebsocketConnected: action.isLocRateWebsocketConnected
      };

    default:
      return state;
  }
}