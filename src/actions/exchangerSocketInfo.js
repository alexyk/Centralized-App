import { exchangerSocketInfo } from './actionTypes';

export function setLocPriceWebsocketConnection(isLocPriceWebsocketConnected) {
  return {
    type: exchangerSocketInfo.SET_LOC_PRICE_WEBSOCKET_CONNECTION,
    isLocPriceWebsocketConnected
  };
}