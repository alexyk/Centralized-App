import { userInfo } from '../actions/actionTypes';

const initialState = {
  isLogged: false,
  // showLogin: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case userInfo.SET_IS_LOGGED:
      return {
        ...state,
        isLogged: action.isLogged,
        firstName: action.isLogged ? state.firstName : null,
        lastName: action.isLogged ? state.lastName : null,
        phoneNumber: action.isLogged ? state.phoneNumber : null,
        email: action.isLogged ? state.email : null,
        locAddress: action.isLogged ? state.locAddress : null,
        locBalance: action.isLogged ? state.locBalance : null,
        ethBalance: action.isLogged ? state.ethBalance : null,
        gender: action.isLogged ? state.gender : null
      };
    case userInfo.SET_USER_INFO:
      return {
        ...state,
        firstName: action.firstName,
        lastName: action.lastName,
        phoneNumber: action.phoneNumber,
        email: action.email,
        locAddress: action.locAddress,
        locBalance: action.locBalance,
        ethBalance: action.ethBalance,
        gender: action.gender
      };
    default:
      return state;
  }
}