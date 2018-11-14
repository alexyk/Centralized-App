import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import BookingSteps from '../../../common/bookingSteps';
import AirTicketsBookingProfileEditNav from './AirTicketsBookingProfileEditNav';
import AirTicketsBookingProfileEditForm from './AirTicketsBookingProfileEditForm';
import AirTicketsBookingProfileInvoiceForm from './AirTicketsBookingProfileInvoiceForm';
import AirTicketsBookingProfileServicesForm from './AirTicketsBookingProfileServicesForm';
import AirTicketsBookingProfilePassengersForm from './AirTicketsBookingProfilePassengersForm';
import { Config } from '../../../../config';

import '../../../../styles/css/components/airTickets/initBook/book/air-tickets-booking-profile-router-page.css';

class AirTicketsBookingProfileRouterPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contactInfo: {
        contactTitle: 'Mr',
        firstName: 'Hristo',
        lastName: 'Skipernov',
        email: 'ico@abv.bg',
        phoneNumber: '0887603249',
        countryCode: 'BG',
        zipCode: '1000',
        cityName: 'Sofia',
        address: 'Krasno selo 212'
      },
      invoiceInfo: {
        companyName: 'Codexio',
        companyCountryCode: 'BG',
        companyState: '',
        companyCity: 'Sofia',
        companyAddress: 'Krasno selo 212',
        companyCityZipCode: '1000'
      },
      servicesInfo: [],
      passengersInfo: {

      },
      confirmInfo: {
        contact: true,
        invoice: true,
        services: true,
        passengers: false
      },
      countries: []
    };

    this.onChangeContactInfo = this.onChangeContactInfo.bind(this);
    this.onChangeInvoiceInfo = this.onChangeInvoiceInfo.bind(this);
    this.enableNextSection = this.enableNextSection.bind(this);
    this.requestAllCountries = this.requestAllCountries.bind(this);
  }

  componentDidMount() {
    this.requestAllCountries();
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

  onChangeServiceInfo(name, value) {
    var index = this.state.servicesInfo.findIndex(x => x.serviceCode === name);
    if (index === -1) {
      // handle error
    } else {
      this.setState({
        items: [
          ...this.state.servicesInfo.slice(0, index),
          Object.assign({}, this.state.servicesInfo[index], { [name]: value }),
          ...this.state.servicesInfo.slice(index + 1)
        ]
      });
    }
  }

  enableNextSection(section) {
    this.setState(prevState => ({
      confirmInfo: {
        ...prevState.confirmInfo,
        [section]: true
      }
    }), () => this.props.history.push(`/tickets/results/${this.props.match.params.id}/profile/${section}${this.props.location.search}`));
  }

  parseFlightServiceName(serviceName) {
    const lowerCaseServiceName = serviceName.match(/[A-Z][a-z]+/g).filter(word => word !== 'options').map(word => word.toLowerCase()).join(' ');
    return lowerCaseServiceName.charAt(0).toUpperCase() + lowerCaseServiceName.substring(1);
  }

  render() {
    const { result } = this.props;
    const { confirmInfo, contactInfo, invoiceInfo, servicesInfo, passengersInfo, countries } = this.state;

    let isFlightServices;
    let services = [];
    if (result && result.items && result.items[0].services) {
      services = result.items[0].services;
      isFlightServices = services && services.filter(service => service.servicePerPax === false).length > 0;
    }
    console.log(isFlightServices);

    return (
      <div>
        <div className="container">
          <BookingSteps steps={['Search', 'Details', 'Prepare Booking', 'Confirm & Pay']} currentStepIndex={2} />
          <section>
            <div className="air-tickets-profile">
              <div className="air-tickets-profile-nav">
                <AirTicketsBookingProfileEditNav confirmInfo={confirmInfo} isFlightServices={isFlightServices} />
              </div>
              <div className="air-tickets-profile-content">
                <Switch>
                  <Route
                    exact
                    path="/tickets/results/:id/profile"
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
                      path="/tickets/results/:id/profile/invoice"
                      render={() => {
                        return (
                          <AirTicketsBookingProfileInvoiceForm
                            invoiceInfo={invoiceInfo}
                            onChange={this.onChangeInvoiceInfo}
                            enableNextSection={this.enableNextSection}
                            countries={countries}
                          />
                        );
                      }}
                    /> : <Redirect to={{ pathname: '/tickets/results/:id/profile', search: this.props.location.search }} />}
                  {!isFlightServices && confirmInfo.services ?
                    <Route
                      exact
                      path="/tickets/results/:id/profile/services"
                      render={() => {
                        return (
                          <AirTicketsBookingProfileServicesForm
                            servicesInfo={servicesInfo}
                            services={services}
                            onChange={this.onChangeInvoiceInfo}
                            enableNextSection={this.enableNextSection}
                          />
                        );
                      }}
                    /> : <Redirect to={{ pathname: '/tickets/results/:id/profile', search: this.props.location.search }} />}
                  {confirmInfo.passengers ?
                    <Route
                      exact
                      path="/tickets/results/:id/profile/passengers"
                      render={() => {
                        return (
                          <AirTicketsBookingProfilePassengersForm
                            passengersInfo={passengersInfo}
                            onChange={this.onChangeInvoiceInfo}
                            enableNextSection={this.enableNextSection}
                            countries={countries}
                          />
                        );
                      }}
                    /> : <Redirect to={{ pathname: '/tickets/results/:id/profile', search: this.props.location.search }} />}
                </Switch>
              </div>
            </div>
          </section>
        </div>
      </div>
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
