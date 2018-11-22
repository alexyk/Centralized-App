import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import BookingSteps from '../../../common/bookingSteps';
import { Config } from '../../../../config';
import { CREATE_WALLET } from '../../../../constants/modals.js';
import { CurrencyConverter } from '../../../../services/utilities/currencyConverter';

import '../../../../styles/css/components/airTickets/book/confirm/air-tickets-booking-confirm-page.css';

class AirTicketsBookingConfirmPage extends Component {
  constructor(props) {
    super(props);

    this.handlePayWithLOC = this.handlePayWithLOC.bind(this);
  }

  handlePayWithLOC() {
    const { data } = this.state;
    console.log('pay with loc');
    fetch(`${Config.getValue('apiHost')}flight/flightBooking`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ flightId: data.flightId })
    })
      .then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            console.log(res);
            console.log(data);
            // if (data.success === false) {
            //   NotificationManager.warning(data.message, '', LONG);
            // } else {
            //   this.props.history.push({ pathname: `/tickets/results/book/${this.props.match.params.id}${this.props.location.search}`, state: data });
            // }
          });
        } else {
          console.log(res);
        }
      });
  }

  render() {
    const { result, preparedBooking } = this.props;
    const hasLocAddress = !!this.props.userInfo.locAddress;
    const currentCurrency = this.props.paymentInfo.currency;
    const { currencyExchangeRates } = this.props.exchangeRatesInfo;
    const userConfirmedPaymentWithLOC = false;

    if (!preparedBooking) {
      return <div className="loader"></div>;
    }

    console.log(result);
    console.log(preparedBooking);

    const fiatPriceInUserCurrency = currencyExchangeRates && CurrencyConverter.convert(currencyExchangeRates, preparedBooking.price.currency, currentCurrency, preparedBooking.price.total).toFixed(2);

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
              <hr />
              <div className="payment-methods">
                <div className="payment-methods-loc">
                  <div className="details">
                    <p>Pay Directly With LOC: <span className="important">{this.props.paymentInfo.currencySign}{currencyExchangeRates && fiatPriceInUserCurrency}</span></p>
                    <p>Order Total: <span className="important">
                      {/* {this.props.isQuoteLocValid && <QuoteLocPrice fiat={reservation.fiatPrice} params={{ bookingId: reservation.preparedBookingId }} brackets={false} invalidateQuoteLoc={this.props.invalidateQuoteLoc} redirectToHotelDetailsPage={this.props.redirectToHotelDetailsPage} />} */}
                    </span></p>
                    {/* {locAmounts[DEFAULT_QUOTE_LOC_ID] &&
                      <div className="price-update-timer" tooltip="Seconds until we update your quoted price">
                        {!isQuoteStopped ? <span>LOC price will update in <i className="fa fa-clock-o" aria-hidden="true"></i>&nbsp;{this.props.locPriceUpdateTimerInfo.seconds} sec &nbsp;</span> : 'Processing payment...'}
                      </div>} */}
                    <p>(Click <a href="">here</a> to learn how you can buy LOC directly to enjoy cheaper travel)</p>
                    {userConfirmedPaymentWithLOC
                      ? <button className="btn btn-primary" disabled>Processing Payment...</button>
                      : hasLocAddress
                        ? <button className="btn btn-primary" onClick={this.handlePayWithLOC}>Pay with LOC Tokens</button>
                        : <button className="btn btn-primary" onClick={(e) => this.openModal(CREATE_WALLET, e)}>Create Wallet</button>
                    }
                  </div>
                  <div className="logos">
                    <div className="logo loc">
                      <img src={Config.getValue('basePath') + 'images/logos/loc.jpg'} alt="Visa Logo" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Fragment>
    );
  }
}

AirTicketsBookingConfirmPage.propTypes = {
  result: PropTypes.object,
  preparedBooking: PropTypes.object,

  // Router props
  location: PropTypes.object,

  // Redux props
  userInfo: PropTypes.object,
  exchangeRatesInfo: PropTypes.object,
  paymentInfo: PropTypes.object
};

const mapStateToProps = (state) => {
  const { userInfo, exchangeRatesInfo, paymentInfo } = state;
  return {
    userInfo,
    exchangeRatesInfo,
    paymentInfo
  };
};

export default withRouter(connect(mapStateToProps)(AirTicketsBookingConfirmPage));