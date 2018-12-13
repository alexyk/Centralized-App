import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import PropTypes from 'prop-types';
import { CurrencyConverter } from '../../../services/utilities/currencyConverter';
import { RoomsXMLCurrency } from '../../../services/utilities/roomsXMLCurrency';
import { ExchangerWebsocket } from '../../../services/socket/exchangerWebsocket';
import { removeLocAmount } from '../../../actions/locAmountsInfo';
import { isLogged } from '../../../selectors/userInfo';
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

  componentDidUpdate(prevProps) {
    if (this.props.exchangerSocketInfo.isExchangerWebsocketConnected &&
      this.props.exchangerSocketInfo.isExchangerWebsocketConnected !== prevProps.exchangerSocketInfo.isExchangerWebsocketConnected) {
      this.sendWebsocketMessage(null, null, prevProps.params);
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
    ExchangerWebsocket.sendMessage(id || DEFAULT_QUOTE_LOC_ID, method || DEFAULT_QUOTE_LOC_METHOD, params);
  }

  redirectToHotelDetailsPage() {
    NotificationManager.warning(this.props.quoteLocError, '', LONG);
    this.props.redirectToHotelDetailsPage();
  }

  render() {
    const { brackets, locAmount, quoteLocError, isUserLogged, params } = this.props;

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
  isUserLogged: PropTypes.bool,
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
    isUserLogged: isLogged(userInfo),
    exchangerSocketInfo,
    locAmount,
    quoteLocError
  };
}

export default connect(mapStateToProps)(QuoteLocPricePP);