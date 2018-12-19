import { locAmountsInfo } from "./actionTypes";

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
