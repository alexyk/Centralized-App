import { exchangerSocketInfo } from "../actions/actionTypes";

const initialState = {
  isExchangerWebsocketConnected: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case exchangerSocketInfo.SET_EXCHANGER_WEBSOCKET_CONNECTION:
      return {
        ...state,
        isExchangerWebsocketConnected: action.isExchangerWebsocketConnected
      };

    default:
      return state;
  }
}
