import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Websocket } from '../../../services/socket/exchangerWebsocket';
import { CurrencyConverter } from '../../../services/utilities/currencyConverter';

const DEFAULT_CRYPTO_CURRENCY = 'EUR';

class LocRate extends PureComponent {
  constructor(props) {
    super(props);

    this.isSendMessage = false;
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.exchangerSocketInfo.isLocPriceWebsocketConnected && this.isSendMessage) {
      this.isSendMessage = false;
    }
    if (nextProps.exchangerSocketInfo.isLocPriceWebsocketConnected && !this.isSendMessage) {
      this.isSendMessage = true;
      Websocket.sendMessage(this.props.exchangeRatesInfo.locRateFiatAmount, null, { fiatAmount: this.props.exchangeRatesInfo.locRateFiatAmount });
    }
  }

  componentWillUnmount() {
    Websocket.sendMessage(this.props.exchangeRatesInfo.locRateFiatAmount, 'unsubscribe');
  }

  render() {
    const { paymentInfo, exchangeRatesInfo, locAmountsInfo } = this.props;
    
    const fiat = exchangeRatesInfo.currencyExchangeRates && CurrencyConverter.convert(exchangeRatesInfo.currencyExchangeRates, DEFAULT_CRYPTO_CURRENCY, paymentInfo.currency, this.props.exchangeRatesInfo.locRateFiatAmount);
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
        <span className="cross-rate">LOC/{paymentInfo.currency} </span>
        <span className="rate">{Number(locRate).toFixed(4)} {paymentInfo.currency}</span>
      </Fragment>
    );
  }
}

LocRate.propTypes = {
  // Redux props
  paymentInfo: PropTypes.object,
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
    paymentInfo
  };
}

export default connect(mapStateToProps)(LocRate);