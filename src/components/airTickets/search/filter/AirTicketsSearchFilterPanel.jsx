import React, { Component } from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import NumberRangeSlider from '../../../common/numberRangeSlider';
import TimeRangeSlider from '../../../common/timeRangeSlider';
import FilterCheckbox from '../../../common/filter/FilterCheckbox';

import '../../../../styles/css/components/airTickets/search/filter/air-tickets-search-filter-panel.css';
import { setStops } from '../../../../actions/airTicketsSearchInfo';

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
      departureValue: {
        start: "00:00",
        end: "23:59"
      }
    };

    this.onChange = this.onChange.bind(this);
    this.handlePriceRangeSelect = this.handlePriceRangeSelect.bind(this);
    this.handleWaitingRangeSelect = this.handleWaitingRangeSelect.bind(this);
    this.changeStartHandler = this.changeStartHandler.bind(this);
    this.timeChangeHandler = this.timeChangeHandler.bind(this);
    this.changeCompleteHandler = this.changeCompleteHandler.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
  }

  onChange(name, option) {
    this.setState({
      [name]: option
    });

    setTimeout(() => {
      this.props.applyFilters(this.state);
    }, 2000);
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
    });

    setTimeout(() => {
      this.props.applyFilters(this.state);
    }, 2000);
  }

  handleWaitingRangeSelect(waitingTimeRange) {
    this.setState({
      waitingTimeRange
    });

    setTimeout(() => {
      this.props.applyFilters(this.state);
    }, 2000);
  }

  changeStartHandler(time){

  }

  timeChangeHandler(time){
      this.setState({
          value: time
      });
  }

  changeCompleteHandler(time){

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
      flightTimeRange: ''
    }, () => this.props.applyFilters(this.state));
  }

  handleStopsFilter(stops) {
    this.setState({
      'stops': stops
    });

    this.props.applyFilters(this.state);
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

    const { airlines, stops, priceRange, waitingTimeRange, airportsArrival, airportsDeparture, airportsTransfer, departureTimeRange, returnTimeRange, journeyTimeRange } = this.state;

    if (windowWidth <= 1024 && !showFiltersMobile) {
      return (
        <div className="filter-box">
          <div onClick={this.props.handleShowFilters} className="show-filters">Show Filters</div>
        </div>
      );
    }

    const priceObject = { min: filters.price.minPrice, max: filters.price.maxPrice };

    return (
      <div className="filter-box">
        <div className="filter stops-filter">
          <h5>Stops</h5>
          <ul>
            {filters.changes.map((item, i) => {
              return (
                <li key={i}>
                  <label>
                    <input
                      type="checkbox"
                      name="stops"
                      value={item.changesId}
                      onChange={() => { this.handleStopsFilter(item.changesId)}}
                    />
                    <span>{item.changesName}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="filter duration-filter">
        {filters.departure &&
          <div className="departure-range-filters">
              <h5>Departure</h5>
              <TimeRangeSlider
                disabled={false}
                format={24}
                maxValue={"23:59"}
                minValue={"00:00"}
                name={"time_range"}
                onChangeStart={this.changeStartHandler}
                onChangeComplete={this.changeCompleteHandler}
                onChange={this.timeChangeHandler}
                step={15}
                value={this.state.departureValue}/>
          </div>}
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
        <div className="filter airports-filter">
          <h5>Airports</h5>
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
          </div>
          <div className="departures">
            <h6>Departures</h6>
            <Select
              name="airportsDeparture"
              placeholder=""
              value={airportsDeparture}
              getOptionValue={(option) => option.airportId}
              getOptionLabel={(option) => option.airportName}
              options={filters.airports.departures}
              onChange={(option) => this.onChange('airportsDeparture', option)}
              isMulti
            />
          </div>
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
          </div>
        </div>

        {filters.price.maxPrice && filters.price.minPrice &&
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
