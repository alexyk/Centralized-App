import { locAmountsInfo } from '../actions/actionTypes';

const initialState = {
  locAmounts: {}
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case locAmountsInfo.UPDATE_LOC_AMOUNTS:
      if (action.params && action.params.quotedLoc) {
        return {
          ...state,
          locAmounts: {
            ...state.locAmounts,
            [action.fiatAmount]: {
              locAmount: action.params.locAmount,
              quotedLoc: action.params.quotedLoc,
              quotedPair: action.params.quotedPair,
              roundedLocInEur: action.params.roundedLocInEur
            }
          }
        };
      }
      return {
        ...state,
        locAmounts: {
          ...state.locAmounts,
          [action.fiatAmount]: {
            locAmount: action.params.locAmount
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