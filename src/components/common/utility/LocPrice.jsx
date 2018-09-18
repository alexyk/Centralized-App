import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CurrencyConverter } from '../../../services/utilities/currencyConverter';
import { RoomsXMLCurrency } from '../../../services/utilities/roomsXMLCurrency';
import { LocPriceWebSocket } from '../../../services/socket/locPriceWebSocket';
import { clearLocAmounts } from '../../../actions/locAmountsInfo';

const DEFAULT_CRYPTO_CURRENCY = 'EUR';

class LocPrice extends PureComponent {
  constructor(props) {
    super(props);

    let isLocPriceRendered = false;
    let fiatInEur;

    if (this.props.currenciesRatesInfo.rates) {
      fiatInEur = this.props.currenciesRatesInfo.rates && CurrencyConverter.convert(this.props.currenciesRatesInfo.rates, RoomsXMLCurrency.get(), DEFAULT_CRYPTO_CURRENCY, this.props.fiat);
      LocPriceWebSocket.sendMessage(fiatInEur, this.props.method, Object.assign(this.props.params, { fiatAmount: fiatInEur }));
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
      LocPriceWebSocket.sendMessage(this.state.fiatInEur, this.props.method, Object.assign(this.props.params, { fiatAmount: this.state.fiatInEur }));
    }

    if (nextProps.currenciesRatesInfo.rates && !this.state.isLocPriceRendered) {
      const fiatInEur = nextProps.currenciesRatesInfo.rates && CurrencyConverter.convert(nextProps.currenciesRatesInfo.rates, RoomsXMLCurrency.get(), DEFAULT_CRYPTO_CURRENCY, this.props.fiat);
      LocPriceWebSocket.sendMessage(fiatInEur, this.props.method, Object.assign(this.props.params, { fiatAmount: fiatInEur }));
      this.setState({
        isLocPriceRendered: true,
        fiatInEur
      });
    }
  }

  componentWillUnmount() {
    LocPriceWebSocket.sendMessage(this.state.fiatInEur, 'unsubscribe');
    this.props.dispatch(clearLocAmounts());
  }

  render() {
    const isLogged = this.props.userInfo.isLogged;
    const { locAmount, brackets } = this.props;

    const bracket = brackets && isLogged;

    if (isLogged === undefined) {
      return null;
    }

    return (
      <span>
        {bracket && '('}
        LOC {locAmount && locAmount}
        {bracket && ')'}
      </span>
    );
  }
}

LocPrice.defaultProps = {
  params: {},
  brackets: true,
};

LocPrice.propTypes = {
  fiat: PropTypes.number,
  brackets: PropTypes.bool,
  method: PropTypes.string,
  params: PropTypes.object,

  // Redux props
  dispatch: PropTypes.func,
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
    if (locAmountsInfo.locAmounts[fiatInEur].quotedLoc) {
      locAmount = (locAmountsInfo.locAmounts[fiatInEur].quotedLoc).toFixed(2);
    } else {
      locAmount = (locAmountsInfo.locAmounts[fiatInEur]).toFixed(2);
    }
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