import requester, { store } from '../../initDependencies';
import { setLocRateWebsocketConnection } from '../../actions/exchangerSocketInfo';
import { setLocRate, setLocEurRate } from '../../actions/dynamicLocRatesInfo';

import WS from './exchangerWebsocket';

const DEFAULT_CRYPTO_CURRENCY = 'EUR';
const DEFAULT_RATE_ID = 'loc-rate';
const DEFAULT_RATE_METHOD = 'getLocRate';

class LocRateWS extends WS {

  initSocket() {
    super.initSocket();
    super.getWS().onmessage = this.handleRecieveMessage;
    super.getWS().onopen = this.connect;
    super.getWS().onclose = () => { this.close(this); };
  }

  connect() {
    store.dispatch(setLocRateWebsocketConnection(true));
  }

  sendMessage(id, method, params) {
    id = id || DEFAULT_RATE_ID;
    method = method || DEFAULT_RATE_METHOD;
    super.sendMessage(id, method, params);
  }

  handleRecieveMessage(event) {
    if (event) {
      const data = JSON.parse(event.data);
      if (data.params) {
        store.dispatch(setLocRate(data.params[`${(store.getState().paymentInfo.currency).toLowerCase()}Rate`]));
        store.dispatch(setLocEurRate(data.params.eurRate));
      }
    }
  }

  getLocRates() {
    requester.getLocRateByCurrency(store.getState().paymentInfo.currency).then(res => {
      res.body.then(data => {
        store.dispatch(setLocRate(Number(data[0][`price_${(store.getState().paymentInfo.currency).toLowerCase()}`])));
      });
    });
    requester.getLocRateByCurrency(DEFAULT_CRYPTO_CURRENCY).then(res => {
      res.body.then(data => {
        store.dispatch(setLocEurRate(Number(data[0]['price_eur'])));
      });
    });
  }

  close() {
    super.close(() => {
      if (store.getState().exchangerSocketInfo.isLocRateWebsocketConnected) {
        store.dispatch(setLocRateWebsocketConnection(false));
      }
      this.getLocRates();
    });
  }
}

export default LocRateWS;

export const LocRateWebSocket = new LocRateWS();