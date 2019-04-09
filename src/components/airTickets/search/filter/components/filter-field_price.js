import React from "react";
import InputRange from "react-input-range";
import {
  MAX_TICKETS_PRICE,
  MIN_TICKETS_PRICE
} from "../../../../../constants/constants";

export default class PriceFilter extends React.Component {
  render() {
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
            {this.props.selectedValues.price.min}
          </span>
          <span className="waiting-end-time">
            {this.props.selectedValues.price.max}
          </span>
        </div>
      </div>
    );
  }
}
