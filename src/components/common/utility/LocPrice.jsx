import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CurrencyConverter } from '../../../services/utilities/currencyConverter';
import { RoomsXMLCurrency } from '../../../services/utilities/roomsXMLCurrency';
import { LocPriceWebSocket } from '../../../services/socket/locPriceWebSocket';

const DEFAULT_CRYPTO_CURRENCY = 'EUR';

class LocPrice extends Component {
  constructor(props) {
    super(props);

    this.fiatInEur = null;

    setTimeout(() => {
      this.fiatInEur = this.props.paymentInfo.rates && CurrencyConverter.convert(this.props.paymentInfo.rates, RoomsXMLCurrency.get(), DEFAULT_CRYPTO_CURRENCY, this.props.fiat);
      LocPriceWebSocket.sendMessage(JSON.stringify({ id: this.fiatInEur, fiatAmount: this.fiatInEur }));
    }, 10);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.socketInfo.isLocPriceWebsocketConnected !== this.props.socketInfo.isLocPriceWebsocketConnected) {
      LocPriceWebSocket.sendMessage(JSON.stringify({ id: this.fiatInEur, fiatAmount: this.fiatInEur }));
    }
  }

  shouldComponentUpdate(nextProps) {
    if (this.fiatInEur && !this.props.socketInfo.isLocPriceWebsocketConnected) {
      return true;
    }
    if (this.fiatInEur && Object.keys(nextProps.paymentInfo.locAmounts).includes((this.fiatInEur).toString())) {
      return true;
    }
    return false;
  }

  componentWillUnmount() {
    LocPriceWebSocket.sendMessage(JSON.stringify({ id: this.fiatInEur, unsubscribe: true }));
  }

  render() {
    const isLogged = this.props.userInfo.isLogged;
    const { locRateInEur, locAmounts } = this.props.paymentInfo;

    if (isLogged === undefined || !locRateInEur || !this.fiatInEur) {
      return null;
    }

    const locPrice = this.props.socketInfo.isLocPriceWebsocketConnected ?
      Number(locAmounts[this.fiatInEur]) :
      this.fiatInEur / locRateInEur;

    if (!locPrice || locPrice === 0) {
      return null;
    }

    return (
      <span>
        {isLogged ? '(' : ''}
        LOC {locPrice && (locPrice).toFixed(2)}
        {isLogged ? ')' : ''}
      </span>
    );
  }
}

LocPrice.propTypes = {
  fiat: PropTypes.number,

  // Redux props
  dispatch: PropTypes.func,
  paymentInfo: PropTypes.object,
  userInfo: PropTypes.object,
  socketInfo: PropTypes.object
};

function mapStateToProps(state) {
  const { userInfo, paymentInfo, socketInfo } = state;
  return {
    userInfo,
    paymentInfo,
    socketInfo
  };
}

export default connect(mapStateToProps)(LocPrice);