import { render } from "react-testing-library";
import { shallow } from "enzyme";
jest.mock("../../requester", () => {
  return jest.fn(() => 42);
});
import App from "./App";
import React from "react";

test("", () => {
  const wrapper = shallow(<App />);
  expect(1).toBe(2);
});
