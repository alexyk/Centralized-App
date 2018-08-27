import { userInfo } from './actionTypes';

export function setIsLogged(isLogged) {
  return {
    type: userInfo.SET_IS_LOGGED,
    isLogged
  };
}

export function setUserInfo(firstName, lastName, phoneNumber, email, locAddress, ethBalance, locBalance, gender, isEmailVerified) {
  return {
    type: userInfo.SET_USER_INFO,
    firstName,
    lastName,
    phoneNumber,
    email,
    locAddress,
    ethBalance,
    locBalance,
    gender,
    isEmailVerified
  };
}

export function setIsEmailVerified(isEmailVerified) {
  return {
    type: userInfo.SET_IS_EMAIL_VERIFIED,
    isEmailVerified
  };
}