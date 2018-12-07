import { locAmountsInfo } from '../actions/actionTypes';

const initialState = {
  locAmounts: {}
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case locAmountsInfo.UPDATE_LOC_AMOUNTS:
      if (action.params) {
        if (!state.locAmounts[action.fiatAmount] && validateLocAmountsUpdate(action.params, state.locAmounts[action.fiatAmount])) {
          console.log('update');
          return {
            ...state,
            locAmounts: {
              ...state.locAmounts,
              [action.fiatAmount]: {
                locAmount: action.params.locAmount,
                fundsSufficient: action.params.fundsSufficient,
                fiatAmount: action.params.fiatAmount
              }
            }
          };
        }
        console.log('not update');
        return state;
      } else if (action.error) {
        return {
          ...state,
          locAmounts: {
            ...state.locAmounts,
            [action.fiatAmount]: {
              locAmount: null,
              error: action.error
            }
          }
        };
      }

      return state;

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

function validateLocAmountsUpdate(params, locAmountObject) {
  return locAmountObject.locAmount !== params.locAmount || locAmountObject.fundsSufficient !== params.fundsSufficient || locAmountObject.fiatAmount !== params.fiatAmount;
}