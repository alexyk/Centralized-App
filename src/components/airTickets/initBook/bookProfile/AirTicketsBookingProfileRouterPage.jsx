import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';
import update from 'react-addons-update';
import { NotificationManager } from 'react-notifications';
import PropTypes from 'prop-types';
import { parse } from 'query-string';
import BookingSteps from '../../../common/bookingSteps';
import AirTicketsBookingProfileEditNav from './AirTicketsBookingProfileEditNav';
import AirTicketsBookingProfileEditForm from './AirTicketsBookingProfileEditForm';
import AirTicketsBookingProfileInvoiceForm from './AirTicketsBookingProfileInvoiceForm';
import AirTicketsBookingProfileServicesForm from './AirTicketsBookingProfileServicesForm';
import AirTicketsBookingProfilePassengersForm from './AirTicketsBookingProfilePassengersForm';
import { Config } from '../../../../config';
import { LONG } from '../../../../constants/notificationDisplayTimes';

import '../../../../styles/css/components/airTickets/initBook/bookProfile/air-tickets-booking-profile-router-page.css';

const PASSENGER_TYPES_CODES = {
  adult: 'ADT',
  child: 'CHD',
  infant: 'INF'
};

class AirTicketsBookingProfileRouterPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contactInfo: {},
      invoiceInfo: {},
      servicesInfo: [],
      passengersInfo: [],
      confirmInfo: {
        contact: true,
        invoice: false,
        services: false,
        passengers: false
      },
      countries: []
    };

    this.onChangeContactInfo = this.onChangeContactInfo.bind(this);
    this.onChangeInvoiceInfo = this.onChangeInvoiceInfo.bind(this);
    this.onChangeServiceInfo = this.onChangeServiceInfo.bind(this);
    this.onChangePassengersInfo = this.onChangePassengersInfo.bind(this);
    this.onChangePassengerServices = this.onChangePassengerServices.bind(this);
    this.enableNextSection = this.enableNextSection.bind(this);
    this.requestAllCountries = this.requestAllCountries.bind(this);
    this.populatePassengersInfo = this.populatePassengersInfo.bind(this);
    this.initBooking = this.initBooking.bind(this);
  }

  componentDidMount() {
    this.requestAllCountries();
    this.populatePassengersInfo();
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
    const passengerInfo = this.state.passengersInfo;
    const passengerServiceIndex = passengerInfo[passengerIndex].passengerServices.findIndex(s => s.id === id);
    let updatedPassengersInfo;
    if (passengerServiceIndex === -1) {
      updatedPassengersInfo = update(passengerInfo, {
        [passengerIndex]: {
          options: { $push: [{ id, value }] }
        }
      });
    } else {
      updatedPassengersInfo = update(passengerInfo, {
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
              this.props.history.push({ pathname: `/tickets/results/book/${this.props.match.params.id}${this.props.location.search}`, state: data });
            }
          });
        } else {
          console.log(res);
        }
      });
  }

  render() {
    const { result } = this.props;
    const { confirmInfo, contactInfo, invoiceInfo, servicesInfo, passengersInfo, countries } = this.state;

    let isFlightServices;
    let services;
    if (result && result.items && result.items[0].services) {
      services = result.items[0].services;
      isFlightServices = services && services.filter(service => service.servicePerPax === false).length > 0;
    }

    return (
      <Fragment>
        <BookingSteps steps={['Search', 'Details', 'Prepare Booking', 'Confirm & Pay']} currentStepIndex={2} />
        <section className="container">
          <div className="air-tickets-profile">
            <div className="air-tickets-profile-nav">
              <AirTicketsBookingProfileEditNav confirmInfo={confirmInfo} isFlightServices={isFlightServices} />
            </div>
            <div className="air-tickets-profile-content">
              <Switch>
                <Route
                  exact
                  path="/tickets/results/initBook/:id/profile"
                  render={() => {
                    return (
                      <AirTicketsBookingProfileEditForm
                        contactInfo={contactInfo}
                        onChange={this.onChangeContactInfo}
                        enableNextSection={this.enableNextSection}
                        countries={countries}
                      />
                    );
                  }}
                />
                {confirmInfo.invoice ?
                  <Route
                    exact
                    path="/tickets/results/initBook/:id/profile/invoice"
                    render={() => {
                      return (
                        <AirTicketsBookingProfileInvoiceForm
                          invoiceInfo={invoiceInfo}
                          onChange={this.onChangeInvoiceInfo}
                          enableNextSection={this.enableNextSection}
                          countries={countries}
                          isFlightServices={isFlightServices}
                        />
                      );
                    }}
                  /> : <Redirect to={{ pathname: '/tickets/results/initBook/:id/profile', search: this.props.location.search }} />}
                {isFlightServices &&
                  (confirmInfo.services ?
                    <Route
                      exact
                      path="/tickets/results/initBook/:id/profile/services"
                      render={() => {
                        return (
                          <AirTicketsBookingProfileServicesForm
                            servicesInfo={servicesInfo}
                            services={services}
                            onChange={this.onChangeServiceInfo}
                            enableNextSection={this.enableNextSection}
                          />
                        );
                      }}
                    /> : <Redirect to={{ pathname: '/tickets/results/initBook/:id/profile', search: this.props.location.search }} />)
                }
                {confirmInfo.passengers ?
                  <Route
                    exact
                    path="/tickets/results/initBook/:id/profile/passengers"
                    render={() => {
                      return (
                        <AirTicketsBookingProfilePassengersForm
                          passengersInfo={passengersInfo}
                          onChange={this.onChangePassengersInfo}
                          onChangeService={this.onChangePassengerServices}
                          initBooking={this.initBooking}
                          countries={countries}
                          services={services}
                          isFlightServices={isFlightServices}
                        />
                      );
                    }}
                  /> : <Redirect to={{ pathname: '/tickets/results/initBook/:id/profile', search: this.props.location.search }} />}
              </Switch>
            </div>
          </div>
        </section>
      </Fragment>
    );
  }
}

AirTicketsBookingProfileRouterPage.propTypes = {
  result: PropTypes.object,

  // Router props
  match: PropTypes.object,
  history: PropTypes.object,
  location: PropTypes.object
};

export default withRouter(connect()(AirTicketsBookingProfileRouterPage));
