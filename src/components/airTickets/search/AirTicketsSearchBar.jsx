import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import AsyncSelect from 'react-select/lib/Async';
import PropTypes from 'prop-types';
import { setFlightClass, setStops, setDepartureTime, setOrigin, setDestination, setFlexSearch } from '../../../actions/airTicketsSearchInfo';
import SelectFlex from '../../common/select';
import AirTicketsDatepickerWrapper from './AirTicketsDatepickerWrapper';
import { Config } from '../../../config';
import PassengersPopup from './common/passengersPopup';
import MultiStopsPopup from './common/multiStopsPopup';

import '../../../styles/css/components/airTickets/search/air-tickets-search-bar.css';

const customStyles = {
  container: (styles) => ({
    ...styles,
    flex: '1 1 0',
    outline: 'none',
    zIndex: '2'
  }),
  valueContainer: (styles) => ({
    ...styles,
    fontSize: '1.2em'
  }),
  input: (styles) => ({
    ...styles,
    outline: 'none',
  }),
  control: (styles) => ({
    ...styles,
    padding: '0 10px',
    cursor: 'pointer',
    boxShadow: 'none',
    border: 0,
  }),
  indicatorSeparator: (styles) => ({
    ...styles,
    display: 'none'
  }),
  menu: (styles) => ({
    ...styles,
    marginTop: '20px'
  }),
  option: (styles, { data, isFocused, isSelected }) => {
    const color = isSelected ? '#d87a61' : 'black';
    return {
      ...styles,
      fontSize: '1.2em',
      textAlign: 'left',
      cursor: 'pointer',
      backgroundColor: isFocused
        ? '#f0f1f3'
        : 'none',
      color: isSelected
        ? color
        : data.color,
      fontWeight: isSelected && '400',
      paddingLeft: isSelected && '30px',
    };
  },
};

class AirTicketsSearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showPassengersPopup: false,
      showMultiStopsPopup: false
    };

    this.getQueryString = this.getQueryString.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.openPassengersPopup = this.openPassengersPopup.bind(this);
    this.closePassengersPopup = this.closePassengersPopup.bind(this);
    this.openMultiStopsPopup = this.openMultiStopsPopup.bind(this);
    this.closeMultiStopsPopup = this.closeMultiStopsPopup.bind(this);
    this.loadOptions = this.loadOptions.bind(this);
  }

  loadOptions(input = '', callback) {
    this.requestAirports(input).then(airports => callback(airports));
  }

  requestAirports(input = '') {
    return fetch(`${Config.getValue('apiHost')}flight/city/search?query=${input}`, {
      headers: {
        'Content-type': 'application/json'
      }
    }).then(res => {
      return res.json().then(towns => {
        let options = [];
        towns.forEach(town => {
          town.airports.forEach(airport => {
            if (airport.code) {
              options.push({ code: airport.code, name: `${town.name}, ${town.cityState ? town.cityState + ', ' : ''}${town.countryName}, ${airport.code} airport` });
            }
          });
        });
        return options;
      });
    });
  }

  getDestinations() {
    const { airTicketsSearchInfo, searchDatesInfo } = this.props;
    const { origin, destination, flightRouting, multiStopsDestinations } = airTicketsSearchInfo;

    let destinations;

    if (flightRouting === '1') {
      destinations = [
        { origin: origin.code, destination: destination.code, date: searchDatesInfo.startDate.format('DD/MM/YYYY') }
      ];
    } else if (flightRouting === '2') {
      destinations = [
        { origin: origin.code, destination: destination.code, date: searchDatesInfo.startDate.format('DD/MM/YYYY') },
        { origin: destination.code, destination: origin.code, date: searchDatesInfo.endDate.format('DD/MM/YYYY') }
      ];
    } else if (flightRouting === '3') {
      destinations = [
        { origin: origin.code, destination: destination.code, date: searchDatesInfo.startDate.format('DD/MM/YYYY') }
      ];

      multiStopsDestinations.forEach((destination) => {
        destinations.push({
          origin: destination.origin.code, destination: destination.destination.code, date: destination.date.format('DD/MM/YYYY')
        });
      });
    }

    return destinations;
  }

  getQueryString() {
    const { flexSearch, adultsCount, children, departureTime, stops, flightClass, flightRouting } = this.props.airTicketsSearchInfo;
    let queryString = '?';

    queryString += 'destinations=' + encodeURI(JSON.stringify(this.getDestinations()));
    queryString += '&adults=' + adultsCount;
    queryString += '&children=' + encodeURI(JSON.stringify(children));
    queryString += '&routing=' + flightRouting;
    queryString += '&flightClass=' + flightClass;
    queryString += '&stops=' + stops;
    queryString += '&flexSearch=' + flexSearch;
    if (departureTime) {
      queryString += '&departureTime=' + departureTime;
    }

    return queryString;
  }

  handleSearch(e) {
    if (e) {
      e.preventDefault();
    }

    this.props.search(this.getQueryString(), e);
  }

  openPassengersPopup() {
    this.setState({
      showPassengersPopup: true
    });
  }

  closePassengersPopup() {
    this.setState({
      showPassengersPopup: false
    });
  }

  openMultiStopsPopup() {
    this.setState({
      showMultiStopsPopup: true
    });
  }

  closeMultiStopsPopup() {
    this.setState({
      showMultiStopsPopup: false
    });
  }

  render() {
    if (this.props.location.pathname.indexOf('/mobile') !== -1) {
      return null;
    }

    const { origin, destination, flexSearch, adultsCount, children, departureTime, stops, flightClass } = this.props.airTicketsSearchInfo;
    const { showMultiStopsPopup } = this.state;

    return (
      <div className="air-tickets">
        <form className="air-tickets-form" onSubmit={this.handleSearch}>
          <div className="air-tickets-form-destinations-dates-wrapper">
            <div className="air-tickets-form-select">
              <AsyncSelect
                styles={customStyles}
                value={origin}
                onChange={(value) => this.props.dispatch(setOrigin(value))}
                loadOptions={this.loadOptions}
                getOptionLabel ={(option)=> option.name}
                getOptionValue ={(option)=> option.code}
                backspaceRemoves={true}
                arrowRenderer={null}
                onSelectResetsInput={false}
                placeholder="Origin"
                required={true}
              />
            </div>
            <div className="air-tickets-form-select">
              <AsyncSelect
                styles={customStyles}
                value={destination}
                onChange={(value) => this.props.dispatch(setDestination(value))}
                loadOptions={this.loadOptions}
                getOptionLabel ={(option)=> option.name}
                getOptionValue ={(option)=> option.code}
                backspaceRemoves={true}
                arrowRenderer={null}
                onSelectResetsInput={false}
                placeholder="Destination"
                required={true}
              />
            </div>
            <div className="air-tickets-form-check-wrap">
              <AirTicketsDatepickerWrapper openMultiStopsPopup={this.openMultiStopsPopup} closeMultiStopsPopup={this.closeMultiStopsPopup} />
            </div>
            <MultiStopsPopup showMultiStopsPopup={showMultiStopsPopup} closeMultiStopsPopup={this.closeMultiStopsPopup} />
          </div>
          <div className="air-tickets-form-flex-search" onClick={() => this.props.dispatch(setFlexSearch())}>
            <div>
              {!flexSearch
                ? 'No flex search'
                : 'With flex search'
              }
            </div>
          </div>
          <div className="air-tickets-form-passengers-wrap">
            <div className="passengers-title" onClick={this.openPassengersPopup}>{Number(adultsCount) + children.length} Passengers</div>
            <PassengersPopup showPassengersPopup={this.state.showPassengersPopup} closePassengersPopup={this.closePassengersPopup} />
          </div>
          <SelectFlex placeholder="Departure time" className="air-tickets-form-departure-time" onChange={(value) => this.props.dispatch(setDepartureTime(value))} value={departureTime}>
            <select name="departureTime">
              <option value="">any</option>
              <option value="0">00:00</option>
              <option value="1">01:00</option>
              <option value="2">02:00</option>
              <option value="3">03:00</option>
              <option value="4">04:00</option>
              <option value="5">05:00</option>
              <option value="6">06:00</option>
              <option value="7">07:00</option>
              <option value="8">08:00</option>
              <option value="9">09:00</option>
              <option value="10">10:00</option>
              <option value="11">11:00</option>
              <option value="12">12:00</option>
              <option value="13">13:00</option>
              <option value="14">14:00</option>
              <option value="15">15:00</option>
              <option value="16">16:00</option>
              <option value="17">17:00</option>
              <option value="18">18:00</option>
              <option value="19">19:00</option>
              <option value="20">20:00</option>
              <option value="21">21:00</option>
              <option value="22">22:00</option>
              <option value="23">23:00</option>
            </select>
          </SelectFlex>
          <SelectFlex placeholder="Flight stops" className="air-tickets-form-flight-stops" onChange={(value) => this.props.dispatch(setStops(value))} value={stops}>
            <select name="flightStops">
              <option value="-1">any</option>
              <option value="0">direct flight</option>
              <option value="1">one stop</option>
              <option value="2">more stops</option>
            </select>
          </SelectFlex>
          <SelectFlex placeholder="Flight class" className="air-tickets-form-flight-class" onChange={(value) => this.props.dispatch(setFlightClass(value))} value={flightClass}>
            <select name="flightClass">
              <option value="0">any</option>
              <option value="E">economy</option>
              <option value="P">premium economy</option>
              <option value="B">business</option>
              <option value="F">first</option>
            </select>
          </SelectFlex>
          <button type="submit" className="button air-tickets-button-search">Search</button>
        </form>
      </div >
    );
  }
}

AirTicketsSearchBar.propTypes = {
  search: PropTypes.func,

  // Router props
  location: PropTypes.object,
  history: PropTypes.object,

  // Redux props
  dispatch: PropTypes.func,
  airTicketsSearchInfo: PropTypes.object,
  searchDatesInfo: PropTypes.object,
  paymentInfo: PropTypes.object,
  modalsInfo: PropTypes.object
};

function mapStateToProps(state) {
  const { airTicketsSearchInfo, searchDatesInfo, paymentInfo, modalsInfo } = state;

  return {
    airTicketsSearchInfo,
    searchDatesInfo,
    paymentInfo,
    modalsInfo
  };
}

export default withRouter(connect(mapStateToProps)(AirTicketsSearchBar));
