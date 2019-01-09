import React from "react";

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

jest.doMock("react-redux", () => {
  const connect = () =>
    function(mapStateToProps, mapDispatchToPros) {
      return function(Test) {
        return props => <div>asdasds</div>;
      };
    };
  return { connect };
});

const mocks = {
  requester: jest.fn(),
  NotificationManager: jest.fn(),
  EnterEmailVerificationTokenModal: jest.fn(),
  EmailVerificationModal: jest.fn(),
  UpdateCountryModal: jest.fn(),
  openModal: jest.fn()
};

export default mocks;

jest.doMock("../../requester", () => {
  return jest.fn();
});
