import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ExchangerWebsocket } from '../../../services/socket/exchangerWebsocket';
import { CurrencyConverter } from '../../../services/utilities/currencyConverter';
import { getCurrency } from '../../../selectors/paymentInfo';
import { getCurrencyExchangeRates, getLocEurRate, getLocRateFiatAmount } from '../../../selectors/exchangeRatesInfo';
import { isExchangerWebsocketConnected } from '../../../selectors/exchangerSocketInfo';
import { getLocAmountById } from '../../../selectors/locAmountsInfo';

const DEFAULT_CRYPTO_CURRENCY = 'EUR';

class LocRate extends PureComponent {
  constructor(props) {
    super(props);

    this.isSendMessage = false;
  }

  componentDidUpdate(prevProps) {
    if (!this.props.isExchangerWebsocketConnected && this.isSendMessage) {
      this.isSendMessage = false;
    }
    if (this.props.isExchangerWebsocketConnected && !this.isSendMessage) {
      this.isSendMessage = true;
      ExchangerWebsocket.sendMessage(prevProps.locRateFiatAmount, 'getLocPrice', { fiatAmount: prevProps.locRateFiatAmount });
    }
  }

  componentWillUnmount() {
    ExchangerWebsocket.sendMessage(this.props.locRateFiatAmount, 'unsubscribe');
  }

  render() {
    const { currency, currencyExchangeRates, locRateFiatAmount, locEurRate, locRateLocAmount } = this.props;

    const fiat = currencyExchangeRates && CurrencyConverter.convert(currencyExchangeRates, DEFAULT_CRYPTO_CURRENCY, currency, locRateFiatAmount);
    let locAmount = locRateLocAmount;
    if (!locAmount) {
      locAmount = locRateFiatAmount / locEurRate;
    }

    let locRate = fiat / locAmount;

    if (!locRate) {
      return <div className="loader sm-none" style={{ width: '100px' }} ></div>;
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