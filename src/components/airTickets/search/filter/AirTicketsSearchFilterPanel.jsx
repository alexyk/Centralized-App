import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import NumberRangeSlider from '../../../common/numberRangeSlider';
import TimeRangeSlider from 'react-time-range-slider';
import {getStopName} from '../../../common/flights/util';

import '../../../../styles/css/components/airTickets/search/filter/air-tickets-search-filter-panel.css';
import option from "eslint-plugin-jsx-a11y/src/util/implicitRoles/option";


class AirTicketsSearchFilterPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      airlines: [],
      stops: [],
      arrivalAirports: [],
      priceRange: {minPrice: 0, maxPrice: 10000},
      waitTime: {
        start: '',
        end: ''
      },
      departureTime: {
        start: '',
        end: ''
      },
      arrivalTime: {
        start: '',
        end: ''
      },
      journeyTime: {
        start: '',
        end: ''
      }
    };

    this.stopOnChange = this.stopOnChange.bind(this);
    this.handleSlider = this.handleSlider.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
  }

  handleSlider(name, value) {
    this.setState({
      [name]: value
    })
  }

  stopOnChange(e) {
    let isChecked = e.target.checked;
    let stop = e.target.value;
    let value = [];

    if (isChecked) {
      if (this.state.stops.indexOf() === -1) {
        value = [...this.state.stops, stop];
      } else {
        value = [...this.state.stops];
      }
    } else {
      const index = this.state.stops.indexOf(stop);
      value = this.state.stops.slice(index,  1);
    }

    this.setState({
      stops: value
    }, () => this.props.applyFilters(this.state));
  }

  clearFilters() {
    this.setState({
      airlines: [],
      stops: [],
      departureAirports: [],
      arrivalAirports: [],
      transferAirports: [],
      priceRange: {min: 0, max: 10000},
      waitTime: {
        start: '',
        end: ''
      },
      departureTime: {
        start: '',
        end: ''
      },
      arrivalTime: {
        start: '',
        end: ''
      },
      journeyTime: {
        start: '',
        end: ''
      }
    });
  }

  render() {
    const {loading, filters, windowWidth, showFiltersMobile} = this.props;
    const {stops} = this.state;
    const currencySign = localStorage.getItem('currencySign');

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

    if (windowWidth <= 1024 && !showFiltersMobile) {
      return (
        <div className="filter-box">
          <div onClick={this.props.handleShowFilters} className="show-filters">Show Filters</div>
        </div>
      );
    }

    return (
      <div className="filter-box">

        {filters.changes.length &&
        <div className="filter stops-filter">
          <h5>Stops</h5>
          <ul>
            {filters.changes.map((stop, index) => {
                return (
                  <li key={index}>
                    <label htmlFor={stop.changesName}>
                      <input
                        type="checkbox"
                        name="stops[]"
                        value={stop.changesId}
                        id={stop.changeName}
                        defaultChecked={stops.length > 0 && stops.indexOf(stop.changesId) !== -1}
                        onChange={(option) => this.stopOnChange(option)}/>
                      <span>{getStopName(stop.changesId)}</span>
                    </label>
                  </li>
                );
              }
            )}
          </ul>
        </div>
        }

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
};

export default AirTicketsSearchFilterPanel;
