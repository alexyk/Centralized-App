import store from '../../reduxStore';
import { updateLocAmounts, clearLocAmounts } from '../../actions/locAmountsInfo';
import { setLocPriceWebsocketConnection } from '../../actions/exchangerSocketInfo';
import WS from './exchangerWebsocket';

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
      store.dispatch(updateLocAmounts(data.id, data.params));
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