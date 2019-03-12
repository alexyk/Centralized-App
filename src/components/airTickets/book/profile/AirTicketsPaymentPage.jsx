import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import SendTokensModal from '../../../profile/wallet/SendTokensModal';
import { ExchangerWebsocket } from '../../../../services/socket/exchangerWebsocket';
import { CurrencyConverter } from '../../../../services/utilities/currencyConverter';
import LocPrice from '../../../common/utility/LocPrice';
import { getCurrency, getCurrencySign } from '../../../../selectors/paymentInfo';
import { getLocEurRate, getCurrencyExchangeRates } from '../../../../selectors/exchangeRatesInfo.js';
import { getSeconds } from '../../../../selectors/locPriceUpdateTimerInfo.js';
import { getLocAmountById, getQuotePPFiatAmount, getQuotePPAdditionalFees, getQuotePPFundsSufficient } from '../../../../selectors/locAmountsInfo.js';

import '../../../../styles/css/components/airTickets/book/payment/air-tickets-payment-page.css';

const PAYMENT_PROCESSOR_IDENTIFICATOR = '-PP';
const DEFAULT_QUOTE_LOC_ID = 'quote';
const DEFAULT_QUOTE_LOC_PP_ID = DEFAULT_QUOTE_LOC_ID + PAYMENT_PROCESSOR_IDENTIFICATOR;

class AirTicketsPaymentPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      locEurRate: null,
      currencySign: '',
      currency: '',
      quoteLocAmount: '',
      quotePPFiatAmount: '',
      quotePPAdditionalFees: '',
      currencyExchangeRates: ''
    };

    this.closeModal = this.closeModal.bind(this);
    this.handleLOCPayment = this.handleLOCPayment.bind(this);
    this.convertPrice = this.convertPrice.bind(this);
    this.isPaymentEnabled = localStorage.getItem('passpayd') === true;

    ExchangerWebsocket.sendMessage(DEFAULT_QUOTE_LOC_ID, 'quoteLoc', { bookingId: this.props.result.flightReservationId });
    ExchangerWebsocket.sendMessage(DEFAULT_QUOTE_LOC_PP_ID, 'quoteLoc', { bookingId: this.props.result.flightReservationId + PAYMENT_PROCESSOR_IDENTIFICATOR });
  }

  componentDidUnmount() {
    ExchangerWebsocket.sendMessage(DEFAULT_QUOTE_LOC_ID, 'unsubscribe');
    ExchangerWebsocket.sendMessage(DEFAULT_QUOTE_LOC_PP_ID, 'unsubscribe');
  }

  handleLOCPayment() {
    this.setState({
      showModal: !this.state.showModal
    });
  }

  handleCCPayment() {
    this.props.initBooking();
  }

  closeModal() {
    this.setState({
      showModal: false
    });
  }

  convertPrice(currencyExchangeRates, currency, price) {
    if (!currencyExchangeRates || !currency || !price) {
      return 0;
    }

    const fiatPriceInCurrentCurrency = CurrencyConverter.convert(currencyExchangeRates, 'EUR', currency, price);
    return fiatPriceInCurrentCurrency.toFixed(2);
  }

  render() {
    const { result, currencySign, currency, quoteLocAmount, quotePPFiatAmount, quotePPAdditionalFees, currencyExchangeRates } = this.props;
    const fiatAmount = this.convertPrice(currencyExchangeRates, currency, quotePPFiatAmount);
    const locPrice = (!quoteLocAmount) ? result.price.locPrice.toFixed(2) : quoteLocAmount.toFixed(2);
    const totalPrice = this.convertPrice(currencyExchangeRates, currency, result.price.total);

    return (
      <Fragment>
        <SendTokensModal
          flightReservationId={result.flightReservationId}
          showModal={this.state.showModal}
          result={result}
          closeModal={this.closeModal}
        />
        <div className="pay-with-loc-wrapper" >
          <div className="price-wrapper">
            <h3>
              <span>Total price: </span>
              <span className="total-price">
                {locPrice}
              </span>
              <span className="currency">LOC</span>
            </h3>
          </div>
          <button
            id="pay_loc"
            type="button"
            className="button"
            onClick={() => this.handleLOCPayment()}
            disabled={this.isPaymentEnabled}>Pay with LOC</button>
        </div>

        {quotePPAdditionalFees &&
          <div className="pay-with-cc-wrapper">
            <div className="price-wrapper">
              <h3>
                <span>Total price: </span>
                <span className="total-loc-price">{totalPrice}</span>
                <span className="currency">{currencySign}</span>
              </h3>
            </div>
            <div className="price-wrapper">
              <h3>
                <span>Additional Fees: </span>
                <span className="additional-fees">{(quotePPAdditionalFees + (Math.abs(totalPrice - fiatAmount))).toFixed(2)}</span>
                <span className="currency">{currencySign}</span>
              </h3>
            </div>
            <button
              id="pay_cc"
              type="button"
              className="button"
              onClick={() => this.handleCCPayment()}
              disabled={this.isPaymentEnabled}>Pay with Credit/Debit card</button>
          </div>}
      </Fragment>
    );
  }
}

AirTicketsPaymentPage.propTypes = {
  result: PropTypes.object,
  initBooking: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object
  ]),

  dispatch: PropTypes.func,
  currency: PropTypes.string,
  currencySign: PropTypes.string,
  locEurRate: PropTypes.number,
  currencyExchangeRates: PropTypes.object,
  quoteLocAmount: PropTypes.number,
  quotePPLocAmount: PropTypes.number,
  quotePPFiatAmount: PropTypes.number,
  quotePPFiatAdditionalFees: PropTypes.number,
  quotePPFundsSufficient: PropTypes.bool,
  seconds: PropTypes.number
};

function mapStateToProps(state) {
  const { paymentInfo, exchangeRatesInfo, locAmountsInfo, locPriceUpdateTimerInfo } = state;

  return {
    currency: getCurrency(paymentInfo),
    currencySign: getCurrencySign(paymentInfo),
    locEurRate: getLocEurRate(exchangeRatesInfo),
    currencyExchangeRates: getCurrencyExchangeRates(exchangeRatesInfo),
    quoteLocAmount: getLocAmountById(locAmountsInfo, DEFAULT_QUOTE_LOC_ID),
    quotePPLocAmount: getLocAmountById(locAmountsInfo, DEFAULT_QUOTE_LOC_PP_ID),
    quotePPFiatAmount: getQuotePPFiatAmount(locAmountsInfo),
    quotePPAdditionalFees: getQuotePPAdditionalFees(locAmountsInfo),
    quotePPFundsSufficient: getQuotePPFundsSufficient(locAmountsInfo),
    seconds: getSeconds(locPriceUpdateTimerInfo)
  };
}

export default withRouter(connect(mapStateToProps)(AirTicketsPaymentPage));
