import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ExchangerWebsocket } from '../../../services/socket/exchangerWebsocket';
import { CurrencyConverter } from '../../../services/utilities/currencyConverter';
import { getCurrency } from '../../../selectors/paymentInfo';

const DEFAULT_CRYPTO_CURRENCY = 'EUR';

class LocRate extends PureComponent {
  constructor(props) {
    super(props);

    this.isSendMessage = false;
  }

  componentDidUpdate(prevProps) {
    if (!this.props.exchangerSocketInfo.isExchangerWebsocketConnected && this.isSendMessage) {
      this.isSendMessage = false;
    }
    if (this.props.exchangerSocketInfo.isExchangerWebsocketConnected && !this.isSendMessage) {
      this.isSendMessage = true;
      ExchangerWebsocket.sendMessage(prevProps.exchangeRatesInfo.locRateFiatAmount, 'getLocPrice', { fiatAmount: prevProps.exchangeRatesInfo.locRateFiatAmount });
    }
  }

  componentWillUnmount() {
    ExchangerWebsocket.sendMessage(this.props.exchangeRatesInfo.locRateFiatAmount, 'unsubscribe');
  }

  render() {
    const { currency, exchangeRatesInfo, locAmountsInfo } = this.props;
    
    const fiat = exchangeRatesInfo.currencyExchangeRates && CurrencyConverter.convert(exchangeRatesInfo.currencyExchangeRates, DEFAULT_CRYPTO_CURRENCY, currency, this.props.exchangeRatesInfo.locRateFiatAmount);
    let locAmount = locAmountsInfo.locAmounts[exchangeRatesInfo.locRateFiatAmount] && locAmountsInfo.locAmounts[exchangeRatesInfo.locRateFiatAmount].locAmount;
    if (!locAmount) {
      locAmount = exchangeRatesInfo.locRateFiatAmount / exchangeRatesInfo.locEurRate;
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
  exchangerSocketInfo: PropTypes.object,
  exchangeRatesInfo: PropTypes.object,
  locAmountsInfo: PropTypes.object
};

function mapStateToProps(state) {
  const { exchangerSocketInfo, exchangeRatesInfo, locAmountsInfo, paymentInfo } = state;

  return {
    exchangerSocketInfo,
    exchangeRatesInfo,
    locAmountsInfo,
    currency: getCurrency(paymentInfo)
  };
}

export default connect(mapStateToProps)(LocRate);