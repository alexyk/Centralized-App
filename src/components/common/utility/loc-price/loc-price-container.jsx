import React from "react";
import { connect } from "react-redux";
import { ExchangerWebsocket } from "../../../../services/socket/exchangerWebsocket";
import { removeLocAmount } from "../../../../actions/locAmountsInfo";
import { isLogged } from "../../../../selectors/userInfo";
import { getLocAmountById as getStoredLocAmountForPriceInEur } from "../../../../selectors/locAmountsInfo";
import {
  getCurrencyExchangeRates,
  getLocEurRate
} from "../../../../selectors/exchangeRatesInfo";
import { isExchangerWebsocketConnected } from "../../../../selectors/exchangerSocketInfo";
import evaluateLocAndEuroAmounts from "./evaluate-loc-and-euro-amounts";
import _LocPriceComponent from "./loc-price-visualization-component";
/**
 * Behavior
 * --------
 * 1. Initially the component receive a fiat amount and a fiat currency
 * - by default the initial fiat currency is the result of RoomsXMLCurrency.get()
 * 2. The input price is converted to EUR
 */

type LocPriceProps = {
  fiatInEur: number,
  isExchangerWebsocketConnected: boolean,
  openAConnectionThisAmountInEuro: Function,
  endConnectionForCurrentAmountInEuroAndClearStoredLocAmount: Function,
  brackets: boolean
};

/**
 * Main Export
 */
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(_LocPriceComponent);

/**
 * Redux Connection
 */
function mapStateToProps(state, ownProps) {
  let { locAmount, fiatAmountInEur } = evaluateLocAndEuroAmounts({
    inputFiatAmount: ownProps.fiat,
    inputFiatCurrency: ownProps.inputCurrency,
    currencyExchangeRates: getCurrencyExchangeRates(state.exchangeRatesInfo),
    locEurRate: getLocEurRate(state.exchangeRatesInfo),
    getCachedLocEurRateForAmount: amountInEur =>
      getStoredLocAmountForPriceInEur(state, amountInEur)
  });

  return {
    locAmount: locAmount,
    fiatInEur: fiatAmountInEur,
    isUserLogged: isLogged(state.userInfo),
    isExchangerWebsocketConnected: isExchangerWebsocketConnected(
      state.exchangerSocketInfo
    )
  };
}

function mapDispatchToProps(dispatch) {
  return {
    openAConnectionForThisAmountInEuro,
    endConnectionForCurrentAmountInEuroAndClearStoredLocAmount(fiatInEur) {
      // websocket-related
      endTheConnectionForThisAmountInEuro(fiatInEur);
      // redux-related
      dispatch(removeLocAmount(fiatInEur));
    }
  };
}

/**
 * Helpers
 */
function endTheConnectionForThisAmountInEuro(fiatInEur) {
  ExchangerWebsocket.sendMessage(fiatInEur, "unsubscribe");
}
function openAConnectionForThisAmountInEuro(fiatInEur) {
  ExchangerWebsocket.sendMessage(fiatInEur, null, { fiatAmount: fiatInEur });
}
