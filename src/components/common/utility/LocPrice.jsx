import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CurrencyConverter } from '../../../services/utilities/currencyConverter';
import { RoomsXMLCurrency } from '../../../services/utilities/roomsXMLCurrency';
import { Websocket } from '../../../services/socket/exchangerWebsocket';
import { removeLocAmount } from '../../../actions/locAmountsInfo';

const DEFAULT_CRYPTO_CURRENCY = 'EUR';

class LocPrice extends PureComponent {
  constructor(props) {
    super(props);

    let isLocPriceRendered = false;
    let fiatInEur;

    if (this.props.exchangeRatesInfo.currencyExchangeRates) {
      if (this.props.fiat === 15) {
        fiatInEur = this.props.fiat;
      } else {
        fiatInEur = this.props.exchangeRatesInfo.currencyExchangeRates && CurrencyConverter.convert(this.props.exchangeRatesInfo.currencyExchangeRates, RoomsXMLCurrency.get(), DEFAULT_CRYPTO_CURRENCY, this.props.fiat);
      }
      Websocket.sendMessage(fiatInEur, this.props.method, Object.assign(this.props.params, { fiatAmount: fiatInEur }));
      isLocPriceRendered = true;
    }

    this.state = {
      fiatInEur,
      isLocPriceRendered
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.exchangerSocketInfo.isLocPriceWebsocketConnected &&
      nextProps.exchangerSocketInfo.isLocPriceWebsocketConnected !== this.props.exchangerSocketInfo.isLocPriceWebsocketConnected) {
      Websocket.sendMessage(this.state.fiatInEur, this.props.method, Object.assign(this.props.params, { fiatAmount: this.state.fiatInEur }));
    }

    if (nextProps.exchangeRatesInfo.currencyExchangeRates && !this.state.isLocPriceRendered) {
      let fiatInEur;
      if (this.props.fiat === 15) {
        fiatInEur = this.props.fiat;
      } else {
        fiatInEur = nextProps.exchangeRatesInfo.currencyExchangeRates && CurrencyConverter.convert(nextProps.exchangeRatesInfo.currencyExchangeRates, RoomsXMLCurrency.get(), DEFAULT_CRYPTO_CURRENCY, this.props.fiat);
      }
      Websocket.sendMessage(fiatInEur, this.props.method, Object.assign(this.props.params, { fiatAmount: fiatInEur }));
      this.setState({
        isLocPriceRendered: true,
        fiatInEur
      });
    }
  }

  componentWillUnmount() {
    Websocket.sendMessage(this.state.fiatInEur, 'unsubscribe');
    if (this.props.locAmount) {
      this.props.dispatch(removeLocAmount(this.state.fiatInEur));
    }
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

  let fiatInEur;
  if (fiat === 15) {
    fiatInEur = fiat;
  } else {
    fiatInEur = exchangeRatesInfo.currencyExchangeRates && CurrencyConverter.convert(exchangeRatesInfo.currencyExchangeRates, RoomsXMLCurrency.get(), DEFAULT_CRYPTO_CURRENCY, fiat);
  }

  let locAmount = locAmountsInfo.locAmounts[fiatInEur] && (locAmountsInfo.locAmounts[fiatInEur].locAmount).toFixed(2);

  if (!locAmount) {
    locAmount = (fiatInEur / exchangeRatesInfo.locEurRate).toFixed(2);
  }

  return {
    userInfo,
    exchangerSocketInfo,
    locAmount,
    exchangeRatesInfo
  };
}

export default connect(mapStateToProps)(LocPrice);
