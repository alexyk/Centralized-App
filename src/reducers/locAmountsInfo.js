import { locAmountsInfo } from '../actions/actionTypes';

const initialState = {
  locAmounts: {}
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case locAmountsInfo.UPDATE_LOC_AMOUNTS:
      if (action.locAmount.quotedLoc) {
        return {
          ...state,
          locAmounts: {
            ...state.locAmounts,
            [action.fiatAmount]: {
              locAmount: action.locAmount.locAmount,
              quotedLoc: action.locAmount.quotedLoc,
              quotedPair: action.locAmount.quotedPair,
              roundedLocInEur: action.locAmount.roundedLocInEur
            }
          }
        };
      }
      return {
        ...state,
        locAmounts: {
          ...state.locAmounts,
          [action.fiatAmount]: {
            locAmount: action.locAmount
          }
        }
      };

    case locAmountsInfo.REMOVE_LOC_AMOUNT:
      delete state.locAmounts[action.fiatAmount];
      return {
        ...state,
        locAmounts: state.locAmounts
      };

    case locAmountsInfo.CLEAR_LOC_AMOUNTS:
      return {
        ...state,
        locAmounts: {}
      };

    default:
      return state;
  }
}