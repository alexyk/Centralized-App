import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import SendTokensModal from '../../../profile/wallet/SendTokensModal';
import { ExchangerWebsocket } from '../../../../services/socket/exchangerWebsocket';
import { CurrencyConverter } from '../../../../services/utilities/currencyConverter';
import { RoomsXMLCurrency } from '../../../../services/utilities/roomsXMLCurrency';
import LocPrice from '../../../common/utility/LocPrice';
import { getCurrency, getCurrencySign } from '../../../../selectors/paymentInfo';
import { getLocEurRate, getCurrencyExchangeRates } from '../../../../selectors/exchangeRatesInfo.js';
import { getSeconds } from '../../../../selectors/locPriceUpdateTimerInfo.js';
import { getLocAmountById, getQuotePPFiatAmount, getQuotePPAdditionalFees, getQuotePPFundsSufficient } from '../../../../selectors/locAmountsInfo.js';

import '../../../../styles/css/components/airTickets/book/payment/air-tickets-payment-page.css';

const PAYMENT_PROCESSOR_IDENTIFICATOR = '-PP';
const DEFAULT_QUOTE_LOC_ID = 'quote';
const DEFAULT_QUOTE_LOC_PP_ID = DEFAULT_QUOTE_LOC_ID + PAYMENT_PROCESSOR_IDENTIFICATOR;

const updateFEPrice = (data, result) => {
  let totalLocPrice = document.querySelector('.total-loc-price');
  let additionalFees = document.querySelector('.additional-fees');

  totalLocPrice.innerText = data.locAmount.toFixed(2);
  additionalFees.innerText = data.additionalFees.toFixed(2) + (Math.abs(result.total.price - data.fiatAmount));
};

class AirTicketsPaymentPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      locEurRate: null
    };

    this.closeModal = this.closeModal.bind(this);
    this.handleLOCPayment = this.handleLOCPayment.bind(this);
    this.convertPrice = this.convertPrice.bind(this);
    this.isPaymentEnabled = localStorage.getItem('passpayd') === true;
    this.quoteResult = ExchangerWebsocket.sendMessage(DEFAULT_QUOTE_LOC_ID, 'quoteLoc', { bookingId: this.props.result.flightReservationId });
    this.quotePPResult = ExchangerWebsocket.sendMessage(DEFAULT_QUOTE_LOC_PP_ID, 'quoteLoc', { bookingId: this.props.result.flightReservationId + PAYMENT_PROCESSOR_IDENTIFICATOR });

  }

  componentDidMount() {
    this.quoteResult = ExchangerWebsocket.sendMessage(DEFAULT_QUOTE_LOC_ID, 'quoteLoc', { bookingId: this.props.result.flightReservationId });
    this.quotePPResult = ExchangerWebsocket.sendMessage(DEFAULT_QUOTE_LOC_PP_ID, 'quoteLoc', { bookingId: this.props.result.flightReservationId + PAYMENT_PROCESSOR_IDENTIFICATOR });
  }

  componentWillUnmount() {
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

  convertPrice(result) {
    const currencyExchangeRatesLS = localStorage.getItem('flights-fiat-rates');

    if (!currencyExchangeRatesLS) {
      return {
        fiatPriceInCurrentCurrency: 0,
        fiatPriceInRoomsXMLCurrency: 0,
        taxPriceInCurrentCurrency: 0,
        taxPriceInRoomsXMLCurrency: 0
      };
    }

    const currencyExchangeRates = JSON.parse(currencyExchangeRatesLS);
    const currencyCode = result.price.currency;
    const price = result.price.total;
    const taxPrice = result.price.tax;
    const currency = localStorage.getItem('currency');

    const fiatPriceInCurrentCurrency = CurrencyConverter.convert(currencyExchangeRates, currencyCode, currency, price);
    const fiatPriceInRoomsXMLCurrency = CurrencyConverter.convert(currencyExchangeRates, currencyCode, RoomsXMLCurrency.get(), price);

    const taxPriceInCurrentCurrency = CurrencyConverter.convert(currencyExchangeRates, currencyCode, currency, taxPrice);
    const taxPriceInRoomsXMLCurrency = CurrencyConverter.convert(currencyExchangeRates, currencyCode, RoomsXMLCurrency.get(), taxPrice);

    return {
      fiatPriceInCurrentCurrency: fiatPriceInCurrentCurrency,
      fiatPriceInRoomsXMLCurrency: fiatPriceInRoomsXMLCurrency,
      taxPriceInCurrentCurrency: taxPriceInCurrentCurrency,
      taxPriceInRoomsXMLCurrency: taxPriceInRoomsXMLCurrency,
      currency: currency
    }
  }

  render() {
    const { result,  currencySign, quoteLocAmount, quotePPFiatAmount, quotePPAdditionalFees} = this.props;
    const price = this.convertPrice(result);

    const locPrice = (!quoteLocAmount) ? <LocPrice locAmount={price.fiatPriceInCurrentCurrency} brackets={false}/> : quoteLocAmount.toFixed(2);
    const ppPirce = (!quotePPFiatAmount) ? price.fiatPriceInCurrentCurrency.toFixed(2) : quotePPFiatAmount.toFixed(2)
    const additionalFees = (!quotePPAdditionalFees) ? 0 : quotePPAdditionalFees
    return (
      <Fragment>
        <SendTokensModal
          flightReservationId={this.props.result.flightReservationId}
          showModal={this.state.showModal}
          result={this.props.result}
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

        <div className="pay-with-cc-wrapper">
          <div className="price-wrapper">
            <h3>
              <span>Total price: </span>
              <span className="total-loc-price">{ppPirce}</span>
              <span className="currency">{currencySign}</span>
            </h3>
          </div>
          <div className="price-wrapper">
            <h3>
              <span>Additional Fees: </span>
              <span className="additional-fees">{additionalFees.toFixed(2)}</span>
              <span className="currency">{currencySign}</span>
            </h3>
          </div>
          <button
            id="pay_cc"
            type="button"
            className="button"
            onClick={() => this.handleCCPayment()}
            disabled={this.isPaymentEnabled}>Pay with Credit/Debit card</button>
        </div>
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
