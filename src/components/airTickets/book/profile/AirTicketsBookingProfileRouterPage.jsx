import React, { Fragment } from 'react';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import BookingSteps from '../../../common/bookingSteps';
import AirTicketsBookingProfileEditNav from './AirTicketsBookingProfileEditNav';
import AirTicketsBookingProfileEditForm from './AirTicketsBookingProfileEditForm';
import AirTicketsBookingProfileServicesForm from './AirTicketsBookingProfileServicesForm';
import AirTicketsBookingProfilePassengersForm from './AirTicketsBookingProfilePassengersForm';
import AirTicketsPaymentPage from './AirTicketsPaymentPage';

import '../../../../styles/css/components/airTickets/book/profile/air-tickets-booking-profile-router-page.css';


function AirTicketsBookingProfileRouterPage(props) {
  const { result, contactInfo, invoiceInfo, servicesInfo, passengersInfo, countries, confirmInfo, isBookingProccess, updatedPrice } = props;

  let flightServices;
  let passengersServices;
  if (result && result.optionalServices && result.optionalServices.length > 0) {
    flightServices = result.optionalServices.filter(service => service.perPassenger === false);
    passengersServices = result.optionalServices.filter(service => service.perPassenger === true);
  }

  const hasFlightServices = flightServices && flightServices.length > 0;

  return (
    <Fragment>
      <BookingSteps steps={['Search', 'Details', 'Prepare Booking', 'Confirm & Pay']} currentStepIndex={2} />
      {!result ?
        <div className="loader"></div> :
        <section className="container">
          <div className="air-tickets-profile">
            <div className="air-tickets-profile-nav">
              <AirTicketsBookingProfileEditNav confirmInfo={confirmInfo} hasFlightServices={hasFlightServices} />
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
                        hasFlightServices={hasFlightServices}
                      />
                    );
                  }}
                />
                {hasFlightServices &&
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
                            currency={props.currency}
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
                          result={result}
                          passengersInfo={passengersInfo}
                          onChange={props.onChangePassengersInfo}
                          onChangeService={props.onChangePassengerServices}
                          initBooking={props.initBooking}
                          countries={countries}
                          services={passengersServices}
                          currency={props.currency}
                          isBookingProccess={isBookingProccess}
                          enableNextSection={props.enableNextSection}
                        />
                      );
                    }}
                  /> : <Redirect to={{ pathname: '/tickets/results/initBook/:id/profile', search: props.location.search }} />}

                  <Route
                    exact
                    path="/tickets/results/initBook/:id/profile/pay"
                    render={() => { return (
                      <AirTicketsPaymentPage
                        result={result}
                        initBooking={props.initBooking}
                        updatedPrice={updatedPrice}
                      />
                    )}}
                  />
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
  invoiceInfo: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object
  ]),
  servicesInfo: PropTypes.array,
  passengersInfo: PropTypes.array,
  confirmInfo: PropTypes.object,
  countries: PropTypes.array,
  isBookingProccess: PropTypes.bool,
  onChangeContactInfo: PropTypes.func,
  onChangeInvoiceInfo: PropTypes.func,
  onChangeServiceInfo: PropTypes.func,
  onChangePassengersInfo: PropTypes.func,
  onChangePassengerServices: PropTypes.func,
  enableNextSection: PropTypes.func,
  initBooking: PropTypes.func,
  updatedPrice: PropTypes.string,

  // Router props
  location: PropTypes.object
};

export default withRouter(AirTicketsBookingProfileRouterPage);
