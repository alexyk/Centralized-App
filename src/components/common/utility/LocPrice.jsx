import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CurrencyConverter } from '../../../services/utilities/currencyConverter';
import { RoomsXMLCurrency } from '../../../services/utilities/roomsXMLCurrency';
import { ExchangerWebsocket } from '../../../services/socket/exchangerWebsocket';
import { removeLocAmount } from '../../../actions/locAmountsInfo';

const DEFAULT_CRYPTO_CURRENCY = 'EUR';
const DEFAULT_LOC__PRICE_METHOD = 'getLocPrice';

class LocPrice extends PureComponent {
  constructor(props) {
    super(props);
    let isLocPriceRendered = false;
    let fiatInEur;
    if (this.props.exchangeRatesInfo.currencyExchangeRates) {
      fiatInEur = this.props.exchangeRatesInfo.currencyExchangeRates && CurrencyConverter.convert(this.props.exchangeRatesInfo.currencyExchangeRates, RoomsXMLCurrency.get(), DEFAULT_CRYPTO_CURRENCY, this.props.fiat);
      this.sendWebsocketMessage(fiatInEur, null, Object.assign(this.props.params, { fiatAmount: fiatInEur }));
      isLocPriceRendered = true;
    }
    this.state = {
      fiatInEur,
      isLocPriceRendered
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.exchangerSocketInfo.isExchangerWebsocketConnected &&
      this.props.exchangerSocketInfo.isExchangerWebsocketConnected !== prevProps.exchangerSocketInfo.isExchangerWebsocketConnected) {
      this.sendWebsocketMessage(this.state.fiatInEur, null, Object.assign(prevProps.params, { fiatAmount: this.state.fiatInEur }));
    }
    if (this.props.exchangeRatesInfo.currencyExchangeRates && !this.state.isLocPriceRendered) {
      const fiatInEur = this.props.exchangeRatesInfo.currencyExchangeRates && CurrencyConverter.convert(this.props.exchangeRatesInfo.currencyExchangeRates, RoomsXMLCurrency.get(), DEFAULT_CRYPTO_CURRENCY, prevProps.fiat);
      this.sendWebsocketMessage(fiatInEur, null, Object.assign(prevProps.params, { fiatAmount: fiatInEur }));
      this.setState({
        isLocPriceRendered: true,
        fiatInEur
      });
    }
  }

  componentWillUnmount() {
    const { fiatInEur } = this.state;

    this.sendWebsocketMessage(fiatInEur, 'unsubscribe');
    if (this.props.locAmount) {
      this.props.dispatch(removeLocAmount(fiatInEur));
    }
  }

  sendWebsocketMessage(id, method, params) {
    ExchangerWebsocket.sendMessage(id, method || DEFAULT_LOC__PRICE_METHOD, params);
  }

  render() {
    const isLogged = this.props.userInfo.isLogged;
    const { brackets, locAmount } = this.props;

    const bracket = brackets && isLogged;

    if (isLogged === undefined) {
      return null;
    }

    return (
      <span>{bracket && '('}LOC {locAmount && locAmount}{bracket && ')'}</span>
    );
  }
}

LocPrice.defaultProps = {
  params: {},
  brackets: true
};

LocPrice.propTypes = {
  fiat: PropTypes.number,
  brackets: PropTypes.bool,
  method: PropTypes.string,
  params: PropTypes.object,

  // Redux props
  dispatch: PropTypes.func,
  userInfo: PropTypes.object,
  exchangerSocketInfo: PropTypes.object,
  locAmount: PropTypes.string,
  exchangeRatesInfo: PropTypes.object,
  renderLocAmount: PropTypes.bool
};

function mapStateToProps(state, ownProps) {
  const { fiat } = ownProps;

  const { userInfo, exchangerSocketInfo, locAmountsInfo, exchangeRatesInfo } = state;
  const { currencyExchangeRates, locEurRate } = exchangeRatesInfo;

  const fiatInEur = currencyExchangeRates && CurrencyConverter.convert(currencyExchangeRates, RoomsXMLCurrency.get(), DEFAULT_CRYPTO_CURRENCY, fiat);

  let locAmount = locAmountsInfo.locAmounts[fiatInEur] && (locAmountsInfo.locAmounts[fiatInEur].locAmount).toFixed(2);

  if (!locAmount) {
    locAmount = (fiatInEur / locEurRate).toFixed(2);
  }

  return {
    userInfo,
    exchangerSocketInfo,
    locAmount,
    exchangeRatesInfo
  };
}

export default connect(mapStateToProps)(LocPrice);
