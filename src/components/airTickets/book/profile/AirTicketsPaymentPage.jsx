import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import SendTokensModal from '../../../profile/wallet/SendTokensModal';
import { ExchangerWebsocket } from '../../../../services/socket/exchangerWebsocket';
import {Config} from "../../../../config";
import Stomp from "stompjs"
import { CurrencyConverter } from '../../../../services/utilities/currencyConverter';

import '../../../../styles/css/components/airTickets/book/payment/air-tickets-payment-page.css';

const PAYMENT_PROCESSOR_IDENTIFICATOR = '-PP';
const DEFAULT_QUOTE_LOC_ID = 'quote';
const DEFAULT_QUOTE_LOC_PP_ID = DEFAULT_QUOTE_LOC_ID + PAYMENT_PROCESSOR_IDENTIFICATOR;

const updateFEPrice = (data, result) => {
  console.log(data);
  if(updateFEPrice) {
    let totalLocPrice = document.querySelector('.total-loc-price');
    let additionalFees = document.querySelector('.additional-fees');

    totalLocPrice.innerText = data.locAmount.toFixed(2);
    additionalFees.innerText = data.additionalFees.toFixed(2) + (Math.abs(result.total.price - data.fiatAmount));
  }
};

class AirTicketsPaymentPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      locEurRate: null,
      isConnectedForLocRage: false
    };

    this.closeModal = this.closeModal.bind(this);
    this.handleLOCPayment = this.handleLOCPayment.bind(this);
    this.isSendMessage = false;
    this.connectSocketForLocRate = this.connectSocketForLocRate.bind(this);
    this.isPaymentEnabled = localStorage.getItem('passpayd') === true;
    this.locRateClient = null;
  }

  componentDidMount() {
    if (!this.state.isConnectedForLocRage) {
      this.connectSocketForLocRate();
      this.setState({
        isConnectedForLocRage: true
      });
    }
  }

  componentDidUpdate(prevProps) {
    this.isSendMessage = true;
    ExchangerWebsocket.sendMessage(DEFAULT_QUOTE_LOC_ID, 'quoteLoc', { bookingId: this.props.result.flightReservationId }, true);
    ExchangerWebsocket.sendMessage(DEFAULT_QUOTE_LOC_PP_ID, 'quoteLoc', { bookingId: this.props.result.flightReservationId + PAYMENT_PROCESSOR_IDENTIFICATOR }, true);
  }
  connectSocketForLocRate(){
    const topic = "queue";
    const url = Config.getValue("socketHost");
    let client = Stomp.client(url);

    this.locRateClient = client;
    const onSubscribe = ()=>client.subscribe(topic, (data)=>{
      this.setState({
        locEurRate: JSON.parse(data.body).eurPrice
      });
      updateFEPrice(data, this.props.result);
    });

    client.connect(
      null,
      null,
      onSubscribe
    );
  }

  componentWillUnmount() {
    ExchangerWebsocket.sendMessage(this.props.result.locPrice, 'unsubscribe');
    this.locRateClient.disconnect();
    this.setState({
      isConnectedForLocRage: false
    });
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

  render() {
    console.log(this);
    const { result } = this.props;

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
              <span className="total-price">{result.price.locPrice.toFixed(2)}</span>
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
              <span className="total-loc-price">{result.price.total.toFixed(2)}</span>
              <span className="currency">{result.price.currency}</span>
            </h3>
          </div>
          <div className="price-wrapper">
            <h3>
              <span className="additional-fees"></span>
              <span className="currency">{result.price.currency}</span>
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
  ])
};

export default AirTicketsPaymentPage;
