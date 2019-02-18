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
import requester from '../../../requester'

const PASSENGER_TYPES_CODES = {
  adult: 'ADT',
  child: 'CHD'
};

class AirTicketsBookingRouterPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: null,
      fareRules: null,
      contactInfo: {
        address: '',
        city: '',
        country: '',
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        title: '',
        zipCode: ''
      },
      invoiceInfo: {
        address: '',
        city: '',
        country: { name: '', code: '', currency: '', phoneCode: '' },
        name: '',
        zipCode: '',
      },
      servicesInfo: [],
      passengersInfo: [],
      countries: [],
      confirmInfo: {
        contact: true,
        invoice: true,
        services: true,
        passengers: true
      },
      isBookingProccess: false
    };

    this.searchAirTickets = this.searchAirTickets.bind(this);
    this.requestSelectFlight = this.requestSelectFlight.bind(this);
    this.requestFareRules = this.requestFareRules.bind(this);
    this.requestAllCountries = this.requestAllCountries.bind(this);
    this.requestPrepareBooking = this.requestPrepareBooking.bind(this);
    this.requestBooking = this.requestBooking.bind(this);
    this.onChangeContactInfo = this.onChangeContactInfo.bind(this);
    this.onChangeInvoiceInfo = this.onChangeInvoiceInfo.bind(this);
    this.onChangeServiceInfo = this.onChangeServiceInfo.bind(this);
    this.onChangePassengersInfo = this.onChangePassengersInfo.bind(this);
    this.onChangePassengerServices = this.onChangePassengerServices.bind(this);
    this.enableNextSection = this.enableNextSection.bind(this);
    this.populatePassengersInfo = this.populatePassengersInfo.bind(this);
    this.initBooking = this.initBooking.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);
  }

  componentDidMount() {
    this.requestSelectFlight();
    this.requestFareRules();
    this.requestAllCountries();
    this.populatePassengersInfo();
    this.getUserInfo();
  }


  getUserInfo() {
    let contactInfo = {
      address: '',
      city: '',
      country: '',
      email: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      title: '',
      zipCode: ''
    };

    requester.getUserInfo().then(res => {
      res.body.then(data => {
        contactInfo.address = data.address;
        contactInfo.city = data.city;
        contactInfo.country = data.country;
        contactInfo.email = data.email;
        contactInfo.firstName = data.firstName;
        contactInfo.lastName = data.lastName;
        contactInfo.phoneNumber = data.phoneNumber;
        contactInfo.title = data.title;
        contactInfo.zipCode = data.zipCode;


        this.setState({
          contactInfo: contactInfo
        });
      });
    });
  }

  requestSelectFlight() {
    fetch(`${Config.getValue('apiHost')}flight/selectFlight?flightId=${this.props.match.params.id}`)
      .then(res => {
        if (res.ok) {
          res.json().then((data) => {
            this.setState({
              result: data
            });
          });
        }
      }).catch(err => {
        NotificationManager.warning(err.message, '', LONG);
        this.searchAirTickets(this.props.location.search);
      });
  }

  requestFareRules() {
    fetch(`${Config.getValue('apiHost')}flight/fareRules?flightId=${this.props.match.params.id}`)
      .then(res => {
        if (res.ok) {
          res.json().then((data) => {
            if (data.success === false) {
              NotificationManager.warning(data.message, '', LONG);
              this.searchAirTickets(this.props.location.search);
            } else {
              this.setState({
                fareRules: data.rules
              });
            }
          });
        } else {
          this.searchAirTickets(this.props.location.search);
        }
      });
  }

  requestAllCountries() {
    fetch(`${Config.getValue('apiHost')}countries`)
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

  requestPrepareBooking(initBooking) {
    return new Promise((resolve, reject) => {
      fetch(`${Config.getValue('apiHost')}flight/confirmAndPay`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Authorization': localStorage[Config.getValue('domainPrefix') + '.auth.locktrip']
        },
        body: JSON.stringify(initBooking)
      })
        .then((res) => {
          if (res.ok) {
            res.json().then((data) => {
              if (data.success === false) {
                reject(data);
              } else {
                resolve(data);
              }
            });
          } else {
            res.json().then((err) => {
              console.log(err);
              reject(err);
            });
            console.log(res);
          }
        });
    });
  }

  requestBooking() {
    return new Promise((resolve, reject) => {
      fetch(`${Config.getValue('apiHost')}flight/flightBooking`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Authorization': localStorage[Config.getValue('domainPrefix') + '.auth.locktrip']
        },
        body: JSON.stringify({ flightId: this.props.match.params.id })
      })
        .then((res) => {
          if (res.ok) {
            res.json().then((data) => {
              resolve(data);
            });
          } else {
            reject(res);
          }
        });
    });
  }

  searchAirTickets(queryString) {
    this.props.history.push('/tickets/results' + queryString);
  }

  populatePassengersInfo() {
    const queryParams = parse(this.props.location.search);
    const adults = Number(queryParams.adults);
    const children = JSON.parse(queryParams.children);

    const passengersInfo = [...this.state.passengersInfo];

    passengersInfo.push({
      title: '',
      firstName: '',
      lastName: '',
      birthdateMonth: '',
      birthdateDay: '',
      birthdateYear: '',
      birthDate: '',
      type: PASSENGER_TYPES_CODES.adult,
      nationality: '',
      passportNumber: '',
      passportIssueCountry: '',
      passportExpMonth: '',
      passportExpDay: '',
      passportExpYear: '',
      options: []
    });

    for (let i = 0; i < adults - 1; i++) {
      passengersInfo.push({
        title: '',
        firstName: '',
        lastName: '',
        birthdateMonth: '',
        birthdateDay: '',
        birthdateYear: '',
        type: PASSENGER_TYPES_CODES.adult,
        nationality: '',
        passportNumber: '',
        passportIssueCountry: '',
        passportExpMonth: '',
        passportExpDay: '',
        passportExpYear: '',
        options: []
      });
    }

    for (let i = 0; i < children.length; i++) {
      passengersInfo.push({
        title: '',
        firstName: '',
        lastName: '',
        birthdateMonth: '',
        birthdateDay: '',
        birthdateYear: '',
        type: PASSENGER_TYPES_CODES.child,
        nationality: '',
        passportNumber: '',
        passportIssueCountry: '',
        passportExpMonth: '',
        passportExpDay: '',
        passportExpYear: '',
        age: children[i].age, options: []
      });
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
    }), () => this.props.history.push(`/tickets/results/initBook/${this.props.match.params.id}/profile/${section}${this.props.location.search}`));
  }

  initBooking() {
    this.setState({
      isBookingProccess: true
    });

    const { contactInfo, invoiceInfo, servicesInfo, passengersInfo } = this.state;

    const invoice = Object.assign({}, invoiceInfo);
    invoice.country = invoiceInfo.country.code;

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

    //prepare object for json request
    contactInfo.country = contactInfo.country.code;
    const initBooking = {
      flightId: this.props.match.params.id,
      flightReservationId: this.state.result.flightReservationId,
      contact: contactInfo,
      // invoice,
      invoice: {},
      options: servicesInfo,
      passengers
    };

    this.requestPrepareBooking(initBooking)
      .then((data) => {
        this.setState({
          isBookingProccess: false
        });
        this.props.history.push(`/tickets/results/initBook/${this.props.match.params.id}/confirm${this.props.location.search}`);
        // this.requestBooking()
        //   .then((data) => {
        //     this.setState({
        //       isBookingProccess: false
        //     }, () => {
        //       console.log('Success booking.');
        //       console.log(data);
        //       if (data.bookingStatus === 'Unsuccessful booking or no booking has made') {
        //         this.searchAirTickets(this.props.location.search);
        //         NotificationManager.warning(data.bookingStatus, '', LONG);
        //       } else {
        //         this.props.history.push(`/tickets/results/book/${this.props.match.params.id}`);
        //         NotificationManager.success(data.bookingStatus, '', LONG);
        //       }
        //     });
        //   })
        //   .catch((err) => {
        //     err.json().then((data) => {
        //       console.log(data);
        //     });
        //   });
      })
      .catch((err) => {
        NotificationManager.warning(err.messageResponse, '', LONG);
        this.setState({
          isBookingProccess: false
        });
        this.searchAirTickets(this.props.location.search);
      });
  }

  render() {
    const { result, fareRules, contactInfo, invoiceInfo, servicesInfo, passengersInfo, countries, confirmInfo, isBookingProccess } = this.state;

    return (
      <Fragment>
        <Switch>
          <Route exact path="/tickets/results/initBook/:id/details" render={() => <AirTicketsDetailsPage result={result} fareRules={fareRules} />} />
          <Route path="/tickets/results/initBook/:id/profile" render={() => {
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
                isBookingProccess={isBookingProccess}
              />
            );
          }}
          />
          <Route exact path="/tickets/results/initBook/:id/confirm" render={() => <AirTicketsBookingConfirmPage />} />
        </Switch>
      </Fragment>
    );
  }
}

AirTicketsBookingRouterPage.propTypes = {
  // Router props
  match: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object,
  getUserInfo: PropTypes.func
};

export default withRouter(AirTicketsBookingRouterPage);
