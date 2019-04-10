import React from "react";
import InputRange from "react-input-range";

export default class AirlinesFilter extends React.Component {
  render() {
    if (!this.props.filterOptions.journeyTime) return null;
    return (
      <div className="price-range-filters">
        <h5>Journey Time</h5>
        <div className="number-range-slider">
          <InputRange
            minValue={0}
            maxValue={this.props.filterOptions.journeyTime.max}
            value={this.props.selectedValues.journeyTime.max}
            onChange={this.props.handleJourneyTimeChange}
            name={"priceRange"}
            step={50}
          />
          <span className="waiting-start-time" />
          <span className="waiting-end-time">
            {this.props.selectedValues.journeyTime.max}
          </span>
        </div>
      </div>
    );
  }
}
