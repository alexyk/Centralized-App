import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { components } from 'react-select';
import AsyncSelect from 'react-select/lib/Async';
import { NotificationManager } from 'react-notifications';
import DatePicker from 'react-datepicker';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import moment from 'moment';
import DateInput from '../../../common/date-input';
import { Config } from '../../../../../config';
import { LONG } from '../../../../../constants/notificationDisplayTimes';
import { setMultiStopsDestinations } from '../../../../../actions/airTicketsSearchInfo';
import { selectFlightRouting, selectMultiStopsDestinations } from '../../../../../selectors/airTicketsSearchSelector';
import { getStartDate } from '../../../../../selectors/searchDatesInfo';

import './style.css';
import 'react-datepicker/dist/react-datepicker.css';
import '../../../../common/datepicker/style.css';

const customStyles = {
  container: (styles) => ({
    ...styles,
    flex: '1 1 0',
    outline: 'none',
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
      paddingLeft: '30px',
    };
  },
};

class MultiStopsPopup extends PureComponent {
  constructor(props) {
    super(props);

    this.destinationsTimeOut = null;

    let destinations;

    if (this.props.destinations && this.props.destinations.length > 0) {
      destinations = this.props.destinations;
    } else {
      destinations = [
        {
          origin: '',
          destination: '',
          date: moment(this.props.startDate)
        }
      ];
    }

    this.state = {
      showPassengersPopup: false,
      destinations
    };

    this.loadOptions = this.loadOptions.bind(this);
    this.requestAirports = this.requestAirports.bind(this);
    this.addDestination = this.addDestination.bind(this);
    this.removeDestination = this.removeDestination.bind(this);
    this.handleOrigin = this.handleOrigin.bind(this);
    this.handleDestination = this.handleDestination.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.applyDestinationsChoose = this.applyDestinationsChoose.bind(this);
    this.populateMultiStopsPopup = this.populateMultiStopsPopup.bind(this);
  }

