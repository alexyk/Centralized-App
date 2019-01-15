import React from "react";

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

jest.doMock("react-slick", () => {
  const ComponentToMock = () => <div />;
  return ComponentToMock;
});
jest.doMock("react-redux", () => {
  const connect = () =>
    function(mapStateToProps, mapDispatchToPros) {
      return function(Test) {
        return props => <div>asdasds</div>;
      };
    };
  return { connect };
});

global.WebSocket = class WebSocket {};

const mocks = {
  MainNav: jest.fn(() => <div />),
  LocalizationNav: jest.fn(() => <div />),
  LoginManager: jest.fn(() => <div data-testid="login-manager" />),
  RegisterManager: jest.fn(() => <div />),
  WalletCreationManager: jest.fn(() => <div />),
  PasswordRecoveryManager: jest.fn(() => <div />),
  NotificationContainer: jest.fn(() => <div />),
  HomeRouterPage: jest.fn(() => <div />),
  AffiliateTerms: jest.fn(() => <div />),
  EditListingPage: jest.fn(() => <div />),
  CreateListingPage: jest.fn(() => <div />),
  ProfilePage: jest.fn(() => <div />),
  WorldKuCoinCampaign: jest.fn(() => <div />),
  Balance: jest.fn(() => <div />),
  GooglePlaces: jest.fn(() => <div />),
  HelpPage: jest.fn(() => <div />),
  AboutUsPage: jest.fn(() => <div />),
  Footer: jest.fn(() => <div />)
};

jest.doMock("./app-defaults", () => {
  return mocks;
});
export default mocks;
