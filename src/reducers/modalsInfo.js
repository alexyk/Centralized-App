import { modalsInfo } from '../actions/actionTypes';

const initialState = {
  modals: new Map(),
};

export default function reducer(state = initialState, action) {

  console.log(state);
  console.log("Action.type");
  console.log(action.type);
  console.log("Action.modal");
  console.log(action.modal);

  switch (action.type) {
    case modalsInfo.SET_SHOW_LOGIN:
      return {
        ...state,
        showLogin: action.showLogin,
      };
    case modalsInfo.OPEN_MODAL:
      return {
        ...state,
        modals: new Map(state.modals.set(action.modal, true))
      };
    case modalsInfo.CLOSE_MODAL:
      return {
        ...state,
        modals: new Map(state.modals.set(action.modal, false))
      };
    default:
      return state;
  }
}
