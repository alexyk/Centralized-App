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
