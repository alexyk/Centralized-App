import React from "react";

// LoginManager
const LoginManager = jest.fn(() => {
  return <div data-testid="login-manager" />;
});

jest.doMock("../authentication/LoginManager", () => {
  return LoginManager;
});
export default LoginManager;

// MainNave
const MainNave = jest.fn(() => {
  return <div data-testid="main-nav" />;
});

jest.doMock("../mainNav/MainNav", () => {
  return MainNave;
});

// LocalizationNav
const LocalizationNav = jest.fn(() => {
  return <div data-testid="main-nav" />;
});
jest.doMock("../profile/LocalizationNav", () => {
  return LocalizationNav;
});
