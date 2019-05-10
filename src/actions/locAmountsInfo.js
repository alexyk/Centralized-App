import { locAmountsInfo } from "./actionTypes";
import sa from "superagent";
import { Config } from "../config";

export function updateLocAmounts(fiatAmount, params, error) {
  return {
    type: locAmountsInfo.UPDATE_LOC_AMOUNTS,
    fiatAmount,
    params,
    error
  };
}

export function removeLocAmount(fiatAmount) {
  return {
    type: locAmountsInfo.REMOVE_LOC_AMOUNT,
    fiatAmount
  };
}

export function clearLocAmounts() {
  return {
    type: locAmountsInfo.CLEAR_LOC_AMOUNTS
  };
}

export function thunk_getLocAmountFor(fiatAmount, fiatCurrency) {
  return dispatch => {
    sa.get(
      `${Config.getValue(
        "apiHost"
      )}/convert?amount=${fiatAmount}&currency=${fiatCurrency}`
    )
      .set(
        "Authorization",
        localStorage[Config.getValue("domainPrefix") + ".auth.locktrip"]
      )
      .then(response => {
        let locAmount = response.body;
        let error = undefined;
        dispatch(updateLocAmounts(fiatAmount, { locAmount }, error));
      });
  };
}
