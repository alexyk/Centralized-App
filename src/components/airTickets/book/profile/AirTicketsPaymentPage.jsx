import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import SendTokensModal from '../../../profile/wallet/SendTokensModal';
import { ExchangerWebsocket } from '../../../../services/socket/exchangerWebsocket';
import {Config} from "../../../../config";
import Stomp from "stompjs"

import '../../../../styles/css/components/airTickets/book/payment/air-tickets-payment-page.css';

const DEFAULT_QUOTE_LOC_ID = 'quote';

class AirTicketsPaymentPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      locEurRate: null
    };

    this.closeModal = this.closeModal.bind(this);
    this.handleLOCPayment = this.handleLOCPayment.bind(this);
    this.isSendMessage = false;
    this.connectSocketForLocRate = this.connectSocketForLocRate.bind(this);
    this.isPaymentEnabled = localStorage.getItem('passpayd') === true;
  }

  componentDidMount() {
    this.connectSocketForLocRate();
  }

  componentDidUpdate(prevProps) {
    this.isSendMessage = true;
    ExchangerWebsocket.sendMessage(prevProps.locRateFiatAmount, 'getLocPrice', { fiatAmount: prevProps.locRateFiatAmount })
  }
  connectSocketForLocRate(){
    const topic = "queue";
    const url = Config.getValue("socketHost");
    let client = Stomp.client(url);
    this.locRateClient = client;
    const onSubscribe = ()=>client.subscribe(topic, (data)=>{
      this.setState({
        locEurRate: JSON.parse(data.body).eurPrice
      })
    });

    client.connect(
      null,
      null,
      onSubscribe
    );
  }

  componentWillUnmount() {
    ExchangerWebsocket.sendMessage(this.props.result.locPrice, 'unsubscribe');
    this.locRateClient.disconnect()
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
