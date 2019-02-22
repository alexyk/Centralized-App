import React, { Component } from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import NumberRangeSlider from '../../../common/numberRangeSlider';
import TimeRangeSlider from 'react-time-range-slider';
import FilterCheckbox from '../../../common/filter/FilterCheckbox';

import '../../../../styles/css/components/airTickets/search/filter/air-tickets-search-filter-panel.css';


class AirTicketsSearchFilterPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      airlines: [],
      stops: [],
      airportsDeparture: [],
      airportsArrival: [],
      airportsTransfer: [],
      priceRange: '',
      waitingTimeRange: '',
      departure: {
        start: "00:00",
        end: "23:59"
      },
      arrival: {
        start: "00:00",
        end: "23:59"
      },
      journey: {
        start: "00:00",
        end: "23:59"
      }
    };

    this.onChange = this.onChange.bind(this);
    this.handlePriceRangeSelect = this.handlePriceRangeSelect.bind(this);
    this.handleWaitingRangeSelect = this.handleWaitingRangeSelect.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
    this.departureTmeChangeHandler = this.departureTmeChangeHandler.bind(this);
    this.arrivalTmeChangeHandler = this.arrivalTmeChangeHandler.bind(this);
    this.journeyTmeChangeHandler = this.journeyTmeChangeHandler.bind(this);
    this.handleStops = this.handleStops.bind(this);
  }

  onChange(name, option) {
    this.setState({
      [name]: option
    }, () => this.props.applyFilters(this.state));
  }

  getCurrencySign(currency) {
    let currencySign = '$';
    if (currency === 'GBP') currencySign = '£';
    if (currency === 'EUR') currencySign = '€';
    return currencySign;
  }

  handlePriceRangeSelect(priceRange) {
    this.setState({
      priceRange
    }, () => this.props.applyFilters(this.state));
  }

  handleWaitingRangeSelect(waitingTimeRange) {
    this.setState({
      waitingTimeRange
    }, () => this.props.applyFilters(this.state));
  }

  clearFilters() {
    this.setState({
      airlines: [],
      stops: [],
      airportsDeparture: [],
      airportsArrival: [],
      airportsTransfer: [],
      priceRange: '',
      waitingTimeRange: '',
      departure: {
        start: "00:00",
        end: "23:59"
      },
      arrival: {
        start: "00:00",
        end: "23:59"
      },
      journey: {
        start: "00:00",
        end: "23:59"
      }
    }, () => this.props.applyFilters(this.state));
  }

  departureTmeChangeHandler(time) {
    this.setState({
        departure: time
    }, () => this.props.applyFilters(this.state));
  }

  arrivalTmeChangeHandler(time) {
    this.setState({
        arrival: time
    }, () => this.props.applyFilters(this.state));
  }

  journeyTmeChangeHandler(time) {
    this.setState({
        journey: time
    }, () => this.props.applyFilters(this.state));
  }

  handleStops(stop) {
    let stopElement = JSON.parse(stop.target.value);

    this.setState({
      stops: [stopElement]
    }, () => this.props.applyFilters(this.state));
  }

  mapStopName(stopId) {
    let stopName = '';

    switch(stopId) {
      case '0':
        stopName = 'Direct flight';
        break;
      case '1':
        stopName = 'One stop';
        break;
      case '2':
        stopName = 'Multi stop';
        break;
      default:
        break;
    }

    return stopName;
  }

  render() {
    const { loading, filters, windowWidth, showFiltersMobile } = this.props;

    if (loading) {
      return (
        <div className="filter-box">
          <div className="form-group">
            <h6 className="filter-info">Search in progress, filtering will be possible after it is completed</h6>
          </div>
        </div>
      );
    }

    if (!filters) {
      return (
        <div className="filter-box">
          <div className="form-group">
            <h6 className="filter-info">No availbale filters for this search.</h6>
          </div>
        </div>
      );
    }

    const { airlines, stops, priceRange, waitingTimeRange, airportsArrival, airportsDeparture, airportsTransfer, departure, arrival, journey } = this.state;

    if (windowWidth <= 1024 && !showFiltersMobile) {
      return (
        <div className="filter-box">
          <div onClick={this.props.handleShowFilters} className="show-filters">Show Filters</div>
        </div>
      );
    }

    const priceObject = { min: 0, max: 10000 };

    return (
      <div className="filter-box">
        {filters.changes &&
        <div className="filter stops-filter">
          <h5>Stops</h5>
          <ul>
              {filters.changes.map((stop, index) => {
                return (
                  <li key={index} onClick={this.handleStops} value={stops}>
                    <FilterCheckbox
                      id={stop.changesName}
                      value={JSON.stringify(stop)}
                      key={index}
                      text={this.mapStopName(stop.changesId)}
                    />
                  </li>
                );
              }
            )}
          </ul>
        </div>}
        <div className="filter time-range-filter">
          <div className="departure-range-filters">
              <h5>Departure Time</h5>
              <TimeRangeSlider
                disabled={false}
                format={24}
                maxValue={"23:59"}
                minValue={"00:00"}
                name={"time_range"}
                onChange={this.departureTmeChangeHandler}
                step={15}
                value={departure}/>
                <span className="time-range-min-value">{departure.start}</span>
                <span className="time-range-min-end">{departure.end}</span>
          </div>
          <div className="arrival-range-filters">
              <h5>Arrival Time</h5>
              <TimeRangeSlider
                disabled={false}
                format={24}
                maxValue={"23:59"}
                minValue={"00:00"}
                name={"time_range"}
                onChange={this.arrivalTmeChangeHandler}
                step={15}
                value={arrival}/>
                <span className="time-range-min-value">{arrival.start}</span>
                <span className="time-range-min-end">{arrival.end}</span>
          </div>
          <div className="journey-range-filters">
              <h5>Journey Time</h5>
              <TimeRangeSlider
                disabled={false}
                format={24}
                maxValue={"23:59"}
                minValue={"00:00"}
                name={"time_range"}
                onChange={this.journeyTmeChangeHandler}
                step={15}
                value={journey}/>
                <span className="time-range-min-value">{journey.start}</span>
                <span className="time-range-min-end">{journey.end}</span>
          </div>
        </div>
        <div className="filter airlines-filter">
          <h5>Airlines</h5>
          <Select
            name="airlines"
            placeholder=""
            value={airlines}
            getOptionValue={(option) => option.airlineId}
            getOptionLabel={(option) => option.airlineName}
            options={filters.airlines}
            onChange={(option) => this.onChange('airlines', option)}
            isMulti
          />
        </div>
        {filters.airports &&
          <div className="filter airports-filter">
            <h5>Airports</h5>
            {filters.airports.arrivals.length > 1 &&
            <div className="arrivals">
              <h6>Arrivals</h6>
                <Select
                  name="airportsArrival"
                  placeholder=""
                  value={airportsArrival}
                  getOptionValue={(option) => option.airportId}
                  getOptionLabel={(option) => option.airportName}
                  options={filters.airports.arrivals}
                  onChange={(option) => this.onChange('airportsArrival', option)}
                  isMulti
                />
            </div>}

            {filters.airports && filters.airports.transfers.length > 1 &&
            <div className="transfers">
              <h6>Transfers</h6>
              <Select
                name="airportsTransfer"
                placeholder=""
                value={airportsTransfer}
                getOptionValue={(option) => option.airportId}
                getOptionLabel={(option) => option.airportName}
                options={filters.airports.transfers}
                onChange={(option) => this.onChange('airportsTransfer', option)}
                isMulti
              />
            </div>}
        </div>}

        {filters.price && filters.price.maxPrice && filters.price.minPrice &&
          <div className="price-range-filters">
            <h5>Pricing</h5>
            <NumberRangeSlider
              minLabel={`${this.getCurrencySign(filters.price.currency)} ${priceRange ? priceRange.min : priceObject.min}`}
              maxLabel={`${this.getCurrencySign(filters.price.currency)} ${priceRange ? priceRange.max : priceObject.max}`}
              minValue={priceObject.min}
              maxValue={priceObject.max}
              value={priceRange ? priceRange : priceObject}
              onChange={this.handlePriceRangeSelect}
            />
          </div>}
        {filters.waiting && filters.waiting.max && filters.waiting.min &&
          <div className="waiting-range-filters">
            <h5>Stop-over time</h5>
            <NumberRangeSlider
              minLabel={`${filters.waiting.min} min`}
              maxLabel={`${filters.waiting.max} min`}
              minValue={filters.waiting.min}
              maxValue={filters.waiting.max}
              value={waitingTimeRange ? waitingTimeRange : filters.waiting}
              onChange={this.handleWaitingRangeSelect}
            />
          </div>}
        <div className="buttons-holder">
          <button onClick={this.clearFilters} className="button">Clear Filters</button>
        </div>
      </div>
    );
  }
}

AirTicketsSearchFilterPanel.propTypes = {
  loading: PropTypes.bool,
  filters: PropTypes.object,
  windowWidth: PropTypes.number,
  showFiltersMobile: PropTypes.bool,
  handleShowFilters: PropTypes.func,
  applyFilters: PropTypes.func,
  toggle: PropTypes.func
};

export default AirTicketsSearchFilterPanel;
