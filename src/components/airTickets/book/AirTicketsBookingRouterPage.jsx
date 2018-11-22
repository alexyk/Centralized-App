import React, { Component, Fragment } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import update from 'react-addons-update';
import PropTypes from 'prop-types';
import { parse } from 'query-string';
import AirTicketsDetailsPage from './details/AirTicketsDetailsPage';
import AirTicketsBookingProfileRouterPage from './profile/AirTicketsBookingProfileRouterPage';
import AirTicketsBookingConfirmPage from './confirm/AirTicketsBookingConfirmPage';
import { Config } from '../../../config';
import { LONG } from '../../../constants/notificationDisplayTimes';

const PASSENGER_TYPES_CODES = {
  adult: 'ADT',
  child: 'CHD',
  infant: 'INF'
};

class AirTicketsBookingRouterPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: null,
      contactInfo: {},
      invoiceInfo: {},
      servicesInfo: [],
      passengersInfo: [],
      countries: [],
      confirmInfo: {
        contact: true,
        invoice: false,
        services: false,
        passengers: false
      },
      preparedBooking: null
    };

    this.searchAirTickets = this.searchAirTickets.bind(this);
    this.requestSelectFlight = this.requestSelectFlight.bind(this);
    this.requestAllCountries = this.requestAllCountries.bind(this);
    this.onChangeContactInfo = this.onChangeContactInfo.bind(this);
    this.onChangeInvoiceInfo = this.onChangeInvoiceInfo.bind(this);
    this.onChangeServiceInfo = this.onChangeServiceInfo.bind(this);
    this.onChangePassengersInfo = this.onChangePassengersInfo.bind(this);
    this.onChangePassengerServices = this.onChangePassengerServices.bind(this);
    this.enableNextSection = this.enableNextSection.bind(this);
    this.populatePassengersInfo = this.populatePassengersInfo.bind(this);
    this.initBooking = this.initBooking.bind(this);
  }

  componentDidMount() {
    this.requestSelectFlight();
    this.requestAllCountries();
    this.populatePassengersInfo();
  }

  requestSelectFlight() {
    fetch(`${Config.getValue('apiHost')}flight/selectFlight?flightId=${this.props.match.params.id}`)
      .then(res => {
        if (res.ok) {
          res.json().then((data) => {
            if (data.success === false) {
              NotificationManager.warning(data.message, '', LONG);
              this.searchAirTickets(this.props.location.search);
            } else {
              this.setState({
                result: data
              });
            }
          });
        } else {
          this.searchAirTickets(this.props.location.search);
        }
      });
  }

  requestAllCountries() {
    fetch(`${Config.getValue('apiHost')}flight/country/all`)
      .then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            this.setState({
              countries: data
            });
          });
        } else {
          console.log(res);
        }
      });
  }

  searchAirTickets(queryString) {
    this.props.history.push('/tickets/results' + queryString);
  }

  populatePassengersInfo() {
    const queryParams = parse(this.props.location.search);
    const adults = Number(queryParams.adults);
    const children = JSON.parse(queryParams.children);
    const infants = Number(queryParams.infants);

    const passengersInfo = [...this.state.passengersInfo];

    for (let i = 0; i < adults; i++) {
      passengersInfo.push({ type: PASSENGER_TYPES_CODES.adult, options: [] });
    }

    for (let i = 0; i < children.length; i++) {
      passengersInfo.push({ type: PASSENGER_TYPES_CODES.child, age: children[i].age, options: [] });
    }

    for (let i = 0; i < infants; i++) {
      passengersInfo.push({ type: PASSENGER_TYPES_CODES.infant, options: [] });
    }

    this.setState({
      passengersInfo
    });
  }

  onChangeContactInfo(name, value) {
    this.setState(prevState => ({
      contactInfo: {
        ...prevState.contactInfo,
        [name]: value
      }
    }));
  }

  onChangeInvoiceInfo(name, value) {
    this.setState(prevState => ({
      invoiceInfo: {
        ...prevState.invoiceInfo,
        [name]: value
      }
    }));
  }

  onChangeServiceInfo(id, value) {
    const index = this.state.servicesInfo.findIndex(x => x.id === id);
    if (index === -1) {
      this.setState(prevState => ({
        servicesInfo: [...prevState.servicesInfo, { id, value }]
      }));
    } else {
      this.setState({
        servicesInfo: [
          ...this.state.servicesInfo.slice(0, index),
          Object.assign({}, this.state.servicesInfo[index], { id, value }),
          ...this.state.servicesInfo.slice(index + 1)
        ]
      });
    }
  }

  onChangePassengersInfo(passengerIndex, name, value) {
    this.setState({
      passengersInfo: [
        ...this.state.passengersInfo.slice(0, passengerIndex),
        Object.assign({}, this.state.passengersInfo[passengerIndex], { [name]: value }),
        ...this.state.passengersInfo.slice(passengerIndex + 1)
      ]
    });
  }

  onChangePassengerServices(passengerIndex, id, value) {
    const { passengersInfo } = this.state;
    const passengerServiceIndex = passengersInfo[passengerIndex].options.findIndex(s => s.id === id);
    let updatedPassengersInfo;
    if (passengerServiceIndex === -1) {
      updatedPassengersInfo = update(passengersInfo, {
        [passengerIndex]: {
          options: { $push: [{ id, value }] }
        }
      });
    } else {
      updatedPassengersInfo = update(passengersInfo, {
        [passengerIndex]: {
          options: {
            [passengerServiceIndex]: {
              id: { $set: id },
              value: { $set: value }
            }
          }
        }
      });
    }
    this.setState({
      passengersInfo: updatedPassengersInfo
    });
  }

  enableNextSection(section) {
    this.setState(prevState => ({
      confirmInfo: {
        ...prevState.confirmInfo,
        [section]: true
      }
    }), () => this.props.history.push(`/tickets/results/book/${this.props.match.params.id}/profile/${section}${this.props.location.search}`));
  }

  initBooking() {
    const { contactInfo, invoiceInfo, servicesInfo, passengersInfo } = this.state;

    const passengers = [];
    for (let i = 0; i < passengersInfo.length; i++) {
      const passengerInfo = passengersInfo[i];
      passengers.push({
        birthDate: `${passengerInfo.birthdateYear}-${passengerInfo.birthdateMonth}-${passengerInfo.birthdateDay}`,
        firstName: passengerInfo.firstName,
        lastName: passengerInfo.lastName,
        type: passengerInfo.type,
        title: passengerInfo.title,
        nationality: passengerInfo.nationality,
        passport: {
          type: 'P',
          number: passengerInfo.passportNumber,
          issueCountry: passengerInfo.passportIssueCountry,
          expiry: `${passengerInfo.passportExpYear}-${passengerInfo.passportExpMonth}-${passengerInfo.passportExpDay}`
        },
        options: passengerInfo.options
      });
    }

    const initBooking = {
      flightId: this.props.match.params.id,
      contact: contactInfo,
      invoice: invoiceInfo,
      options: servicesInfo,
      passengers
    };

    fetch(`${Config.getValue('apiHost')}flight/prepareBooking`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(initBooking)
    })
      .then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            if (data.success === false) {
              NotificationManager.warning(data.message, '', LONG);
            } else {
              this.setState({
                preparedBooking: data
              }, () => this.props.history.push(`/tickets/results/book/${this.props.match.params.id}/confirm${this.props.location.search}`));
            }
          });
        } else {
          console.log(res);
        }
      });
  }

  render() {
    const { result, contactInfo, invoiceInfo, servicesInfo, passengersInfo, countries, confirmInfo, preparedBooking } = this.state;

    return (
      <Fragment>
        <Switch>
          <Route exact path="/tickets/results/book/:id/details" render={() => <AirTicketsDetailsPage result={result} />} />
          <Route path="/tickets/results/book/:id/profile" render={() => {
            return (
              <AirTicketsBookingProfileRouterPage
                result={result}
                contactInfo={contactInfo}
                invoiceInfo={invoiceInfo}
                servicesInfo={servicesInfo}
                passengersInfo={passengersInfo}
                confirmInfo={confirmInfo}
                countries={countries}
                onChangeContactInfo={this.onChangeContactInfo}
                onChangeInvoiceInfo={this.onChangeInvoiceInfo}
                onChangeServiceInfo={this.onChangeServiceInfo}
                onChangePassengersInfo={this.onChangePassengersInfo}
                onChangePassengerServices={this.onChangePassengerServices}
                enableNextSection={this.enableNextSection}
                initBooking={this.initBooking}
              />
            );
          }}
          />
          <Route exact path="/tickets/results/book/:id/confirm" render={() => {
            return (
              <AirTicketsBookingConfirmPage
                result={result}
                preparedBooking={preparedBooking}
              />
            );
          }}
          />
        </Switch>
      </Fragment>
    );
  }
}

AirTicketsBookingRouterPage.propTypes = {
  // Router props
  match: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object
};

export default withRouter(AirTicketsBookingRouterPage);
