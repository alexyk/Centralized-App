import React from "react";

const LoginManager = jest.fn(() => {
  return <div data-testid="login-manager" />;
});

jest.doMock("../authentication/LoginManager", () => {
  return LoginManager;
});
export default LoginManager;

const MainNave = jest.fn(() => {
  return <div data-testid="main-nav" />;
});

jest.doMock("../mainNav/MainNav", () => {
  return MainNave;
});

const LocalizationNav = jest.fn(() => {
  return <div data-testid="main-nav" />;
});
jest.doMock("../profile/LocalizationNav", () => {
  return LocalizationNav;
});
