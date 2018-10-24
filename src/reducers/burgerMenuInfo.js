import { burgerMenuInfo } from '../actions/actionTypes';

const initialState = {
  showMenu: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case burgerMenuInfo.SET_SHOW_MENU:
      return {
        showMenu: action.showMenu
      };
    default:
      return state;
  }
}