import { socketInfo } from '../actions/actionTypes';

const initialState = {
  isLocPriceWebsocketConnected: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case socketInfo.SET_LOC_PRICE_WEBSOCKET_CONNECTION:
      return {
        ...state,
        isLocPriceWebsocketConnected: action.isLocPriceWebsocketConnected
      };

    default:
      return state;
  }
}