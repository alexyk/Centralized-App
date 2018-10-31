import { burgerMenuInfo } from './actionTypes';

export function setShowMenu(showMenu) {
  return {
    type: burgerMenuInfo.SET_SHOW_MENU,
    showMenu
  };
}