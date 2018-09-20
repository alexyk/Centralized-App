import { exchangerSocketInfo } from './actionTypes';

export function setLocPriceWebsocketConnection(isLocPriceWebsocketConnected) {
  return {
    type: exchangerSocketInfo.SET_LOC_PRICE_WEBSOCKET_CONNECTION,
    isLocPriceWebsocketConnected
  };
}

export function setLocRateWebsocketConnection(isLocRateWebsocketConnected) {
  return {
    type: exchangerSocketInfo.SET_LOC_RATE_WEBSOCKET_CONNECTION,
    isLocRateWebsocketConnected
  };
}