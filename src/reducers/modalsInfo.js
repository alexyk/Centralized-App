import { modalsInfo } from '../actions/actionTypes';

const initialState = {
  isActive: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case modalsInfo.OPEN_MODAL:
      return {
        isActive: { ...state.isActive, [action.payload]: true }
      };
    case modalsInfo.CLOSE_MODAL:
      return {
        isActive: { ...state.isActive, [action.payload]: true }
      };
    default:
      return state;
  }
}
