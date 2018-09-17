import requester, { store } from '../../initDependencies';
import { setLocRateWebsocketConnection } from '../../actions/socketInfo';
import { updateLocAmounts } from '../../actions/locAmountsInfo';
import { setLocRate, setLocEurRate } from '../../actions/dynamicLocRatesInfo';
import { CurrencyConverter } from '../utilities/currencyConverter';

import WS from './websocket';

const DEFAULT_CRYPTO_CURRENCY = 'EUR';

class LocRateWS extends WS {
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
    store.dispatch(setLocRateWebsocketConnection(true));
  }

  handleRecieveMessage(event) {
    if (event) {
      const data = JSON.parse(event.data);
      const fiatInEur = Number(data.id);
      store.dispatch(updateLocAmounts(data.id, data.locAmount));
      store.dispatch(setLocEurRate(fiatInEur / data.locAmount));

      const rates = store.getState().currenciesRatesInfo.rates;
      if (rates) {
        const fiatAmount = rates && CurrencyConverter.convert(rates, DEFAULT_CRYPTO_CURRENCY, store.getState().paymentInfo.currency, fiatInEur);
        const locRate = fiatAmount / data.locAmount;
        store.dispatch(setLocRate(locRate));
      }
    }
  }

  getLocEurRate() {
    requester.getLocRateByCurrency(DEFAULT_CRYPTO_CURRENCY).then(res => {
      res.body.then(data => {
        const locEurRate = data[0]['price_eur'];
        store.dispatch(setLocEurRate(locEurRate));

        const rates = store.getState().currenciesRatesInfo.rates;
        if (rates) {
          const fiatAmount = rates && CurrencyConverter.convert(rates, DEFAULT_CRYPTO_CURRENCY, store.getState().paymentInfo.currency, store.getState().dynamicLocRatesInfo.fiatAmount);
          const locRate = fiatAmount / (store.getState().dynamicLocRatesInfo.fiatAmount / locEurRate);
          store.dispatch(setLocRate(locRate));
        }
      });
    });
  }

  close() {
    super.close(() => {
      if (store.getState().socketInfo.isLocRateWebsocketConnected) {
        store.dispatch(setLocRateWebsocketConnection(false));
      }
      this.getLocEurRate();
    });
  }
}

export default LocRateWS;

export const LocRateWebSocket = new LocRateWS();