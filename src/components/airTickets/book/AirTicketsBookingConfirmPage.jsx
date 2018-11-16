import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import BookingSteps from '../../common/bookingSteps';

import '../../../styles/css/components/airTickets/book/air-tickets-booking-confirm-page.css';

class AirTicketsBookingConfirmPage extends Component {
  componentDidMount() {
    console.log(this.props.location.state);
  }

  render() {
    return (
      <Fragment>
        <BookingSteps steps={['Search', 'Details', 'Prepare Booking', 'Confirm & Pay']} currentStepIndex={3} />
        <section className="air-tickets-booking-confirm">
          <div className="container">
            <div className="booking-details">
              <div className="booking-details-header">
                <h2>Confirm and Pay</h2>
                <h2>Hristo Skipernov</h2>
              </div>
              <hr/>
            </div>
          </div>
        </section>
      </Fragment>
    );
  }
}

AirTicketsBookingConfirmPage.propTypes = {
  // Router props
  location: PropTypes.object
};

export default withRouter(AirTicketsBookingConfirmPage);