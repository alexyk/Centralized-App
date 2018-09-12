import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CurrencyConverter } from '../../../services/utilities/currencyConverter';
import { RoomsXMLCurrency } from '../../../services/utilities/roomsXMLCurrency';
import Websocket from '../../../services/socket/websocket';
import { updateLocAmounts } from '../../../actions/paymentInfo';

const DEFAULT_CRYPTO_CURRENCY = 'EUR';

class LocPrice extends Component {
  constructor(props) {
    super(props);

    this.fiatInEur = this.props.paymentInfo.rates && CurrencyConverter.convert(this.props.paymentInfo.rates, RoomsXMLCurrency.get(), DEFAULT_CRYPTO_CURRENCY, this.props.fiat);

    // SOCKET BINDINGS
    this.handleReceiveMessage = this.handleReceiveMessage.bind(this);

    // this.disconnectSocket = this.disconnectSocket.bind(this);
    // this.socketClose = this.socketClose.bind(this);
  }

  componentDidMount() {
    Websocket.onMessage(this.handleReceiveMessage);
    Websocket.sendMessage(JSON.stringify({ id: this.fiatInEur, fiatAmount: this.fiatInEur }));
  }

  // shouldComponentUpdate(nextProps) {
  //   if (nextProps.paymentInfo.locAmounts !== this.props.paymentInfo.locAmounts) {
  //     console.log('update');
  //     return true;
  //   }
  //   return false;
  // }

  handleReceiveMessage(event) {
    const data = JSON.parse(event.data);
    console.log(data);
    this.props.dispatch(updateLocAmounts(Number(data.id), data.locAmount));
  }

  render() {
    const { fiat } = this.props;
    const rates = this.props.paymentInfo.rates;
    const locRate = this.props.paymentInfo.locRateInEur;
    const isLogged = this.props.userInfo.isLogged;

    if (!rates || !fiat || !locRate || isLogged === undefined) {
      return null;
    }

    return (
      <span>
        {isLogged ? '(' : ''}
        LOC {this.props.paymentInfo.locAmounts[this.fiatInEur] &&
          Number(this.props.paymentInfo.locAmounts[this.fiatInEur]).toFixed(2)}{isLogged ? ')' : ''}
      </span>
    );
  }
}

LocPrice.propTypes = {
  fiat: PropTypes.number,

  // Redux props
  dispatch: PropTypes.func,
  paymentInfo: PropTypes.object,
  userInfo: PropTypes.object
};


function mapStateToProps(state) {
  const { userInfo, paymentInfo } = state;
  return {
    userInfo,
    paymentInfo
  };
}


export default connect(mapStateToProps)(LocPrice);