import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { LocRateWebSocket } from '../../../services/socket/locRateWebSocket';
import { CurrencyConverter } from '../../../services/utilities/currencyConverter';

const DEFAULT_CRYPTO_CURRENCY = 'EUR';

class LocRate extends PureComponent {
  constructor(props) {
    super(props);

    this.isSendMessage = false;
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.exchangerSocketInfo.isLocRateWebsocketConnected && this.isSendMessage) {
      this.isSendMessage = false;
    }
    if (nextProps.exchangerSocketInfo.isLocRateWebsocketConnected && !this.isSendMessage) {
      this.isSendMessage = true;
      LocRateWebSocket.sendMessage(null, null, { currency: this.props.paymentInfo.currency, fiatAmount: this.props.locRateFiatAmount });
    }
    if (nextProps.locRateFiatAmount !== this.props.locRateFiatAmount) {
      LocRateWebSocket.sendMessage(null, 'unsubscribe');
      LocRateWebSocket.sendMessage(null, null, { currency: this.props.paymentInfo.currency, fiatAmount: nextProps.locRateFiatAmount });
    }
    if (nextProps.paymentInfo.currency !== this.props.paymentInfo.currency) {
      localStorage['currency'] = nextProps.paymentInfo.currency;
      LocRateWebSocket.sendMessage(null, null, { currency: nextProps.paymentInfo.currency, fiatAmount: this.props.locRateFiatAmount });
    }
  }

  componentWillUnmount() {
    LocRateWebSocket.sendMessage(null, 'unsubscribe');
  }

  render() {
    const { currency } = this.props.paymentInfo;
    let { locRate } = this.props;

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
  paymentInfo: PropTypes.object,

  // Redux props
  exchangerSocketInfo: PropTypes.object,
  locRate: PropTypes.string,
  locRateFiatAmount: PropTypes.number,
};

function mapStateToProps(state, ownProps) {
  const { currenciesRatesInfo, dynamicLocRatesInfo, exchangerSocketInfo, locAmountsInfo } = state;

  let locRate = dynamicLocRatesInfo.locRate && (dynamicLocRatesInfo.locRate).toFixed(4);
  const locRateFiatAmount = dynamicLocRatesInfo.fiatAmount;
  let locAmount;
  let fiat;

  if (exchangerSocketInfo.isLocRateWebsocketConnected) {
    locAmount = locAmountsInfo.locAmounts[locRateFiatAmount];
  } else {
    if (dynamicLocRatesInfo.locEurRate) {
      locAmount = locRateFiatAmount / dynamicLocRatesInfo.locEurRate;
    }
  }

  if (!dynamicLocRatesInfo.locRate || ownProps.paymentInfo.currency !== localStorage['currency']) {
    fiat = currenciesRatesInfo.rates && CurrencyConverter.convert(currenciesRatesInfo.rates, DEFAULT_CRYPTO_CURRENCY, ownProps.paymentInfo.currency, locRateFiatAmount);
  }

  if (fiat && locAmount) {
    dynamicLocRatesInfo.locRate = fiat / locAmount;
    locRate = (dynamicLocRatesInfo.locRate).toFixed(4);
  }

  return {
    exchangerSocketInfo,
    locRate,
    locRateFiatAmount
  };
}

export default connect(mapStateToProps)(LocRate);