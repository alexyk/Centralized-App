import { userInfo } from '../actions/actionTypes';

const initialState = {
  isLogged: false,
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
  locAddress: '',
  locBalance: 0,
  ethBalance: 0,
  gender: '',
  isEmailVerified: false,
  isAdmin: false
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
        gender: action.isLogged ? state.gender : null,
        isEmailVerified: action.isEmailVerified ? state.isEmailVerified : null,
        isAdmin: action.isAdmin ? state.isAdmin : false
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
        gender: action.gender,
        isEmailVerified: action.isEmailVerified,
        isAdmin: action.isAdmin
      };
    default:
      return state;
  }
}
