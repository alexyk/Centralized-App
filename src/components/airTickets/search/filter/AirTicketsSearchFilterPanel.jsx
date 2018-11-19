import React, { Component } from 'react';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import PropTypes from 'prop-types';

import '../../../../styles/css/components/airTickets/search/filter/air-tickets-search-filter-panel.css';

class AirTicketsSearchFilterPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      airline: '',
      change: '',
      priceRange: '',
      waitingTimeRange: '',
      arrivals: '',
      departures: '',
      transfers: ''
    };

    this.onChange = this.onChange.bind(this);
    this.handlePriceRangeSelect = this.handlePriceRangeSelect.bind(this);
    this.handleWaitingRangeSelect = this.handleWaitingRangeSelect.bind(this);
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    }, () => console.log(this.state));
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
    }, () => { console.log(this.state); });
  }

  handleWaitingRangeSelect(event) {
    const waitingTimeRange = event.target.value;
    this.setState({
      waitingTimeRange
    }, () => { console.log(this.state); });
  }

  render() {
    const { isSearchReady, filters } = this.props;

    if (!isSearchReady) {
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

    console.log(filters);

    const { airline, change, priceRange, waitingTimeRange, arrivals, departures, transfers } = this.state;

    // if (props.windowWidth <= 991 && !props.showFiltersMobile) {
    //   return (
    //     <div className="filter-box">
    //       <div onClick={props.handleShowFilters} className="show-filters">Show Filters</div>
    //     </div>
    //   );
    // }

    return (
      <div className="filter-box">
        {isSearchReady}
        <div>
          <div className="filter airlines-filter">
            <h5>Airlines</h5>
            <div className="select">
              <select name="airline" value={airline} onChange={this.onChange} multiple>
                <option defaultValue="" disabled hidden></option>
                {filters.airlines.map((airline, airlineIndex) => {
                  return <option key={airlineIndex} value={airline.id}>{airline.value}</option>;
                })}
              </select>
            </div>
          </div>
        </div>
        <div className="filter changes-filter">
          <h5>Changes</h5>
          <div className="select">
            <select name="change" value={change} onChange={this.onChange} multiple>
              <option defaultValue="" disabled hidden></option>
              {filters.changes.map((change, changeIndex) => {
                return <option key={changeIndex} value={change.id}>{change.value}</option>;
              })}
            </select>
          </div>
        </div>
        <div className="filter airports-filter">
          <h5>Airports</h5>
          <h6>Arrivals</h6>
          <div className="select">
            <select name="arrivals" value={arrivals} onChange={this.onChange} multiple>
              <option defaultValue="" disabled hidden></option>
              {filters.airports.arrivals.map((arrivalAirport, arrivalAirportIndex) => {
                return <option key={arrivalAirportIndex} value={arrivalAirport.id}>{arrivalAirport.value}</option>;
              })}
            </select>
          </div>
          <h6>Departures</h6>
          <div className="select">
            <select name="departures" value={departures} onChange={this.onChange} multiple>
              <option defaultValue="" disabled hidden></option>
              {filters.airports.departures.map((departureAirport, departureAirportIndex) => {
                return <option key={departureAirportIndex} value={departureAirport.id}>{departureAirport.value}</option>;
              })}
            </select>
          </div>
          <h6>Transfers</h6>
          <div className="select">
            <select name="transfers" value={transfers} onChange={this.onChange} multiple>
              <option defaultValue="" disabled hidden></option>
              {filters.airports.transfers.map((transferAirport, transferAirportIndex) => {
                return <option key={transferAirportIndex} value={transferAirport.id}>{transferAirport.value}</option>;
              })}
            </select>
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
        {filters.waiting.max && filters.waiting.min &&
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
        <button onClick={this.applyFilters} className="btn btn">Apply Filters</button>
        <button onClick={this.clearFilters} className="btn btn">Clear Filters</button>
      </div>
    );
  }
}

AirTicketsSearchFilterPanel.propTypes = {
  isSearchReady: PropTypes.bool,
  filters: PropTypes.object
};

export default AirTicketsSearchFilterPanel;