import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CurrencyConverter } from '../../../services/utilities/currencyConverter';
import { RoomsXMLCurrency } from '../../../services/utilities/roomsXMLCurrency';
import { LocPriceWebSocket } from '../../../services/socket/locPriceWebSocket';
import { removeLocAmount } from '../../../actions/locAmountsInfo';

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
      locAmount: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.renderLocAmount !== this.props.renderLocAmount && this.props.withTimer) {
      this.setState({
        locAmount: this.props.locAmount
      });
    }
    if (nextProps.exchangerSocketInfo.isLocPriceWebsocketConnected &&
      nextProps.exchangerSocketInfo.isLocPriceWebsocketConnected !== this.props.exchangerSocketInfo.isLocPriceWebsocketConnected) {
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
    if (this.props.locAmount) {
      this.props.dispatch(removeLocAmount(this.state.fiatInEur));
    }
  }

  render() {
    const isLogged = this.props.userInfo.isLogged;
    const { brackets } = this.props;
    const locAmount = this.props.withTimer ? this.state.locAmount : this.props.locAmount;

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
  withTimer: false,
};

LocPrice.propTypes = {
  fiat: PropTypes.number,
  brackets: PropTypes.bool,
  method: PropTypes.string,
  params: PropTypes.object,
  withTimer: PropTypes.bool,

  // Redux props
  dispatch: PropTypes.func,
  userInfo: PropTypes.object,
  exchangerSocketInfo: PropTypes.object,
  locAmount: PropTypes.string,
  currenciesRatesInfo: PropTypes.object,
  renderLocAmount: PropTypes.bool
};

function mapStateToProps(state, ownProps) {
  const { fiat, withTimer } = ownProps;

  const { userInfo, dynamicLocRatesInfo, exchangerSocketInfo, locAmountsInfo, currenciesRatesInfo, locPriceUpdateTimerInfo } = state;

  const fiatInEur = currenciesRatesInfo.rates && CurrencyConverter.convert(currenciesRatesInfo.rates, RoomsXMLCurrency.get(), DEFAULT_CRYPTO_CURRENCY, fiat);

  let locAmount;
  let renderLocAmount;
  if (withTimer) {
    renderLocAmount = locPriceUpdateTimerInfo.seconds === locPriceUpdateTimerInfo.initialSeconds;
  }

  if (locAmountsInfo.locAmounts[fiatInEur]) {
    locAmount = (locAmountsInfo.locAmounts[fiatInEur].locAmount).toFixed(2);
  }

  if (!exchangerSocketInfo.isLocPriceWebsocketConnected && dynamicLocRatesInfo.locEurRate) {
    locAmount = (fiatInEur / dynamicLocRatesInfo.locEurRate).toFixed(2);
  }

  return {
    userInfo,
    exchangerSocketInfo,
    locAmount,
    currenciesRatesInfo,
    renderLocAmount
  };
}

export default connect(mapStateToProps)(LocPrice);