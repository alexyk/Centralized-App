import React from "react";
import { connect } from "react-redux";
import { removeLocAmount, thunk_getLocAmountFor } from "../../../../actions/locAmountsInfo";
import { isLogged } from "../../../../selectors/userInfo";
import { getLocAmountById as getStoredLocAmountForPriceInEur } from "../../../../selectors/locAmountsInfo";
import { getCurrencyExchangeRates } from "../../../../selectors/exchangeRatesInfo";
import evaluateLocAndEuroAmounts from "./evaluate-loc-and-euro-amounts";
import _LocPriceComponent from "./loc-price-visualization-component";

/**
 * Behavior
 * --------
 * 1. Initially the component receive a fiat amount and a fiat currency
 * - by default the initial fiat currency is the result of RoomsXMLCurrency.get()
 * 2. The input price is converted to EUR
 * 3. The EUR price is sent to the server for conversion
 * 4. The returned loc amount value is set in the store
 * 5. The component is re-rendered with the new loc amount value
 */

type LocPriceProps = {
  fiat: number,
  inputCurrency: "EUR" | "GBP" | "USD"
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
  let commonProps = {
    isUserLogged: isLogged(state.userInfo)
  };

  let  currencyExchangeRates = getCurrencyExchangeRates(state.exchangeRatesInfo);
  if(currencyExchangeRates){
    let { locAmount, fiatAmountInEur } = evaluateLocAndEuroAmounts({
      inputFiatAmount: ownProps.fiat,
      inputFiatCurrency: ownProps.inputCurrency,
      currencyExchangeRates: currencyExchangeRates,
      getCachedLocEurRateForAmount: amountInEur =>
        getStoredLocAmountForPriceInEur(state.locAmountsInfo, amountInEur)
    });

    return {
      locAmount: locAmount,
      fiatInEur: fiatAmountInEur,
     ...commonProps
    };
  } else {
    return {
      locAmount: null,
      fiatInEur: null,
      ...commonProps
    };
  }
}

function mapDispatchToProps(dispatch) {
  return {
    requestLocPriceForThisAmountInEur(amountInEur){
      return dispatch(thunk_getLocAmountFor(amountInEur, "EUR"))
    },
    endRequestForLocPriceOfThisAmountOfEur(fiatInEur) {
      return dispatch(removeLocAmount(fiatInEur));
    }
  };
}
