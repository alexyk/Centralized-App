import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CurrencyConverter } from '../../../services/utilities/currencyConverter';
import { RoomsXMLCurrency } from '../../../services/utilities/roomsXMLCurrency';
import { ExchangerWebsocket } from '../../../services/socket/exchangerWebsocket';
import { removeLocAmount } from '../../../actions/locAmountsInfo';
import { isLogged } from '../../../selectors/userInfo';
import { getLocAmountById } from '../../../selectors/locAmountsInfo';
import { getCurrencyExchangeRates, getLocEurRate } from '../../../selectors/exchangeRatesInfo';
import { isExchangerWebsocketConnected } from '../../../selectors/exchangerSocketInfo';

const DEFAULT_CRYPTO_CURRENCY = 'EUR';
const DEFAULT_LOC__PRICE_METHOD = 'getLocPrice';

class LocPrice extends PureComponent {
  constructor(props) {
    super(props);
    let isLocPriceRendered = false;
    let fiatInEur;
    if (this.props.currencyExchangeRates) {
      fiatInEur = this.props.currencyExchangeRates && CurrencyConverter.convert(this.props.currencyExchangeRates, RoomsXMLCurrency.get(), DEFAULT_CRYPTO_CURRENCY, this.props.fiat);
      this.sendWebsocketMessage(fiatInEur, null, Object.assign(this.props.params, { fiatAmount: fiatInEur }));
      isLocPriceRendered = true;
    }
    this.state = {
      fiatInEur,
      isLocPriceRendered
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.isExchangerWebsocketConnected &&
      this.props.isExchangerWebsocketConnected !== prevProps.isExchangerWebsocketConnected) {
      this.sendWebsocketMessage(this.state.fiatInEur, null, Object.assign(prevProps.params, { fiatAmount: this.state.fiatInEur }));
    }
    if (this.props.currencyExchangeRates && !this.state.isLocPriceRendered) {
      const fiatInEur = this.props.currencyExchangeRates && CurrencyConverter.convert(this.props.currencyExchangeRates, RoomsXMLCurrency.get(), DEFAULT_CRYPTO_CURRENCY, prevProps.fiat);
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
    const { isUserLogged } = this.props;
    const { brackets, locAmount } = this.props;

    const bracket = brackets && isUserLogged;

    if (isUserLogged === undefined) {
      return null;
    }

    return (
      <span>{bracket && '('}LOC {locAmount && locAmount}{bracket && ')'}</span>
    );
  }
}

LocPrice.defaultProps = {
  brackets: true
};

LocPrice.propTypes = {
  fiat: PropTypes.number,
  brackets: PropTypes.bool,
  method: PropTypes.string,
  params: PropTypes.object,

  // Redux props
  dispatch: PropTypes.func,
  currencyExchangeRates: PropTypes.object,
  locAmount: PropTypes.string,
  isUserLogged: PropTypes.bool,
  isExchangerWebsocketConnected: PropTypes.bool
};

function mapStateToProps(state, ownProps) {
  const { fiat } = ownProps;
  const { userInfo, exchangerSocketInfo, locAmountsInfo, exchangeRatesInfo } = state;

  const currencyExchangeRates = getCurrencyExchangeRates(exchangeRatesInfo);
  const fiatInEur = currencyExchangeRates && CurrencyConverter.convert(currencyExchangeRates, RoomsXMLCurrency.get(), DEFAULT_CRYPTO_CURRENCY, fiat);
  let locAmount = getLocAmountById(locAmountsInfo, fiatInEur);

  if (!locAmount) {
    const locEurRate = getLocEurRate(exchangeRatesInfo);
    locAmount = fiatInEur / locEurRate;
  }

  return {
    currencyExchangeRates,
    locAmount: (locAmount).toFixed(2),
    isUserLogged: isLogged(userInfo),
    isExchangerWebsocketConnected: isExchangerWebsocketConnected(exchangerSocketInfo)
  };
}

export default connect(mapStateToProps)(LocPrice);