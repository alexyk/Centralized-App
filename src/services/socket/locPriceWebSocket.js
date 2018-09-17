import { store } from '../../initDependencies';
import { updateLocAmounts, clearLocAmounts } from '../../actions/locAmountsInfo';
import { setLocPriceWebsocketConnection } from '../../actions/socketInfo';
import WS from './websocket';

class LocPriceWS extends WS {
  constructor() {
    super();
  }

  initSocket() {
    super.initSocket();
    super.getWS().onmessage = this.handleRecieveMessage;
    super.getWS().onopen = this.connect;
    super.getWS().onclose = () => { this.close(this); };
  }

  connect() {
    store.dispatch(setLocPriceWebsocketConnection(true));
  }

  handleRecieveMessage(event) {
    if (event) {
      const data = JSON.parse(event.data);
      console.log(data);
      store.dispatch(updateLocAmounts(data.id, data.locAmount));
    }
  }

  close() {
    super.close(() => {
      if (store.getState().socketInfo.isLocPriceWebsocketConnected) {
        store.dispatch(clearLocAmounts());
        store.dispatch(setLocPriceWebsocketConnection(false));
      }
    });
  }
}

export default LocPriceWS;

export const LocPriceWebSocket = new LocPriceWS();