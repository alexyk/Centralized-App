import { Config } from '../../config';
import { store } from '../../initDependencies';
import { updateLocAmounts, clearLocAmounts } from '../../actions/paymentInfo';
import { setLocPriceWebsocketConnection } from '../../actions/socketInfo';

const WEBSOCKET_RECONNECT_DELAY = 5000;

class LocPriceWS {
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
    store.dispatch(setLocPriceWebsocketConnection(true));
  }

  sendMessage(message) {
    if (this.ws.readyState === 1) {
      this.ws.send(message);
    }
  }

  handleRecieveMessage(event) {
    if (event) {
      const data = JSON.parse(event.data);
      console.log(data);
      store.dispatch(updateLocAmounts(data.id, data.locAmount));
    }
  }

  close(args) {
    store.dispatch(clearLocAmounts());
    store.dispatch(setLocPriceWebsocketConnection(false));
    if (args.shoudSocketReconnect) {
      setTimeout(() => {
        args.initSocket();
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

export default LocPriceWS;

export const LocPriceWebSocket = new LocPriceWS();