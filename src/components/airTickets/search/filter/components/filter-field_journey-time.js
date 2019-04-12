import React from "react";
import InputRange from "react-input-range";

export default class AirlinesFilter extends React.Component {
  render() {
    if (!this.props.filterOptions.journeyTime) return null;
    if (!this.props.selectedValues.journeyTime) return null;
    return (
      <div className="price-range-filters">
        <h5>Journey Time</h5>
        <div className="number-range-slider">
          <InputRange
            minValue={this.props.filterOptions.journeyTime.min}
            maxValue={this.props.filterOptions.journeyTime.max}
            value={this.props.selectedValues.journeyTime.max}
            onChange={this.props.handleJourneyTimeChange}
            name={"priceRange"}
            step={50}
          />
          <span className="waiting-start-time">
            {this._convertTimeFromMinutesToHHmm(
              this.props.selectedValues.journeyTime.min
            )}
          </span>
          <span className="waiting-end-time">
            {this._convertTimeFromMinutesToHHmm(
              this.props.selectedValues.journeyTime.max
            )}
          </span>
        </div>
      </div>
    );
  }

  _convertTimeFromMinutesToHHmm(timeInMinutes) {
    var h = (timeInMinutes / 60) | 0,
      m = timeInMinutes % 60 | 0;
    if (!h) {
      return `${timeInMinutes}min`;
    }
    return `${h}h ${m}min`;
  }
}
