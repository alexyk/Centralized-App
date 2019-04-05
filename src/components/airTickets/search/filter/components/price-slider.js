import InputRange from "react-input-range";
import React from "react";
import {
  MAX_TICKETS_PRICE,
  MIN_TICKETS_PRICE
} from "../../../../../constants/constants";

export default class PriceSlider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      max: props.priceRange.max || MAX_TICKETS_PRICE,
      min: props.priceRange.min || MIN_TICKETS_PRICE
    };

    this.onStateChange = this.onStateChange.bind(this);
  }

  onStateChange(value) {
    this.setState(value, () => {
      if (this.props.onStateChange) {
        let adaptedValue = {
          min: value.min,
          max: value.max
        };
        this.props.onStateChange(adaptedValue);
      }
    });
  }

  render() {
    return (
      <InputRange
        minValue={MIN_TICKETS_PRICE}
        maxValue={MAX_TICKETS_PRICE}
        value={this.state}
        onChange={this.onStateChange}
        name={"priceRange"}
        step={50}
      />
    );
  }
}