  componentDidMount() {
    this.populateMultiStopsPopup();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.flightRouting !== this.props.flightRouting && this.props.flightRouting === '3') {
      this.setState({
        showPopup: true
      });
    }
    if ((prevProps.startDate).format() !== (this.props.startDate).format() && this.state.destinations[0].date.isBefore(this.props.startDate)) {
      this.handleDateChange(this.props.startDate, 0);
    }
  }

  componentWillUnmount() {
    if (this.destinationsTimeOut) {
      clearTimeout(this.destinationsTimeOut);
    }
  }

  populateMultiStopsPopup() {
    const searchParams = queryString.parse(this.props.location.search);

    if (searchParams.destinations) {
      const destinations = JSON.parse(searchParams.destinations);
      if (this.state.destinations.length <= destinations.length - 1) {
        this.destinationsTimeOut = setTimeout(() => {
          this.setState({
            destinations: this.props.destinations
          });
        }, 100);
      }
    }
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

  addDestination() {
    if (this.state.destinations.length >= 4) {
      NotificationManager.warning('Max count of destinations is 5!', '', LONG);
    } else {
      this.setState((prevState) => ({
        ...prevState,
        destinations: [...prevState.destinations, { origin: '', destination: '', date: moment(prevState.destinations[prevState.destinations.length - 1].date) }]
      }));
    }
  }

  removeDestination(index) {
    const destinations = [...this.state.destinations];
    destinations.splice(index, 1);
    this.setState({
      destinations
    });
  }

  handleOrigin(value, index) {
    const destinations = [...this.state.destinations];
    destinations[index].origin = value;
    this.setState({
      destinations
    });
  }

  handleDestination(value, index) {
    const destinations = [...this.state.destinations];
    destinations[index].destination = value;
    this.setState({
      destinations
    });
  }

  validateMultiStopsDates(index, destinations) {
    for (let i = index; i < destinations.length; i++) {
      if (i === 0 && destinations[i].date.isBefore(this.props.startDate)) {
        destinations[i].date = this.props.startDate;
      }
      if (i > 0 && destinations[i].date.isBefore(destinations[i - 1].date)) {
        destinations[i].date = destinations[i - 1].date;
      }
    }

    return destinations;
  }

  handleDateChange(value, index) {
    let destinations = [...this.state.destinations];
    destinations[index].date = value;

    destinations = this.validateMultiStopsDates(index, destinations);

    this.setState({
      destinations
    });
  }

  applyDestinationsChoose() {
    this.props.closeMultiStopsPopup();
    this.props.dispatch(setMultiStopsDestinations(this.state.destinations));
  }

  render() {
    console.log(this);
    const { destinations } = this.state;
    const isMobile = window.innerWidth < 1024;
    const monthsToShow = this.props.monthsToShow ? this.props.monthsToShow : (isMobile ? 1 : 2);

    if (!this.props.showMultiStopsPopup) {
      return null;
    }

    return (
      <div className="multi-stops-popup">
        {destinations.map((destination, destinationIndex) => {
          return (
            <div key={destinationIndex} className="multi-stops-popup-item">
              <div className="multi-stops-popup-item-origin">
                <AsyncSelect
                  styles={customStyles}
                  value={destination.origin}
                  onChange={(value) => this.handleOrigin(value, destinationIndex)}
                  loadOptions={this.loadOptions}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.code}
                  backspaceRemoves={true}
                  arrowRenderer={null}
                  onSelectResetsInput={false}
                  placeholder="Origin"
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
              <div className="multi-stops-popup-item-destination">
                <AsyncSelect
                  styles={customStyles}
                  value={destination.destination}
                  onChange={(value) => this.handleDestination(value, destinationIndex)}
                  loadOptions={this.loadOptions}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.code}
                  backspaceRemoves={true}
                  arrowRenderer={null}
                  onSelectResetsInput={false}
                  placeholder="Destination"
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
              <div className="multi-stops-popup-item-date">
                <DatePicker
                  popperClassName="check-in-popper"
                  ref={(c) => (this.multiStopsDatepicker = c)}
                  customInput={<DateInput text="Departure" date={destination.date} calendar={this.multiStopsDatepicker} />}
                  selected={destination.date}
                  selectsStart
                  startDate={destination.date}
                  onChange={(value) => this.handleDateChange(value, destinationIndex)}
                  withPortal={isMobile}
                  monthsShown={monthsToShow}
                  fixedHeight
                  minDate={moment()}
                  {...this.props}
                />
              </div>
              {destinationIndex > 0 &&
                <div className="multi-stops-popup-item-remove-destination-holder">
                  <span className="multi-stops-popup-item-remove-destination-button" onClick={() => this.removeDestination(destinationIndex)} />
                </div>}
            </div>
          );
        })}
        <div className="multi-stops-add-destination-holder">
          <div className="multi-stops-add-destination-button" onClick={this.addDestination}>Add</div>
        </div>
        <hr />
        <div className="multi-stops-apply-holder">
          <div className="multi-stops-apply-button" onClick={this.applyDestinationsChoose}>Apply</div>
        </div>
      </div>
    );
  }
}

MultiStopsPopup.propTypes = {
  showMultiStopsPopup: PropTypes.bool,

  // Router props
  location: PropTypes.object,

  // Redux props
  dispatch: PropTypes.func,
  flightRouting: PropTypes.string,
  destinations: PropTypes.array,
  startDate: PropTypes.object
};

const mapStateToProps = (state) => {
  const { airTicketsSearchInfo, searchDatesInfo } = state;

  return {
    flightRouting: selectFlightRouting(airTicketsSearchInfo),
    destinations: selectMultiStopsDestinations(airTicketsSearchInfo),
    startDate: getStartDate(searchDatesInfo)
  };
};

export default withRouter(connect(mapStateToProps)(MultiStopsPopup));
