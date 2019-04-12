import { getCurrencyExchangeRates } from "../../../../../selectors/exchangeRatesInfo.js";
import {
  getCurrency,
  getCurrencySign
} from "../../../../../selectors/paymentInfo";
import connect from "react-redux/es/connect/connect";

import PriceFilter from "./filter-field_price";

function mapStateToProps(state) {
  const { paymentInfo, exchangeRatesInfo } = state;

  return {
    currency: getCurrency(paymentInfo),
    currencySign: getCurrencySign(paymentInfo),
    currencyExchangeRates: getCurrencyExchangeRates(exchangeRatesInfo)
  };
}
export default connect(mapStateToProps)(PriceFilter);
