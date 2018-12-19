import { userInfo } from "../actions/actionTypes";

const initialState = {
  id: null,
  isLogged: false,
  firstName: "",
  lastName: "",
  phoneNumber: "",
  email: "",
  locAddress: "",
  locBalance: 0,
  ethBalance: 0,
  gender: "",
  isEmailVerified: false,
  isAdmin: false
};

export default function reducer(state = initialState, action) {
  function getOr(prop) {
    return action[prop] || state[prop];
  }
  switch (action.type) {
    case userInfo.LOG_OUT:
      return {
        ...initialState
      };
    case userInfo.SET_USER_INFO: {
      return {
        ...state,
        isLogged: true,
        id: getOr("id"),
        firstName: getOr("firstName"),
        lastName: getOr("lastName"),
        phoneNumber: getOr("phoneNumber"),
        email: getOr("email"),
        locAddress: getOr("locAddress"),
        locBalance: getOr("locBalance"),
        ethBalance: getOr("ethBalance"),
        gender: getOr("gender"),
        isEmailVerified: getOr("isEmailVerified"),
        isAdmin: getOr("isAdmin")
      };
    }
    default:
      return state;
  }
}

export const selectors = {
  getUserId(state) {
    return state.id;
  }
};
