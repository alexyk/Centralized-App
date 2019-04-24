import React from "react";
import InputRange from "react-input-range";
import { CurrencyConverter } from "../../../../../services/utilities/currencyConverter";
import type { GeneratedFilterOptions } from "../filtering-function";
import { debounceFn } from "./_debounce-function";

type Props = {
  selectedValues: GeneratedFilterOptions,
  filterOptions: GeneratedFilterOptions,
  handlePriceRangeChange: (priceRange: { max: number, min: number }) => void
};
const STEP = 1;

export default class PriceFilter extends React.Component<Props> {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this._formatPriceFromEurToTheSelectedCurrency = this._formatPriceFromEurToTheSelectedCurrency.bind(
      this
    );
    this.debouncedChangeHandler = debounceFn(
      this.props.handlePriceRangeChange,
      100
    );
    this.state = {
      min: props.filterOptions.price.min,
      max: props.filterOptions.price.max
    };
  }

  handleChange(value) {
    this.setState(
      {
        min: value.min - STEP,
        max: value.max + STEP
      },
      () => {
        this.debouncedChangeHandler(this.state);
      }
    );
  }

  render() {
    if (!this.props.selectedValues.price) return null;
    if (!this.props.filterOptions.price) return null;

    return (
      <div className="price-range-filters">
        <h5>Price</h5>
        <div className="number-range-slider">
          <InputRange
            minValue={this.props.filterOptions.price.min}
            maxValue={this.props.filterOptions.price.max}
            value={this.state}
            onChange={this.handleChange}
            name={"priceRange"}
            step={STEP}
          />
          <span className="waiting-start-time">
            {this.props.currencySign}
            {this._formatPriceFromEurToTheSelectedCurrency(this.state.min)}
          </span>
          <span className="waiting-end-time">
            {this.props.currencySign}
            {this._formatPriceFromEurToTheSelectedCurrency(this.state.max)}
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
