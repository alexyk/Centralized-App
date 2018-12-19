import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import PropTypes from 'prop-types';
import { CurrencyConverter } from '../../../services/utilities/currencyConverter';
import { RoomsXMLCurrency } from '../../../services/utilities/roomsXMLCurrency';
import { ExchangerWebsocket } from '../../../services/socket/exchangerWebsocket';
import { removeLocAmount } from '../../../actions/locAmountsInfo';
import { isLogged } from '../../../selectors/userInfo';
import { isExchangerWebsocketConnected } from '../../../selectors/exchangerSocketInfo';
import { LONG } from '../../../constants/notificationDisplayTimes.js';
import { getQuoteLocError, getLocAmountById } from '../../../selectors/locAmountsInfo';
import { getCurrencyExchangeRates, getLocEurRate } from '../../../selectors/exchangeRatesInfo';

const DEFAULT_CRYPTO_CURRENCY = 'EUR';
const DEFAULT_QUOTE_LOC_ID = 'quote';
const DEFAULT_QUOTE_LOC_METHOD = 'quoteLoc';

class QuoteLocPrice extends PureComponent {
  constructor(props) {
    super(props);

    this.isQuoteLocRendered = false;
    this.quoteLocSendAttempts = 0;

    this.sendWebsocketMessage(null, { bookingId: this.props.bookingId });
  }

  componentDidUpdate(prevProps) {
    if (this.props.isExchangerWebsocketConnected &&
      this.props.isExchangerWebsocketConnected !== prevProps.isExchangerWebsocketConnected) {
      this.sendWebsocketMessage(null, { bookingId: prevProps.bookingId });
    }
  }

  componentWillUnmount() {
    this.sendWebsocketMessage('unsubscribe');
    this.props.invalidateQuoteLoc();
    if (this.props.locAmount) {
      this.props.dispatch(removeLocAmount(DEFAULT_QUOTE_LOC_ID));
    }
  }

  sendWebsocketMessage(method, params) {
    ExchangerWebsocket.sendMessage(DEFAULT_QUOTE_LOC_ID, method || DEFAULT_QUOTE_LOC_METHOD, params);
  }

  redirectToHotelDetailsPage() {
    NotificationManager.warning(this.props.quoteLocError, '', LONG);
    this.props.redirectToHotelDetailsPage();
  }

  render() {
    const { brackets, locAmount, quoteLocError, isUserLogged, bookingId } = this.props;

    if (!this.isQuoteLocRendered && locAmount) {
      this.isQuoteLocRendered = true;
    }
    if (!this.isQuoteLocRendered && quoteLocError) {
      if (this.quoteLocSendAttempts === 10) {
        this.redirectToHotelDetailsPage();
      } else {
        this.quoteLocSendAttempts += 1;
        this.sendWebsocketMessage(null, { bookingId });
      }
    } else if (this.isQuoteLocRendered && quoteLocError) {
      this.redirectToHotelDetailsPage();
    }

    const bracket = brackets && isUserLogged;

    if (isUserLogged === undefined) {
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
  brackets: true
};

QuoteLocPrice.propTypes = {
  brackets: PropTypes.bool,
  bookingId: PropTypes.number,
  invalidateQuoteLoc: PropTypes.func,
  redirectToHotelDetailsPage: PropTypes.func,

  // Redux props
  dispatch: PropTypes.func,
  isUserLogged: PropTypes.bool,
  isExchangerWebsocketConnected: PropTypes.bool,
  locAmount: PropTypes.string,
  renderLocAmount: PropTypes.bool,
  quoteLocError: PropTypes.string
};

function mapStateToProps(state, ownProps) {
  const { userInfo, exchangerSocketInfo, locAmountsInfo, exchangeRatesInfo } = state;

  let locAmount = getLocAmountById(locAmountsInfo, DEFAULT_QUOTE_LOC_ID);

  // LocAmount back up value if exchanger socket connection is closed.
  if (!locAmount) {
    const { fiat } = ownProps;
    const currencyExchangeRates = getCurrencyExchangeRates(exchangeRatesInfo);
    const locEurRate = getLocEurRate(exchangeRatesInfo);
    const fiatInEur = currencyExchangeRates && CurrencyConverter.convert(currencyExchangeRates, RoomsXMLCurrency.get(), DEFAULT_CRYPTO_CURRENCY, fiat);

    locAmount = fiatInEur / locEurRate;
  }

  return {
    isUserLogged: isLogged(userInfo),
    isExchangerWebsocketConnected: isExchangerWebsocketConnected(exchangerSocketInfo),
    locAmount: (locAmount).toFixed(2),
    quoteLocError: getQuoteLocError(locAmountsInfo)
  };
}

export default connect(mapStateToProps)(QuoteLocPrice);