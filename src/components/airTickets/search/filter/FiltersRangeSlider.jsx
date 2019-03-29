import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import TimeRangeSlider from "react-time-range-slider";
import { MIN_TICKETS_PRICE, MAX_TICKETS_PRICE } from '../../../../constants/constants';

import "../../../../styles/css/components/airTickets/search/filter/air-tickets-search-filter-panel.css";
import InputRange from "react-input-range";

class FiltersRangeSlider extends Component {

  render() {
    const { arrivalTime, departureTime, waitingTimeRange, journeyTimeRange, priceRange } = this.props;

    return (
      <Fragment>
        {arrivalTime &&
          <div className="arrival-range-filters">
            <h5>Arrival Time</h5>
            <div className="number-range-slider">
              <TimeRangeSlider
                maxValue={arrivalTime.end}
                minValue={arrivalTime.start}
                value={arrivalTime}
                onChange={this.props.handleArrivalRange}
                name={'arrivalTime'}
                draggableTrack={true}
              />
              <span className="arrival-start-time">{arrivalTime.start}</span>
              <span className="arrival-end-time">{arrivalTime.end}</span>
            </div>
          </div>
        }
        {departureTime &&
          <div className="departure-range-filters">
            <h5>Departure Time</h5>
            <div className="number-range-slider">
              <TimeRangeSlider
                maxValue={departureTime.end}
                minValue={departureTime.start}
                value={departureTime}
                onChange={this.props.handleDepartureRange}
                name={'departureTime'}
              />
              <span className="departure-start-time">{departureTime.start}</span>
              <span className="departure-end-time">{departureTime.end}</span>
            </div>
          </div>
        }
        {journeyTimeRange &&
          <div className="journey-range-filters">
            <h5>Journey time</h5>
            <div className="number-range-slider">
              <TimeRangeSlider
                maxValue={journeyTimeRange.end}
                minValue={journeyTimeRange.start}
                value={journeyTimeRange}
                onChange={this.props.handleJourneyRange}
                name={'journeyTime'}
              />
              <span className="journey-start-time">{journeyTimeRange.start}</span>
              <span className="journey-end-time">{journeyTimeRange.end}</span>
            </div>
          </div>
        }
        {waitingTimeRange &&
          <div className="waiting-range-filters">
            <h5>Stop-over time</h5>
            <div className="number-range-slider">
              <TimeRangeSlider
                minValue={waitingTimeRange.start}
                maxValue={waitingTimeRange.end}
                value={waitingTimeRange}
                onChange={this.props.handleWaitingTimeRange}
                name={'waitingTimeRange'}
                step={15}
              />
              <span className="waiting-start-time">{waitingTimeRange.start}</span>
              <span className="waiting-end-time">{waitingTimeRange.end}</span>
            </div>
          </div>
        }
        {priceRange &&
          <div className="price-range-filters">
            <h5>Price</h5>
            <div className="number-range-slider">
              <InputRange
                minValue={MIN_TICKETS_PRICE}
                maxValue={MAX_TICKETS_PRICE}
                value={priceRange}
                onChange={this.props.handlePriceRange}
                name={'priceRange'}
                step={50}
              />
            </div>
            <span className="waiting-start-time">{priceRange.min}</span>
            <span className="waiting-end-time">{priceRange.max}</span>
          </div>
        }
      </Fragment>
    );
  }
}

FiltersRangeSlider.propTypes = {
  waitingTimeRange: PropTypes.object,
  departureTime: PropTypes.object,
  arrivalTime: PropTypes.object,
  priceRange: PropTypes.object,
  applyFilters: PropTypes.func,
  handleArrivalRange: PropTypes.func,
  handleDepartureRange: PropTypes.func,
  handleWaitingTimeRange: PropTypes.func,
  handleJourneyRange: PropTypes.func,
  handlePriceRange: PropTypes.func,
  changeStartHandler: PropTypes.func,
  changeCompleteHandler: PropTypes.func
};

export default FiltersRangeSlider;
