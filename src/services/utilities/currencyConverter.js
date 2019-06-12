import { isMobileWebView } from './mobileWebView'

class CurrencyConverter {
  static convert(exchangeRates, from, to, quantity) {
    if (isMobileWebView) {
      let result = null;

      try {
        result = quantity * exchangeRates[from][to];
      } catch (error) {
        console.warn(`Error in conversion - from:${from}  to:${to}  quantity:${quantity}`)
      }
      
      return result;
    }

    return quantity * exchangeRates[from][to];
  }
}

export { CurrencyConverter };
