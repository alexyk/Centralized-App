import React, { Component } from 'react';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import Select from 'react-select';
import PropTypes from 'prop-types';
import moment from 'moment';

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
    };

    this.onChange = this.onChange.bind(this);
    this.handlePriceRangeSelect = this.handlePriceRangeSelect.bind(this);
    this.handleWaitingRangeSelect = this.handleWaitingRangeSelect.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
  }

  onChange(name, option) {
    this.setState({
      [name]: option
    });
  }

  getCurrencySign(currency) {
    let currencySign = '$';
    if (currency === 'GBP') currencySign = '£';
    if (currency === 'EUR') currencySign = '€';
    return currencySign;
  }

  handlePriceRangeSelect(event) {
    const priceRange = event.target.value;
    this.setState({
      priceRange
    });
  }

  handleWaitingRangeSelect(event) {
    const waitingTimeRange = event.target.value;
    this.setState({
      waitingTimeRange
    });
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
    }, () => this.props.applyFilters(this.state));
  }

  render() {
    const { loading, filters } = this.props;

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

    const departureDate = filters.departure.date.min;
    const departureLandingMinTime = filters.departure.landing.min;
    const departureLandingMaxTime = filters.departure.landing.max;
    const departureTakeoffMinTime = filters.departure.takeoff.min;
    const departureTakeoffMaxTime = filters.departure.takeoff.max;
    const departureMomentLandingMin = moment(`${departureDate} ${departureLandingMinTime}`);
    const departureMomentLandingMax = moment(`${departureDate} ${departureLandingMaxTime}`);
    const departureMomentTakeoffMin = moment(`${departureDate} ${departureTakeoffMinTime}`);
    const departureMomentTakeoffMax = moment(`${departureDate} ${departureTakeoffMaxTime}`);

    const arrivalDate = filters.arrival.date.min;
    const arrivalLandingMinTime = filters.arrival.landing.min;
    const arrivalLandingMaxTime = filters.arrival.landing.max;
    const arrivalTakeoffMinTime = filters.arrival.takeoff.min;
    const arrivalTakeoffMaxTime = filters.arrival.takeoff.max;
    const arrivalMomentLandingMin = moment(`${arrivalDate} ${arrivalLandingMinTime}`);
    const arrivalMomentLandingMax = moment(`${arrivalDate} ${arrivalLandingMaxTime}`);
    const arrivalMomentTakeoffMin = moment(`${arrivalDate} ${arrivalTakeoffMinTime}`);
    const arrivalMomentTakeoffMax = moment(`${arrivalDate} ${arrivalTakeoffMaxTime}`);

    const { airlines, stops, priceRange, waitingTimeRange, airportsArrival, airportsDeparture, airportsTransfer } = this.state;

    // if (props.windowWidth <= 991 && !props.showFiltersMobile) {
    //   return (
    //     <div className="filter-box">
    //       <div onClick={props.handleShowFilters} className="show-filters">Show Filters</div>
    //     </div>
    //   );
    // }

    return (
      <div className="filter-box">
        <div className="filter airlines-filter">
          <h5>Airlines</h5>
          <Select
            name="airlines"
            placeholder=""
            value={airlines}
            valueKey={'id'}
            labelKey={'value'}
            options={filters.airlines}
            onChange={(option) => this.onChange('airlines', option)}
            multi
          />
        </div>
        <div className="filter stops-filter">
          <h5>Stops</h5>
          <Select
            name="stops"
            placeholder=""
            value={stops}
            valueKey={'id'}
            labelKey={'value'}
            options={filters.changes}
            onChange={(option) => this.onChange('stops', option)}
            multi
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
              valueKey={'id'}
              labelKey={'value'}
              options={filters.airports.arrivals}
              onChange={(option) => this.onChange('airportsArrival', option)}
              multi
            />
          </div>
          <div className="departures">
            <h6>Departures</h6>
            <Select
              name="airportsDeparture"
              placeholder=""
              value={airportsDeparture}
              valueKey={'id'}
              labelKey={'value'}
              options={filters.airports.departures}
              onChange={(option) => this.onChange('airportsDeparture', option)}
              multi
            />
          </div>
          <div className="transfers">
            <h6>Transfers</h6>
            <Select
              name="airportsTransfer"
              placeholder=""
              value={airportsTransfer}
              valueKey={'id'}
              labelKey={'value'}
              options={filters.airports.transfers}
              onChange={(option) => this.onChange('airportsTransfer', option)}
              multi
            />
          </div>
        </div>
        <div className="filter hide">
          <h5>Departure</h5>
          <div className="departure-filter">
            <div className="departure-landing-time">
              <h6>Landing time</h6>
              <div className="departure-landing-time-hours">
                <select name="hour" id="hour" onChange={this.onChange} value={''}>
                  {Array.apply(null, { length: departureMomentLandingMin.hours() + 1 }).map(Number.call, Number).slice(departureMomentLandingMax.hours()).map(function (item, i) {
                    return i > 0 && <option key={i} value={i}>{i}</option>;
                  })}
                </select>
              </div>
              <div className="departure-landing-time-minutes">
                <select name="minutes" id="minutes" onChange={this.onChange} value={''}>
                  {Array.apply(null, { length: departureMomentLandingMin.minutes() + 1 }).map(Number.call, Number).slice(departureMomentLandingMin.minutes()).map(function (item, i) {
                    return i > 0 && <option key={i} value={i}>{i}</option>;
                  })}
                </select>
              </div>
            </div>
            <div className="departure-takeoff-time">
              <h6>Takeoff time</h6>
              <div className="departure-takeoff-time-hours">
                <select name="hour" id="hour" onChange={this.onChange} value={''}>
                  {Array.apply(null, { length: departureMomentTakeoffMin.hours() + 1 }).map(Number.call, Number).slice(departureMomentTakeoffMin.hours()).map(function (item, i) {
                    return i > 0 && <option key={i} value={i}>{i}</option>;
                  })}
                </select>
              </div>
              <div className="departure-takeoff-time-minutes">
                <select name="minutes" id="minutes" onChange={this.onChange} value={''}>
                  {Array.apply(null, { length: departureMomentTakeoffMin.minutes() + 1 }).map(Number.call, Number).slice(departureMomentTakeoffMax.minutes()).map(function (item, i) {
                    return i > 0 && <option key={i} value={i}>{i}</option>;
                  })}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="filter hide">
          <h5>Return</h5>
          <div className="arrival-filter">
            <div className="arrival-landing-time">
              <h6>Landing time</h6>
              <div className="arrival-landing-time-hours">
                <select name="hour" id="hour" onChange={this.onChange} value={''}>
                  {Array.apply(null, { length: arrivalMomentLandingMax.hours() + 1 }).map(Number.call, Number).slice(arrivalMomentLandingMin.hours()).map(function (item, i) {
                    return i > 0 && <option key={i} value={i}>{i}</option>;
                  })}
                </select>
              </div>
              <div className="arrival-landing-time-minutes">
                <select name="minutes" id="minutes" onChange={this.onChange} value={''}>
                  {Array.apply(null, { length: arrivalMomentLandingMax.minutes() + 1 }).map(Number.call, Number).slice(arrivalMomentLandingMin.minutes()).map(function (item, i) {
                    return i > 0 && <option key={i} value={i}>{i}</option>;
                  })}
                </select>
              </div>
            </div>
            <div className="arrival-takeoff-time">
              <h6>Takeoff time</h6>
              <div className="arrival-takeoff-time-hours">
                <select name="hour" id="hour" onChange={this.onChange} value={''}>
                  {Array.apply(null, { length: arrivalMomentTakeoffMax.hours() + 1 }).map(Number.call, Number).slice(arrivalMomentTakeoffMin.hours()).map(function (item, i) {
                    return i > 0 && <option key={i} value={i}>{i}</option>;
                  })}
                </select>
              </div>
              <div className="arrival-takeoff-time-minutes">
                <select name="minutes" id="minutes" onChange={this.onChange} value={''}>
                  {Array.apply(null, { length: arrivalMomentTakeoffMax.minutes() + 1 }).map(Number.call, Number).slice(arrivalMomentTakeoffMax.minutes()).map(function (item, i) {
                    return i > 0 && <option key={i} value={i}>{i}</option>;
                  })}
                </select>
              </div>
            </div>
          </div>
        </div>
        {filters.price.max && filters.price.min &&
          <div className="price-range-filters">
            <h5>Pricing</h5>
            <ReactBootstrapSlider
              value={priceRange ? priceRange : [filters.price.min, filters.price.max]}
              slideStop={this.handlePriceRangeSelect}
              step={5}
              max={filters.price.max}
              min={filters.price.min}
              orientation="horizontal"
              range={true} />
            <div className="labels">
              <label>{this.getCurrencySign(filters.price.currency)} {(filters.price.min).toFixed(3)}</label>
              <label>{this.getCurrencySign(filters.price.currency)} {(filters.price.max).toFixed(3)}</label>
            </div>
          </div>}
        {filters.waiting && filters.waiting.max && filters.waiting.min &&
          <div className="waiting-range-filters">
            <h5>Waiting time</h5>
            <ReactBootstrapSlider
              value={waitingTimeRange ? waitingTimeRange : [filters.waiting.min, filters.waiting.max]}
              slideStop={this.handleWaitingRangeSelect}
              step={5}
              max={filters.waiting.max}
              min={filters.waiting.min}
              orientation="horizontal"
              range={true} />
            <div className="labels">
              <label>{`${filters.waiting.min} min`}</label>
              <label>{`${filters.waiting.max} min`}</label>
            </div>
          </div>}
        <div className="buttons-holder">
          <button onClick={() => this.props.applyFilters(this.state)} className="btn btn">Apply Filters</button>
          <button onClick={this.clearFilters} className="btn btn">Clear Filters</button>
        </div>
      </div>
    );
  }
}

AirTicketsSearchFilterPanel.propTypes = {
  loading: PropTypes.bool,
  filters: PropTypes.object,
  applyFilters: PropTypes.func
};

export default AirTicketsSearchFilterPanel;