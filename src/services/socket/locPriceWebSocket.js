import store from '../../reduxStore';
import { updateLocAmounts, clearLocAmounts } from '../../actions/locAmountsInfo';
import { setLocPriceWebsocketConnection } from '../../actions/exchangerSocketInfo';
import WS from './exchangerWebsocket';
import { setSeconds } from '../../actions/locPriceUpdateTimerInfo';

const DEFAULT_SOCKET_METHOD = 'getLocPrice';

class LocPriceWS extends WS {

  initSocket() {
    super.initSocket();
    super.getWS().onmessage = this.handleRecieveMessage;
    super.getWS().onopen = this.connect;
    super.getWS().onclose = () => { this.close(this); };
  }

  connect() {
    store.dispatch(setLocPriceWebsocketConnection(true));
  }

  sendMessage(id, method, params) {
    method = method ? method : DEFAULT_SOCKET_METHOD;
    super.sendMessage(id, method, params);
  }

  handleRecieveMessage(event) {
    if (event) {
      const data = JSON.parse(event.data);
      if (data.params && data.params.secondsLeft) {
        const seconds = Math.round(data.params.secondsLeft / 1000);
        store.dispatch(setSeconds(seconds));
      }
      store.dispatch(updateLocAmounts(data.id, data.params, data.error));
    }
  }

  close() {
    super.close(() => {
      if (store.getState().exchangerSocketInfo.isLocPriceWebsocketConnected) {
        store.dispatch(clearLocAmounts());
        store.dispatch(setLocPriceWebsocketConnection(false));
      }
    });
  }
}

export default LocPriceWS;

export const LocPriceWebSocket = new LocPriceWS();