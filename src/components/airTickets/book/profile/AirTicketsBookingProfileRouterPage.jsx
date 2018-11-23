import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import BookingSteps from '../../../common/bookingSteps';
import AirTicketsBookingProfileEditNav from './AirTicketsBookingProfileEditNav';
import AirTicketsBookingProfileEditForm from './AirTicketsBookingProfileEditForm';
import AirTicketsBookingProfileInvoiceForm from './AirTicketsBookingProfileInvoiceForm';
import AirTicketsBookingProfileServicesForm from './AirTicketsBookingProfileServicesForm';
import AirTicketsBookingProfilePassengersForm from './AirTicketsBookingProfilePassengersForm';

import '../../../../styles/css/components/airTickets/book/profile/air-tickets-booking-profile-router-page.css';


function AirTicketsBookingProfileRouterPage(props) {
  const { result, contactInfo, invoiceInfo, servicesInfo, passengersInfo, countries, confirmInfo } = props;

  let flightServices;
  let passengersServices;
  if (result && result.optionalServices && result.optionalServices.length > 0) {
    flightServices = result.optionalServices.filter(service => service.perPassenger === false);
    passengersServices = result.optionalServices.filter(service => service.perPassenger === true);
  }

  return (
    <Fragment>
      <BookingSteps steps={['Search', 'Details', 'Prepare Booking', 'Confirm & Pay']} currentStepIndex={2} />
      {!result ?
        <div className="loader"></div> :
        <section className="container">
          <div className="air-tickets-profile">
            <div className="air-tickets-profile-nav">
              <AirTicketsBookingProfileEditNav confirmInfo={confirmInfo} hasFlightServices={!!flightServices} />
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
                        onChange={props.onChangeContactInfo}
                        enableNextSection={props.enableNextSection}
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
                          onChange={props.onChangeInvoiceInfo}
                          enableNextSection={props.enableNextSection}
                          countries={countries}
                          hasFlightServices={!!flightServices}
                        />
                      );
                    }}
                  /> : <Redirect to={{ pathname: '/tickets/results/initBook/:id/profile', search: props.location.search }} />}
                {!!flightServices &&
                  (confirmInfo.services ?
                    <Route
                      exact
                      path="/tickets/results/initBook/:id/profile/services"
                      render={() => {
                        return (
                          <AirTicketsBookingProfileServicesForm
                            servicesInfo={servicesInfo}
                            services={flightServices}
                            onChange={props.onChangeServiceInfo}
                            enableNextSection={props.enableNextSection}
                            currency={result.price.currency}
                          />
                        );
                      }}
                    /> : <Redirect to={{ pathname: '/tickets/results/initBook/:id/profile', search: props.location.search }} />)
                }
                {confirmInfo.passengers ?
                  <Route
                    exact
                    path="/tickets/results/initBook/:id/profile/passengers"
                    render={() => {
                      return (
                        <AirTicketsBookingProfilePassengersForm
                          passengersInfo={passengersInfo}
                          onChange={props.onChangePassengersInfo}
                          onChangeService={props.onChangePassengerServices}
                          initBooking={props.initBooking}
                          countries={countries}
                          services={passengersServices}
                          currency={result.price.currency}
                        />
                      );
                    }}
                  /> : <Redirect to={{ pathname: '/tickets/results/initBook/:id/profile', search: props.location.search }} />}
              </Switch>
            </div>
          </div>
        </section>}
    </Fragment>
  );
}

AirTicketsBookingProfileRouterPage.propTypes = {
  result: PropTypes.object,
  contactInfo: PropTypes.object,
  invoiceInfo: PropTypes.object,
  servicesInfo: PropTypes.array,
  passengersInfo: PropTypes.array,
  confirmInfo: PropTypes.object,
  countries: PropTypes.array,
  onChangeContactInfo: PropTypes.func,
  onChangeInvoiceInfo: PropTypes.func,
  onChangeServiceInfo: PropTypes.func,
  onChangePassengersInfo: PropTypes.func,
  onChangePassengerServices: PropTypes.func,
  enableNextSection: PropTypes.func,
  initBooking: PropTypes.func,

  // Router props
  match: PropTypes.object,
  history: PropTypes.object,
  location: PropTypes.object
};

export default withRouter(connect()(AirTicketsBookingProfileRouterPage));
