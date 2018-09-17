import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CurrencyConverter } from '../../../services/utilities/currencyConverter';
import { RoomsXMLCurrency } from '../../../services/utilities/roomsXMLCurrency';
import { LocPriceWebSocket } from '../../../services/socket/locPriceWebSocket';

const DEFAULT_CRYPTO_CURRENCY = 'EUR';

class LocPrice extends PureComponent {
  constructor(props) {
    super(props);

    let isLocPriceRendered = false;
    let fiatInEur;

    if (this.props.currenciesRatesInfo.rates) {
      fiatInEur = this.props.currenciesRatesInfo.rates && CurrencyConverter.convert(this.props.currenciesRatesInfo.rates, RoomsXMLCurrency.get(), DEFAULT_CRYPTO_CURRENCY, this.props.fiat);
      LocPriceWebSocket.sendMessage(JSON.stringify({ id: fiatInEur, fiatAmount: fiatInEur }));
      isLocPriceRendered = true;
    }

    this.state = {
      fiatInEur,
      isLocPriceRendered,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.socketInfo.isLocPriceWebsocketConnected &&
      nextProps.socketInfo.isLocPriceWebsocketConnected !== this.props.socketInfo.isLocPriceWebsocketConnected) {
      LocPriceWebSocket.sendMessage(JSON.stringify({ id: this.state.fiatInEur, fiatAmount: this.state.fiatInEur }));
    }

    if (nextProps.currenciesRatesInfo.rates && !this.state.isLocPriceRendered) {
      const fiatInEur = this.props.currenciesRatesInfo.rates && CurrencyConverter.convert(this.props.currenciesRatesInfo.rates, RoomsXMLCurrency.get(), DEFAULT_CRYPTO_CURRENCY, this.props.fiat);
      LocPriceWebSocket.sendMessage(JSON.stringify({ id: fiatInEur, fiatAmount: fiatInEur }));
      this.setState({
        isLocPriceRendered: true,
        fiatInEur
      });
    }
  }

  componentWillUnmount() {
    LocPriceWebSocket.sendMessage(JSON.stringify({ id: this.state.fiatInEur, unsubscribe: true }));
  }

  render() {
    const isLogged = this.props.userInfo.isLogged;
    const { locAmount } = this.props;

    if (isLogged === undefined) {
      return null;
    }

    return (
      <span>
        {isLogged ? '(' : ''}
        LOC {locAmount && locAmount}
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
  socketInfo: PropTypes.object,
  locAmount: PropTypes.string,
  currenciesRatesInfo: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  const fiat = ownProps.fiat;

  const { userInfo, dynamicLocRatesInfo, socketInfo, locAmountsInfo, currenciesRatesInfo } = state;

  const fiatInEur = currenciesRatesInfo.rates && CurrencyConverter.convert(currenciesRatesInfo.rates, RoomsXMLCurrency.get(), DEFAULT_CRYPTO_CURRENCY, fiat);

  let locAmount;

  if (locAmountsInfo.locAmounts[fiatInEur]) {
    locAmount = (locAmountsInfo.locAmounts[fiatInEur]).toFixed(2);
  }

  if (!socketInfo.isLocPriceWebsocketConnected) {
    locAmount = (fiatInEur / dynamicLocRatesInfo.locEurRate).toFixed(2);
  }

  return {
    userInfo,
    socketInfo,
    locAmount,
    currenciesRatesInfo,
  };
}

export default connect(mapStateToProps)(LocPrice);