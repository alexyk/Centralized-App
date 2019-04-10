import React from "react";
import InputRange from "react-input-range";
import {
  MAX_TICKETS_PRICE,
  MIN_TICKETS_PRICE
} from "../../../../../constants/constants";
import { CurrencyConverter } from "../../../../../services/utilities/currencyConverter";
import { getCurrencyExchangeRates } from "../../../../../selectors/exchangeRatesInfo.js";
import {
  getCurrency,
  getCurrencySign
} from "../../../../../selectors/paymentInfo";

import connect from "react-redux/es/connect/connect";

class PriceFilter extends React.Component {
  constructor(props) {
    super(props);

    this._formatPriceFromEurToTheSelectedCurrency = this._formatPriceFromEurToTheSelectedCurrency.bind(
      this
    );
  }

  render() {
    if (!this.props.selectedValues.price) return null;
    return (
      <div className="price-range-filters">
        <h5>Price</h5>
        <div className="number-range-slider">
          <InputRange
            minValue={MIN_TICKETS_PRICE}
            maxValue={MAX_TICKETS_PRICE}
            value={this.props.selectedValues.price}
            onChange={this.props.handlePriceRangeChange}
            name={"priceRange"}
            step={50}
          />
          <span className="waiting-start-time">
            {this.props.currencySign}
            {this._formatPriceFromEurToTheSelectedCurrency(
              this.props.selectedValues.price.min
            )}
          </span>
          <span className="waiting-end-time">
            {this.props.currencySign}
            {this._formatPriceFromEurToTheSelectedCurrency(
              this.props.selectedValues.price.max
            )}
          </span>
        </div>
      </div>
    );
  }

  _formatPriceFromEurToTheSelectedCurrency(price) {
    const fiatPriceInCurrentCurrency = CurrencyConverter.convert(
      this.props.currencyExchangeRates,
      "EUR",
      this.props.currency,
      price
    );
    return fiatPriceInCurrentCurrency.toFixed(2);
  }
}

function mapStateToProps(state) {
  const { paymentInfo, exchangeRatesInfo } = state;

  return {
    currency: getCurrency(paymentInfo),
    currencySign: getCurrencySign(paymentInfo),
    currencyExchangeRates: getCurrencyExchangeRates(exchangeRatesInfo)
  };
}
export default connect(mapStateToProps)(PriceFilter);
