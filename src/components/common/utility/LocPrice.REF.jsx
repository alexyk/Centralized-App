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

/**
 * Helpers
 */
function endTheConnectionForThisAmount(fiatInEur){
  ExchangerWebsocket.sendMessage(fiatInEur, "unsubscribe", );
}
function openAConnectionForThisAmount(fiatInEur){
  ExchangerWebsocket.sendMessage(fiatInEur, null, { fiatAmount: fiatInEur });
}
/**\
 * Behavior
 * --------
 * How is loc price calculated?
 * - from a fiat price
 * - from the currency exchange rates (always in EURO?)
 * - with the Converter - from EUR or USD - always to EUR
 */

type Props = {
  currencyExchangeRates: Object,
  fiat: number,
  isExchangerWebsocketConnected: boolean,
  dispatch: Function
}

/**
 * Makes Calls To:
 */
// 1. local storage
// -------------

// 2. web socket
// ----------
// - sends fiat amount in EUR
// - unsubscribes with a message

// 3. redux
// -----

/**
 * Imports
 */
// 1. CurrencyConverter
// -----------------
// 2. removeLocAmount - action creator
// --------------------------------
// 3. ExchangerWebsocket
// ------------------

/**
 * 1. Initially the component receive a fiat amount and a fiat currency
 * - by default the initial fiat currency is the result of RoomsXMLCurrency.get()
 * 2. The input price is converted to EUR
 */


class LocPrice extends PureComponent {
  /**
   * Hooks
   */
  componentDidMount(){
    this.props.convertFromUserCurrencyToEurAndSendToServer(this.props.fiat);
  }
  componentDidUpdate(prevProps) {
    if (this.props.isExchangerWebsocketConnected && !prevProps.isExchangerWebsocketConnected) {
      this.props.convertFromUserCurrencyToEurAndSendToServer(this.props.fiat);
    }
  }
  componentWillUnmount() {
    this.props.endConnectionForThisAmountAndClearStoredLocAmount(this.state.fiatInEur);
  }

  render() {
    if (!this.props.isUserLogged) return null;
    const bracket = this.props.brackets && this.props.isUserLogged;
    return (
      <span>{bracket && '('}LOC {this.props.locAmount && this.props.locAmount}{bracket && ')'}</span>
    );
  }
}

LocPrice.defaultProps = {
  brackets: true
};

LocPrice.propTypes = {
  fiat: PropTypes.number,
  brackets: PropTypes.bool,

  // Redux props
  dispatch: PropTypes.func,
  locAmount: PropTypes.string,
  isUserLogged: PropTypes.bool,
  isExchangerWebsocketConnected: PropTypes.bool
};

function mapStateToProps(state, ownProps) {
  let currencyExchangeRates = getCurrencyExchangeRates(state.exchangeRatesInfo);
  /**
   * From default currency - to EUR
   */
  let currentPriceInEur = CurrencyConverter.convert({
    inputFiatAmount: ownProps.fiat,
    inputFiatCurrency:  RoomsXMLCurrency.get(),
    outputFiatCurrency: "EUR",
    fiatExchangeRates: currencyExchangeRates,
  });

  /**
   * From user's currency - to EUR
   */
  function convertPriceFromUsersCurrencyToEur(price){
    return CurrencyConverter.convert({
      // inputFiatAmount: ownProps.fiat,
      inputFiatAmount: price,
      inputFiatCurrency:  localStorage.getItem('currency'),
      outputFiatCurrency: "EUR",
      fiatExchangeRates: currencyExchangeRates,
    })
  }

  /**
   * Retrieve Loc Amount From Storage Or Calculate It
   */
  let storedLocAmount = getLocAmountById(state, currentPriceInEur);
  let calculatedLocAmount = currentPriceInEur / getLocEurRate(state.exchangeRatesInfo);
  let locAmount =  storedLocAmount || calculatedLocAmount;

  return {
    /**
     * Data
     */
    locAmount: locAmount,
    isUserLogged: isLogged(state.userInfo),
    /**
     * Logic
    */
    isExchangerWebsocketConnected: isExchangerWebsocketConnected(state.exchangerSocketInfo),
    convertFromUserCurrencyToEurAndSendToServer(fiat){
      let fiatInEur = convertPriceFromUsersCurrencyToEur(fiat);
      openAConnectionForThisAmount(fiatInEur);
    },
  };
}

function mapDispatchToProps(dispatch){
  function clearStoredLocAmount(fiatInEur){
    return dispatch(
      removeLocAmount(
        fiatInEur
      )
    );
  }

  return {
    endConnectionForThisAmountAndClearStoredLocAmount(fiatInEur){
      endTheConnectionForThisAmount(fiatInEur);
      clearStoredLocAmount(fiatInEur);
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LocPrice);
