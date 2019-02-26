import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ExchangerWebsocket } from '../../../services/socket/exchangerWebsocket';
import { CurrencyConverter } from '../../../services/utilities/currencyConverter';
import { getCurrency } from '../../../selectors/paymentInfo';
import { getCurrencyExchangeRates, getLocEurRate, getLocRateFiatAmount } from '../../../selectors/exchangeRatesInfo';
import { isExchangerWebsocketConnected } from '../../../selectors/exchangerSocketInfo';
import { getLocAmountById } from '../../../selectors/locAmountsInfo';
import {Config} from "../../../config";
import Stomp from "stompjs";

const DEFAULT_CRYPTO_CURRENCY = 'EUR';

class LocRate extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      locEurRate: null
    }
    this.isSendMessage = false;
    this.connectSocketForLocRate = this.connectSocketForLocRate.bind(this);
  }

  componentDidMount(){
    this.connectSocketForLocRate();
  }

  componentDidUpdate(prevProps) {
    if (!this.props.isExchangerWebsocketConnected && this.isSendMessage) {
      this.isSendMessage = false;
    }
    if (this.props.isExchangerWebsocketConnected && !this.isSendMessage) {
      this.isSendMessage = true;
      ExchangerWebsocket.sendMessage(prevProps.locRateFiatAmount, 'getLocPrice', { fiatAmount: prevProps.locRateFiatAmount })

    }
  }
  connectSocketForLocRate(){
    const topic = "/topic/loc_rate";
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
    ExchangerWebsocket.sendMessage(this.props.locRateFiatAmount, 'unsubscribe');
    this.locRateClient.disconnect()
  }

  render() {
    const { currency, currencyExchangeRates, locRateFiatAmount, locRateLocAmount } = this.props;
    let locEurRate = this.state.locEurRate || this.props.locEurRate;
    const fiat = currencyExchangeRates && CurrencyConverter.convert(currencyExchangeRates, DEFAULT_CRYPTO_CURRENCY, currency, locRateFiatAmount);
    let locAmount = locRateLocAmount;
    if (!locAmount) {
      locAmount = locRateFiatAmount / locEurRate;
    }

    let locRate = fiat / locAmount;

    if (!locRate) {
      return <div className={"loader sm-none"} style={{ width: '100px' }} ></div>;
    }
    return (
      <Fragment>
        <span className="cross-rate">LOC/{currency} </span>
        <span className="rate">{Number(locRate).toFixed(4)} {currency}</span>
      </Fragment>
    );
  }
}

LocRate.propTypes = {
  // Redux props
  currency: PropTypes.string,
  isExchangerWebsocketConnected: PropTypes.bool,
  currencyExchangeRates: PropTypes.object,
  locEurRate: PropTypes.number,
  locRateFiatAmount: PropTypes.number,
  locRateLocAmount: PropTypes.number
};

function mapStateToProps(state) {
  const { exchangerSocketInfo, exchangeRatesInfo, locAmountsInfo, paymentInfo } = state;
  const locRateFiatAmount = getLocRateFiatAmount(exchangeRatesInfo);

  return {
    isExchangerWebsocketConnected: isExchangerWebsocketConnected(exchangerSocketInfo),
    currencyExchangeRates: getCurrencyExchangeRates(exchangeRatesInfo),
    locEurRate: getLocEurRate(exchangeRatesInfo),
    locRateFiatAmount,
    locRateLocAmount: getLocAmountById(locAmountsInfo, locRateFiatAmount),
    currency: getCurrency(paymentInfo)
  };
}

export default connect(mapStateToProps)(LocRate);
