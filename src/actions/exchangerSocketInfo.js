import { exchangerSocketInfo } from "./actionTypes";

export function setExchangerWebsocketConnection(isExchangerWebsocketConnected) {
  return {
    type: exchangerSocketInfo.SET_EXCHANGER_WEBSOCKET_CONNECTION,
    isExchangerWebsocketConnected
  };
}
