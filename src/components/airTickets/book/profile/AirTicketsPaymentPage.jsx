import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import SendTokensModal from '../../../profile/wallet/SendTokensModal';
import { ExchangerWebsocket } from '../../../../services/socket/exchangerWebsocket';
import { CurrencyConverter } from '../../../../services/utilities/currencyConverter';
import { Config } from '../../../../config.js';
import { getCurrency, getCurrencySign } from '../../../../selectors/paymentInfo';
import { getLocEurRate, getCurrencyExchangeRates } from '../../../../selectors/exchangeRatesInfo.js';
import { getSeconds } from '../../../../selectors/locPriceUpdateTimerInfo.js';
import { getLocAmountById, getQuotePPFiatAmount, getQuotePPAdditionalFees, getQuotePPFundsSufficient } from '../../../../selectors/locAmountsInfo.js';
import LocPrice from '../../../common/utility/LocPrice';
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
      currencyExchangeRates: '',
      seconds: this.props.seconds
    };

    this.closeModal = this.closeModal.bind(this);
    this.handleLOCPayment = this.handleLOCPayment.bind(this);
    this.handleCCPayment = this.handleCCPayment.bind(this);
    this.convertPrice = this.convertPrice.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.isPaymentEnabled = localStorage.getItem('passpayd') === true;
    ExchangerWebsocket.sendMessage(DEFAULT_QUOTE_LOC_ID, 'quoteLoc', { bookingId: this.props.result.flightReservationId });
    ExchangerWebsocket.sendMessage(DEFAULT_QUOTE_LOC_PP_ID, 'quoteLoc', { bookingId: this.props.result.flightReservationId + PAYMENT_PROCESSOR_IDENTIFICATOR });
  }

  componentDidMount() {
    this.setState({
      seconds: this.props.seconds
    });
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

  convertPrice(currencyExchangeRates, currency, price) {
    if (!currencyExchangeRates || !currency || !price) {
      return 0;
    }

    const fiatPriceInCurrentCurrency = CurrencyConverter.convert(currencyExchangeRates, 'EUR', currency, price);
    return fiatPriceInCurrentCurrency.toFixed(2);
  }

  startTimer(seconds = 10) {
    let secondsWrapper = document.querySelectorAll(".timer-seconds");
    let refreshTimer = setInterval(() => {
      secondsWrapper.forEach(item => item.innerText = seconds);
      seconds -= 1;
      if(seconds <= 0){
        clearInterval(refreshTimer);
      }
    }, 1000);
  }

  render() {
    const { result, currencySign, currency, quoteLocAmount, quotePPFiatAmount, quotePPAdditionalFees, currencyExchangeRates, updatedPrice } = this.props;
    const price = (!updatedPrice) ? result.price.total : updatedPrice;
    const fiatAmount = this.convertPrice(currencyExchangeRates, currency, quotePPFiatAmount);
    const locPrice = (!quoteLocAmount) ? result.price.locPrice.toFixed(2) : quoteLocAmount.toFixed(2);
    const totalPrice = this.convertPrice(currencyExchangeRates, currency, price);

    return (
      <Fragment>
        <SendTokensModal flightReservationId={result.flightReservationId}
          showModal={this.state.showModal}
          result={result}
          closeModal={this.closeModal}
        />
        <div className="payment-methods-loc-wrapper">
          <div className="details">
            <p>Pay Directly With LOC: <span className="important">{currencySign} {totalPrice}</span></p>
            <p>Order Total: <span className="important">
              <LocPrice fiat={parseFloat(totalPrice)} brackets={false} locAmount={locPrice} currencyExchangeRates={currencyExchangeRates} />
            </span></p>
            <div className="price-update-timer" tooltip="Seconds until we update your quoted price">
              <span>LOC price will update in <i className="fa fa-clock-o" aria-hidden="true"></i>&nbsp;<span className="timer-seconds">{this.startTimer(this.props.seconds)}</span> sec &nbsp;</span>
              <p>(Click <a href={`${Config.getValue('basePath')}buyloc`} target="_blank" rel="noopener noreferrer">here</a> to learn how you can buy LOC directly to enjoy cheaper travel)</p>
            </div>
            <button className="button" onClick={this.handleLOCPayment} type="button" disabled={this.isPaymentEnabled}>Pay with LOC Tokens</button>
          </div>
          <div className="logos">
            <div className="logo loc">
              <img src={Config.getValue('basePath') + 'images/logos/loc.jpg'} alt="Visa Logo" />
            </div>
          </div>
        </div>

        {quotePPAdditionalFees &&
          <div className="payment-methods-cc-wrapper">
            <div className="details">
              <p className="booking-card-price">
                Pay with Credit Card: <span className="important">{currencySign} {totalPrice}</span>
              </p>
              <p>Additional Fees: <span className="important">{currencySign} {(quotePPAdditionalFees + (Math.abs(totalPrice - fiatAmount))).toFixed(2)}</span></p>
              <div className="price-update-timer" tooltip="Seconds until we update your quoted price">
                <span>Market Price will update in <i className="fa fa-clock-o" aria-hidden="true"></i>&nbsp;<span className="timer-seconds">{this.startTimer(this.props.seconds)}</span> sec &nbsp;</span>
              </div>
              <div>
                <button className="button" disabled={this.isPaymentEnabled} onClick={this.handleCCPayment} type="button">Pay with Credit Card</button>
              </div>
            </div>
            <div className="logos">
              <div className="logos-row">
                <div className="logo credit-cards">
                  <img src={Config.getValue('basePath') + 'images/logos/credit-cards.png'} alt="Credit Cards Logos" />
                </div>
              </div>
              <div className="logos-row">
                <div className="logo safecharge">
                  <img src={Config.getValue('basePath') + 'images/logos/safecharge.png'} alt="Safecharge Logo" />
                </div>
              </div>
            </div>
          </div>
        }
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
  seconds: PropTypes.number,
  updatedPrice: PropTypes.string
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
