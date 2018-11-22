import { Config } from '../../config';
import store from '../../reduxStore';
import { setExchangerWebsocketConnection } from '../../actions/exchangerSocketInfo';
import { updateLocAmounts, clearLocAmounts } from '../../actions/locAmountsInfo';
import { setSeconds } from '../../actions/locPriceUpdateTimerInfo';

const WEBSOCKET_RECONNECT_DELAY = 5000;

class ExchangerWS {
  constructor() {
    this.ws = null;
    this.shoudSocketReconnect = true;
    this.initSocket();
  }

  initSocket() {
    this.ws = new WebSocket(Config.getValue('SOCKET_HOST_PRICE'));
    this.ws.onmessage = this.handleRecieveMessage;
    this.ws.onopen = this.connect;
    this.ws.onclose = () => { this.close(this); };
  }

  connect() {
    store.dispatch(setExchangerWebsocketConnection(true));
  }

  sendMessage(id, method, params) {
    if (this.ws.readyState === 1 && id) {
      this.ws.send(JSON.stringify({ id, method, params }));
    }
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
    if (this.shoudSocketReconnect) {
      if (store.getState().exchangerSocketInfo.isExchangerWebsocketConnected) {
        store.dispatch(clearLocAmounts());
        store.dispatch(setExchangerWebsocketConnection(false));
      }
      setTimeout(() => {
        this.initSocket();
      }, WEBSOCKET_RECONNECT_DELAY);
    }
  }

  disconnect() {
    this.shoudSocketReconnect = false;
    if (this.ws) {
      this.ws.close();
    }
  }
}

export default ExchangerWS;

export const ExchangerWebsocket = new ExchangerWS();