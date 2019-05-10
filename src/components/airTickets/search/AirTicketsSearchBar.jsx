import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { components } from 'react-select';
import AsyncSelect from 'react-select/lib/Async';
import PropTypes from 'prop-types';
import { setFlightRouting, setOrigin, setDestination, setFlexSearch, setStops } from '../../../actions/airTicketsSearchInfo';
import { selectOrigin, selectDestination, selectFlightRouting, selectMultiStopsDestinations, selectFlightClass, selectStops, selectDepartureTime, selectFlexSearch, selectChildren, selectAdultsCount } from '../../../selectors/airTicketsSearchSelector';
import AirTicketsDatepickerWrapper from './AirTicketsDatepickerWrapper';
import { Config } from '../../../config';
import PassengersPopup from './common/passengersPopup';

import '../../../styles/css/components/airTickets/search/air-tickets-search-bar.css';
import { getStartDate, getEndDate } from '../../../selectors/searchDatesInfo';
import { NotificationManager } from 'react-notifications';
import { MISSING_ORIGIN, MISSING_DESTINATION, MISSING_CHILDREN_AGE, MORE_INFANTS_THEN_ADULTS } from '../../../constants/errorMessages';
import { flightRoutingValues } from '../../../constants/constants';

const customStyles = {
  container: (styles) => ({
    ...styles,
    flex: '1 1 0',
    outline: 'none'
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
    marginTop: '20px',
    zIndex: '3 !important'
  }),
  groupHeading: styles => ({
    ...styles,
    fontSize: '1.2em',
    textAlign: 'left',
    fontWeight: '400'
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
      paddingLeft: '30px'
    };
  },
};

class AirTicketsSearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMultiStopsPopup: false,
      showPassengersPopup: false
    };

    this.getQueryString = this.getQueryString.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.openPassengersPopup = this.openPassengersPopup.bind(this);
    this.closePassengersPopup = this.closePassengersPopup.bind(this);
    this.loadOptions = this.loadOptions.bind(this);
    this.changeFlightRouting = this.changeFlightRouting.bind(this);
    this.openMultiStopsPopup = this.openMultiStopsPopup.bind(this);
    this.closeMultiStopsPopup = this.closeMultiStopsPopup.bind(this);
  }

  componentDidMount() {
    this.changeFlightRouting(flightRoutingValues.RT.value);
  }

  loadOptions(input = '', callback) {
    this.requestAirports(input).then(airports => callback(airports));
  }

  requestAirports(input = '') {
    return fetch(`${Config.getValue('apiHost')}flight/city/airports/search?query=${input}`, {
      headers: {
        'Content-type': 'application/json'
      }
    }).then(res => {
      return res.json().then(towns => {
        let groupedOptions = [];
        let currentOptions;
        towns.forEach(town => {
          groupedOptions.push({ label: `${town.cityName}, ${town.countryName}`, options: [] });
          currentOptions = groupedOptions[groupedOptions.length - 1].options;
          if (town.airports.length > 1) {
            currentOptions.push({ code: town.cityCode, name: `${town.cityName} - all airports (${town.cityCode})` });
          }
          town.airports.forEach(airport => {
            if (airport.code) {
              currentOptions.push({ code: airport.code, name: `${airport.name ? airport.name : town.cityName} (${airport.code})` });
            }
          });
        });
        return groupedOptions;
      });
    });
  }

  getDestinations() {
    const { origin, destination, flightRouting, multiStopsDestinations, startDate, endDate } = this.props;
    let destinations = [];

    if (flightRouting === '1') {
      destinations = [
        { origin: origin.code, destination: destination.code, date: startDate.format('DD/MM/YYYY') }
      ];
    } else if (flightRouting === '2') {
      destinations = [
        { origin: origin.code, destination: destination.code, date: startDate.format('DD/MM/YYYY') },
        { origin: destination.code, destination: origin.code, date: endDate.format('DD/MM/YYYY') }
      ];
    } else if (flightRouting === '3') {
      multiStopsDestinations.forEach((destination) => {
        destinations.push({
          origin: destination.origin.code, destination: destination.destination.code, date: destination.date.format('DD/MM/YYYY')
        });
      });
    }

    return destinations;
  }

  getQueryString() {
    const { flexSearch, adultsCount, children, departureTime, stops, flightClass, flightRouting } = this.props;
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

    const hasMultiStops = this.props.multiStopsDestinations !== undefined && this.props.multiStopsDestinations.length;

    const hasChildren = this.props.children !== undefined && this.props.children.length;
    const adultsCount = this.props.adultsCount;
    let infantsCount = 0;
    for (let index in this.props.children) {
      if(this.props.children[index].age === 1 || this.props.children[index].age === 0){
        ++infantsCount;
      }
    }


    if (!hasMultiStops && !this.props.origin) {
      NotificationManager.error(MISSING_ORIGIN);
    } else if (!hasMultiStops && !this.props.destination) {
      NotificationManager.error(MISSING_DESTINATION);
    } else if(hasChildren && infantsCount > adultsCount) {
      NotificationManager.error(MORE_INFANTS_THEN_ADULTS);
    } else {
      this.props.search(this.getQueryString(), e);
    }
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

    return this.state.showMultiStopsPopup;
  }

  closeMultiStopsPopup() {
    this.setState({
      showMultiStopsPopup: false
    });

    return this.state.showMultiStopsPopup;
  }

  mapFlightClassByValue(flightClass) {
    let flightClassName = '';

    switch (flightClass) {
      case 'E':
        flightClassName = 'Economy Class';
        break;
      case 'P':
        flightClassName = 'Premium Economy Class';
        break;
      case 'B':
        flightClassName = 'Business Class';
        break;
      case 'F':
        flightClassName = 'First Class';
        break;
      default:
        flightClassName = 'Any class';
      break;
    }

    return flightClassName;
  }

  changeFlightRouting(flightRouting) {
    if (flightRouting === flightRoutingValues.MS.value) {
      this.openMultiStopsPopup();
    } else {
      this.closeMultiStopsPopup();
    }

    this.props.dispatch(setFlightRouting(flightRouting));
  }

  setDirectFlight() {
    let directFlightValue = '0';

    if (this.props.stops === '0') {
      directFlightValue = '-1';
    }

    this.props.dispatch(setStops(directFlightValue));
  }

  render() {
    if (this.props.location.pathname.indexOf('/mobile') !== -1) {
      return null;
    }

    const { origin, destination, flexSearch, adultsCount, children, flightClass, stops, flightRouting } = this.props;
    const totalTravelers = parseInt(adultsCount, 10) + children.length;

    return (
      <div className="air-tickets">
        <form onSubmit={this.handleSearch}>
          <div className="air-tickets-form-type-wrapper">
            <label className="custom-radio">
              <input
                type="radio"
                onChange={() => this.changeFlightRouting(flightRoutingValues.RT.value)}
                name="flightRouting"
                value={flightRoutingValues.RT.value}
                checked={flightRouting === flightRoutingValues.RT.value}
              />
              <span>{flightRoutingValues.RT.displayText}</span>
            </label>
            <label className="custom-radio">
              <input
                type="radio"
                onChange={() => this.changeFlightRouting(flightRoutingValues.OS.value)}
                name="flightRouting"
                value={flightRoutingValues.OS.value}
                checked={flightRouting === flightRoutingValues.OS.value}
                />
              <span>{flightRoutingValues.OS.displayText}</span>
            </label>
            {/*<label className="custom-radio">*/}
              {/*<input*/}
                {/*type="radio"*/}
                {/*onChange={() => this.changeFlightRouting(flightRoutingValues.MS.value)}*/}
                {/*name="flightRouting"*/}
                {/*value={flightRoutingValues.MS.value}*/}
                {/*checked={flightRouting === flightRoutingValues.MS.value}*/}
              {/*/>*/}
              {/*<span>{flightRoutingValues.MS.displayText}</span>*/}
            {/*</label>*/}
          </div>
          <div className="air-tickets-form-search-bar-filters-wrapper">
            <label className="custom-radio">
              <input
                type="checkbox"
                name="flightStops"
                onChange={() => this.setDirectFlight()}
                value="0"
                checked={stops === '0'}/>
              <span>Direct flight</span>
            </label>
            <label className="custom-radio">
              <input
                type="checkbox"
                onChange={() => this.props.dispatch(setFlexSearch())}
                checked={flexSearch}
              />
              <span>Flex search</span>
            </label>
          </div>
          <div className="air-tickets-form">
            <div className="air-tickets-form-destinations-dates-wrapper">
              <div className="air-tickets-form-select">
                <AsyncSelect
                  styles={customStyles}
                  value={origin}
                  onChange={(value) => this.props.dispatch(setOrigin(value))}
                  loadOptions={this.loadOptions}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.code}
                  backspaceRemoves={true}
                  arrowRenderer={null}
                  onSelectResetsInput={false}
                  placeholder="From City"
                  required={true}
                  components={(props) => {
                    return (
                      <div>
                        <components.Group {...props} />
                      </div>
                    );
                  }}
                />
              </div>
              <div className="air-tickets-form-select">
                <AsyncSelect
                  styles={customStyles}
                  value={destination}
                  onChange={(value) => this.props.dispatch(setDestination(value))}
                  loadOptions={this.loadOptions}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.code}
                  backspaceRemoves={true}
                  arrowRenderer={null}
                  onSelectResetsInput={false}
                  placeholder="To City"
                  required={true}
                  components={(props) => {
                    return (
                      <div>
                        <components.Group {...props} />
                      </div>
                    );
                  }}
                />
              </div>
              <div className="air-tickets-form-check-wrap">
                <AirTicketsDatepickerWrapper openMultiStopsPopup={this.openMultiStopsPopup} closeMultiStopsPopup={this.closeMultiStopsPopup} />
              </div>
            </div>
            <div className="air-tickets-form-passengers-wrap">
              <div className="passengers-title" onClick={this.openPassengersPopup}>
                <span className="travelers-count">{ totalTravelers } </span>
                { totalTravelers === 1 ? 'Passenger' : 'Passengers'},
                <span> {this.mapFlightClassByValue(flightClass)}</span>
              </div>
              <PassengersPopup showPassengersPopup={this.state.showPassengersPopup} closePassengersPopup={this.closePassengersPopup} />
            </div>
            <div className="air-tickets-form-search-btn-wrapper">
              <button type="submit" className="button air-tickets-button-search">Search</button>
            </div>
          </div>
        </form>
      </div>
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
  origin: PropTypes.object,
  destination: PropTypes.object,
  flightRouting: PropTypes.string,
  multiStopsDestinations: PropTypes.array,
  flightClass: PropTypes.string,
  stops: PropTypes.string,
  departureTime: PropTypes.string,
  adultsCount: PropTypes.string,
  children: PropTypes.array,
  flexSearch: PropTypes.bool,
  startDate: PropTypes.object,
  endDate: PropTypes.object
};

function mapStateToProps(state) {
  const { airTicketsSearchInfo, searchDatesInfo } = state;

  return {
    origin: selectOrigin(airTicketsSearchInfo),
    destination: selectDestination(airTicketsSearchInfo),
    flightRouting: selectFlightRouting(airTicketsSearchInfo),
    multiStopsDestinations: selectMultiStopsDestinations(airTicketsSearchInfo),
    flightClass: selectFlightClass(airTicketsSearchInfo),
    stops: selectStops(airTicketsSearchInfo),
    departureTime: selectDepartureTime(airTicketsSearchInfo),
    adultsCount: selectAdultsCount(airTicketsSearchInfo),
    children: selectChildren(airTicketsSearchInfo),
    flexSearch: selectFlexSearch(airTicketsSearchInfo),
    startDate: getStartDate(searchDatesInfo),
    endDate: getEndDate(searchDatesInfo)
  };
}

export default withRouter(connect(mapStateToProps)(AirTicketsSearchBar));
