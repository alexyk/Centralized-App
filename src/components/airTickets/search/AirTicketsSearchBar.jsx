import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { setFlightClass, setStops, setDepartureTime, setOrigin, setDestination, setAdults, setChildren, setFlexSearch } from '../../../actions/airTicketsSearchInfo';
import SelectFlex from '../../common/select';
import AirTicketsDatepickerWrapper from './AirTicketsDatepickerWrapper';
import { Config } from '../../../config';

import '../../../styles/css/components/airTickets/search/air-tickets-search-bar.css';

class AirTicketsSearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showPassengersPopup: false,
      passengers: {
        adults: 1,
        children: []
      }
    };

    this.getQueryString = this.getQueryString.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.applyPassengersChoose = this.applyPassengersChoose.bind(this);
    this.increaseAdults = this.increaseAdults.bind(this);
    this.decreaseAdults = this.decreaseAdults.bind(this);
    this.increaseChildren = this.increaseChildren.bind(this);
    this.decreaseChildren = this.decreaseChildren.bind(this);
  }

  requestAirports(param) {
    if (!param) {
      return Promise.resolve({ options: [] });
    }

    return fetch(`${Config.getValue('apiHost')}flight/city/search?query=${param}`, {
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
        return { options };
      });
    });
  }

  getDestinations() {
    const { airTicketsSearchInfo, searchDatesInfo } = this.props;

    let destinations;

    if (airTicketsSearchInfo.flightRouting === '1') {
      destinations = [
        { origin: airTicketsSearchInfo.origin.code, destination: airTicketsSearchInfo.destination.code, date: searchDatesInfo.startDate.format('DD/MM/YYYY') }
      ];
    } else if (airTicketsSearchInfo.flightRouting === '2') {
      destinations = [
        { origin: airTicketsSearchInfo.origin.code, destination: airTicketsSearchInfo.destination.code, date: searchDatesInfo.startDate.format('DD/MM/YYYY') },
        { origin: airTicketsSearchInfo.destination.code, destination: airTicketsSearchInfo.origin.code, date: searchDatesInfo.endDate.format('DD/MM/YYYY') }
      ];
    } else if (airTicketsSearchInfo.flightRouting === '3') {
      destinations = '';
    }

    return destinations;
  }

  getQueryString() {
    let queryString = '?';

    queryString += 'destinations=' + encodeURI(JSON.stringify(this.getDestinations()));
    queryString += '&adults=' + this.props.airTicketsSearchInfo.adultsCount;
    queryString += '&children=' + encodeURI(JSON.stringify(this.props.airTicketsSearchInfo.children));
    queryString += '&routing=' + this.props.airTicketsSearchInfo.flightRouting;
    queryString += '&flightClass=' + this.props.airTicketsSearchInfo.flightClass;
    queryString += '&stops=' + this.props.airTicketsSearchInfo.stops;
    queryString += '&flexSearch=' + this.props.airTicketsSearchInfo.flexSearch;
    if (this.props.airTicketsSearchInfo.departureTime) {
      queryString += '&departureTime=' + this.props.airTicketsSearchInfo.departureTime;
    }

    return queryString;
  }

  handleSearch(e) {
    if (e) {
      e.preventDefault();
    }

    this.props.search(this.getQueryString(), e);
  }

  handlePassengers() {
    this.setState((prevState) => ({
      showPassengersPopup: !prevState.showPassengersPopup
    }));
  }

  increaseAdults() {
    this.setState(prevState => ({
      passengers: {
        ...prevState.passengers,
        adults: prevState.passengers.adults + 1
      }
    }));
  }

  decreaseAdults() {
    this.setState(prevState => ({
      passengers: {
        ...prevState.passengers,
        adults: this.state.passengers.adults - 1 < 1 ? 1 : this.state.passengers.adults - 1
      }
    }));
  }

  increaseChildren() {
    this.setState(prevState => ({
      ...prevState,
      passengers: {
        ...prevState.passengers,
        children: [...prevState.passengers.children, { age: 0 }]
      }
    }));
  }

  decreaseChildren() {
    const children = [...this.state.passengers.children];
    children.splice(children.length - 1, 1);
    this.setState(prevState => ({
      ...prevState,
      passengers: {
        ...prevState.passengers,
        children
      }
    }));
  }

  increaseChildAge(childIndex) {
    const children = [...this.state.passengers.children];
    children[childIndex].age = children[childIndex].age + 1 > 12 ? 12 : children[childIndex].age + 1;
    this.setState(prevState => ({
      ...prevState,
      passengers: {
        ...prevState.passengers,
        children
      }
    }));
  }

  decreaseChildAge(childIndex) {
    const children = [...this.state.passengers.children];
    children[childIndex].age = children[childIndex].age - 1 < 0 ? 0 : children[childIndex].age - 1;
    this.setState(prevState => ({
      ...prevState,
      passengers: {
        ...prevState.passengers,
        children
      }
    }));
  }

  applyPassengersChoose() {
    const { passengers } = this.state;

    this.setState({
      showPassengersPopup: false
    });

    this.props.dispatch(setAdults(passengers.adults));
    this.props.dispatch(setChildren(passengers.children));
  }

  render() {
    if (this.props.location.pathname.indexOf('/mobile') !== -1) {
      return null;
    }

    const { showPassengersPopup, passengers } = this.state;

    return (
      <div className="air-tickets">
        <form className="air-tickets-form" onSubmit={this.handleSearch}>
          <div className="air-tickets-form-select">
            <Select.Async
              placeholder="Origin"
              required
              style={{ boxShadow: 'none', border: 'none' }}
              value={this.props.airTicketsSearchInfo.origin}
              onChange={value => this.props.dispatch(setOrigin(value))}
              valueKey={'code'}
              labelKey={'name'}
              loadOptions={this.requestAirports}
              backspaceRemoves={true}
              arrowRenderer={null}
              onSelectResetsInput={false}
            />
          </div>
          <div className="air-tickets-form-select">
            <Select.Async
              placeholder="Destination"
              required
              style={{ boxShadow: 'none', border: 'none' }}
              value={this.props.airTicketsSearchInfo.destination}
              onChange={value => this.props.dispatch(setDestination(value))}
              valueKey={'code'}
              labelKey={'name'}
              loadOptions={this.requestAirports}
              backspaceRemoves={true}
              arrowRenderer={null}
              onSelectResetsInput={false}
            />
          </div>
          <div className="air-tickets-form-check-wrap">
            <AirTicketsDatepickerWrapper />
          </div>
          <div className="air-tickets-form-flex-search" onClick={() => this.props.dispatch(setFlexSearch())}>
            <div>
              {!this.props.airTicketsSearchInfo.flexSearch
                ? 'No flex search'
                : 'With flex search'
              }
            </div>
          </div>
          <div className="air-tickets-form-passengers-wrap">
            <div className="passengers-title" onClick={() => this.handlePassengers()}>{passengers.adults + passengers.children.length} Passengers</div>
            {showPassengersPopup &&
              <div className="passengers-popup">
                <div className="passengers-popup-item">
                  <div className="passengers-popup-item-title">Adults</div>
                  <div className="passengers-popup-item-controls">
                    <div className="minus" onClick={this.decreaseAdults}>-</div>
                    <div className="count">{passengers.adults}</div>
                    <div className="plus" onClick={this.increaseAdults}>+</div>
                  </div>
                </div>
                <div className="passengers-popup-item">
                  <div className="passengers-popup-item-title">Children</div>
                  <div className="passengers-popup-item-controls">
                    <div className="minus" onClick={this.decreaseChildren}>-</div>
                    <div className="count">{passengers.children.length}</div>
                    <div className="plus" onClick={this.increaseChildren}>+</div>
                  </div>
                </div>
                {passengers.children.length > 0 &&
                  <Fragment>
                    <hr />
                    {passengers.children.map((child, childIndex) => {
                      return (
                        <div key={childIndex} className="passengers-popup-item">
                          <div className="passengers-popup-item-title">Age at Departure date (0-12)</div>
                          <div className="passengers-popup-item-controls">
                            <div className="minus" onClick={() => this.decreaseChildAge(childIndex)}>-</div>
                            <div className="count">{child.age}</div>
                            <div className="plus" onClick={() => this.increaseChildAge(childIndex)}>+</div>
                          </div>
                        </div>
                      );
                    })}
                  </Fragment>}
                <div className="button-holder">
                  <div className="passengers-apply-button" onClick={this.applyPassengersChoose}>Apply</div>
                </div>
              </div>}
          </div>
          <SelectFlex placeholder="Departure time" className="air-tickets-form-departure-time" onChange={(value) => this.props.dispatch(setDepartureTime(value))} value={this.props.airTicketsSearchInfo.departureTime}>
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
          <SelectFlex placeholder="Flight stops" className="air-tickets-form-flight-stops" onChange={(value) => this.props.dispatch(setStops(value))} value={this.props.airTicketsSearchInfo.stops}>
            <select name="flightStops">
              <option value="-1">any</option>
              <option value="0">direct flight</option>
              <option value="1">one stop</option>
              <option value="2">more stops</option>
            </select>
          </SelectFlex>
          <SelectFlex placeholder="Flight class" className="air-tickets-form-flight-class" onChange={(value) => this.props.dispatch(setFlightClass(value))} value={this.props.airTicketsSearchInfo.flightClass}>
            <select name="flightClass">
              <option value="0">any</option>
              <option value="E">economy</option>
              <option value="P">premium economy</option>
              <option value="B">business</option>
              <option value="F">first</option>
            </select>
          </SelectFlex>
          <button type="submit" className="btn btn-primary btn-search">Search</button>
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
