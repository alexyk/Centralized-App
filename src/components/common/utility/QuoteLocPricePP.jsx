import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import PropTypes from 'prop-types';
import { CurrencyConverter } from '../../../services/utilities/currencyConverter';
import { RoomsXMLCurrency } from '../../../services/utilities/roomsXMLCurrency';
import { Websocket } from '../../../services/socket/exchangerWebsocket';
import { removeLocAmount } from '../../../actions/locAmountsInfo';
import { LONG } from '../../../constants/notificationDisplayTimes.js';

const DEFAULT_CRYPTO_CURRENCY = 'EUR';
const DEFAULT_QUOTE_LOC_ID = 'quote-PP';
const DEFAULT_QUOTE_LOC_METHOD = 'quoteLoc';

class QuoteLocPricePP extends PureComponent {
  constructor(props) {
    super(props);

    this.isQuoteLocRendered = false;
    this.quoteLocSendAttempts = 0;

    this.sendWebsocketMessage(null, null, this.props.params);
  }

  componentWillReceiveProps(nextProps) {
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
    Websocket.sendMessage(id || DEFAULT_QUOTE_LOC_ID, method || DEFAULT_QUOTE_LOC_METHOD, params);
  }

  redirectToHotelDetailsPage() {
    NotificationManager.warning(this.props.quoteLocError, '', LONG);
    this.props.redirectToHotelDetailsPage();
  }

  render() {
    const { brackets, locAmount, quoteLocError, userInfo, params } = this.props;

    if (!this.isQuoteLocRendered && locAmount) {
      this.isQuoteLocRendered = true;
    }
    if (!this.isQuoteLocRendered && quoteLocError) {
      if (this.quoteLocSendAttempts === 10) {
        this.redirectToHotelDetailsPage();
      } else {
        this.quoteLocSendAttempts += 1;
        this.sendWebsocketMessage(null, null, params);
      }
    } else if (this.isQuoteLocRendered && quoteLocError) {
      this.redirectToHotelDetailsPage();
    }
    const isLogged = userInfo.isLogged;

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

QuoteLocPricePP.defaultProps = {
  params: {},
  brackets: true
};

QuoteLocPricePP.propTypes = {
  brackets: PropTypes.bool,
  method: PropTypes.string,
  params: PropTypes.object,
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
  const { fiat } = ownProps;

  const { userInfo, exchangerSocketInfo, locAmountsInfo, exchangeRatesInfo } = state;

  let locAmount = locAmountsInfo.locAmounts[DEFAULT_QUOTE_LOC_ID] && locAmountsInfo.locAmounts[DEFAULT_QUOTE_LOC_ID].locAmount && (locAmountsInfo.locAmounts[DEFAULT_QUOTE_LOC_ID].locAmount).toFixed(2);
  const quoteLocError = locAmountsInfo.locAmounts[DEFAULT_QUOTE_LOC_ID] && locAmountsInfo.locAmounts[DEFAULT_QUOTE_LOC_ID].error;

  if (!locAmount) {
    const fiatInEur = exchangeRatesInfo.currencyExchangeRates && CurrencyConverter.convert(exchangeRatesInfo.currencyExchangeRates, RoomsXMLCurrency.get(), DEFAULT_CRYPTO_CURRENCY, fiat);

    locAmount = (fiatInEur / exchangeRatesInfo.locEurRate).toFixed(2);
  }

  return {
    userInfo,
    exchangerSocketInfo,
    locAmount,
    quoteLocError
  };
}

export default connect(mapStateToProps)(QuoteLocPricePP);