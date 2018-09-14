import { locAmountsInfo } from './actionTypes';

export function updateLocAmounts(fiatAmount, locAmount) {
  return {
    type: locAmountsInfo.UPDATE_LOC_AMOUNTS,
    fiatAmount,
    locAmount
  };
}

export function clearLocAmounts() {
  return {
    type: locAmountsInfo.CLEAR_LOC_AMOUNTS
  };
}