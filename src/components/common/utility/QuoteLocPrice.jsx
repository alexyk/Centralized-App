import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import PropTypes from 'prop-types';
import { CurrencyConverter } from '../../../services/utilities/currencyConverter';
import { RoomsXMLCurrency } from '../../../services/utilities/roomsXMLCurrency';
import { LocPriceWebSocket } from '../../../services/socket/locPriceWebSocket';
import { removeLocAmount } from '../../../actions/locAmountsInfo';
import { LONG } from '../../../constants/notificationDisplayTimes.js';

const DEFAULT_CRYPTO_CURRENCY = 'EUR';
const DEFAULT_QUOTE_LOC_ID = 'quote';
const DEFAULT_QUOTE_LOC_METHOD = 'quoteLoc';

class QuoteLocPrice extends PureComponent {
  constructor(props) {
    super(props);

    this.isQuoteLocRendered = false;
    this.quoteLocSendAttempts = 0;

    this.sendWebsocketMessage(null, null, this.props.params);

    this.state = {
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
      this.sendWebsocketMessage(null, null, this.props.params);
    }
  }

  componentWillUnmount() {
    this.sendWebsocketMessage(null, 'unsubscribe');
    this.props.invalidateQuoteLoc();
    if (this.props.locAmount) {
      this.props.dispatch(removeLocAmount(DEFAULT_QUOTE_LOC_ID));
    }
  }

  sendWebsocketMessage(id, method, params) {
    LocPriceWebSocket.sendMessage(id || DEFAULT_QUOTE_LOC_ID, method || DEFAULT_QUOTE_LOC_METHOD, params);
  }

  redirectToHotelDetailsPage() {
    NotificationManager.warning(this.props.quoteLocError, '', LONG);
    this.props.redirectToHotelDetailsPage();
  }

  render() {
    if (!this.isQuoteLocRendered && this.state.locAmount) {
      this.isQuoteLocRendered = true;
    }
    if (!this.isQuoteLocRendered && this.props.quoteLocError) {
      if (this.quoteLocSendAttempts === 10) {
        this.redirectToHotelDetailsPage();
      } else {
        this.quoteLocSendAttempts += 1;
        this.sendWebsocketMessage(null, null, this.props.params);
      }
    } else if (this.isQuoteLocRendered && this.props.quoteLocError) {
      this.redirectToHotelDetailsPage();
    }
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

QuoteLocPrice.defaultProps = {
  params: {},
  brackets: true,
  withTimer: false,
};

QuoteLocPrice.propTypes = {
  fiat: PropTypes.number,
  brackets: PropTypes.bool,
  method: PropTypes.string,
  params: PropTypes.object,
  withTimer: PropTypes.bool,
  invalidateQuoteLoc: PropTypes.func,
  redirectToHotelDetailsPage: PropTypes.func,

  // Redux props
  dispatch: PropTypes.func,
  userInfo: PropTypes.object,
  exchangerSocketInfo: PropTypes.object,
  locAmount: PropTypes.string,
  renderLocAmount: PropTypes.bool,
  quoteLocError: PropTypes.string
};

function mapStateToProps(state, ownProps) {
  const { fiat, withTimer } = ownProps;

  const { userInfo, exchangerSocketInfo, locAmountsInfo, exchangeRatesInfo, locPriceUpdateTimerInfo } = state;

  let renderLocAmount;
  if (withTimer) {
    renderLocAmount = locPriceUpdateTimerInfo.seconds === locPriceUpdateTimerInfo.initialSeconds;
  }

  let locAmount = locAmountsInfo.locAmounts[DEFAULT_QUOTE_LOC_ID] && locAmountsInfo.locAmounts[DEFAULT_QUOTE_LOC_ID].locAmount && (locAmountsInfo.locAmounts[DEFAULT_QUOTE_LOC_ID].locAmount).toFixed(2);
  const quoteLocError = locAmountsInfo.locAmounts[DEFAULT_QUOTE_LOC_ID] && locAmountsInfo.locAmounts[DEFAULT_QUOTE_LOC_ID].error;

  if (!locAmount) {
    let fiatInEur;
    if (fiat === 15) {
      fiatInEur = fiat;
    } else {
      fiatInEur = exchangeRatesInfo.currencyExchangeRates && CurrencyConverter.convert(exchangeRatesInfo.currencyExchangeRates, RoomsXMLCurrency.get(), DEFAULT_CRYPTO_CURRENCY, fiat);
    }

    locAmount = (fiatInEur / exchangeRatesInfo.locEurRate).toFixed(2);
  }

  return {
    userInfo,
    exchangerSocketInfo,
    locAmount,
    renderLocAmount,
    quoteLocError
  };
}

export default connect(mapStateToProps)(QuoteLocPrice);