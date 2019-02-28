import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import '../../../../styles/css/components/airTickets/book/profile/air-tickets-booking-profile-passengers-form.css';
import { NotificationManager } from 'react-notifications';

class AirTicketsPaymentPage extends Component {
  constructor(props) {
    super(props);
  }

  handleLOCPayment() {
    this.props.initBooking('loc');
  }

  handleCCPayment() {
    this.props.initBooking();
  }

  render() {
    const { result } = this.props;

    return (
      <Fragment>
        <div className="pay-with-loc-wrapper" style="margin-bottom: 30px; display: inline;">
          <div className="price-wrapper">
            <h3>
              <span className="total-price">{result.price.locPrice.toFixed(2)}</span>
              <span className="total-price">{result.price.currency}</span>
            </h3>
          </div>
          <button
            id="pay_loc"
            type="button"
            className="button"
            onClick={() => this.handleLOCPayment()}>Pay with LOC</button>
        </div>

        <div className="pay-with-cc-wrapper">
          <div className="price-wrapper">
            <h3>
              <span className="total-price">{result.price.total.toFixed(2)}</span>
              <span className="total-price">{result.price.currency}</span>
            </h3>
          </div>
          <button
            id="pay_cc"
            type="button"
            className="button"
            onClick={() => this.handleCCPayment()}>Pay with Credit/Debit card</button>
        </div>
      </Fragment>
    );
  }
}

AirTicketsPaymentPage.propTypes = {
  result: PropTypes.object,
  initBooking: PropTypes.func
};

export default AirTicketsPaymentPage;
