import { locAmountsInfo } from '../actions/actionTypes';

const initialState = {
  locAmounts: {}
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case locAmountsInfo.UPDATE_LOC_AMOUNTS:
      return {
        ...state,
        locAmounts: {
          ...state.locAmounts,
          [action.fiatAmount]: action.locAmount
        }
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