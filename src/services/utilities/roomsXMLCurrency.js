import { Config } from '../../config.js';
import { ROOMS_XML_CURRENCY, ROOMS_XML_CURRENCY_DEV } from '../../constants/currencies.js';

class RoomsXMLCurrency {

  static get() {
    const env = Config.getValue('env');
    if (env === 'staging' || env === 'development') {
      return ROOMS_XML_CURRENCY_DEV;
    } else {
      return ROOMS_XML_CURRENCY;
    }
  }
}

export {
  RoomsXMLCurrency
};