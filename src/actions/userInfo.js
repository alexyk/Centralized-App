import { userInfo } from "./actionTypes";

export function logOut() {
  return {
    type: userInfo.LOG_OUT
  };
}

// type UserUnfoAction = {
//   firstName,
//   lastName,
//   phoneNumber,
//   email,
//   locAddress,
//   ethBalance,
//   locBalance,
//   gender,
//   isEmailVerified,
//   isAdmin
// }

export function setUserInfo(opts) {
  return {
    type: userInfo.SET_USER_INFO,
    ...opts
  };
}
