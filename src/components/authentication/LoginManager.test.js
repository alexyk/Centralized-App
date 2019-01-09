import React from "react";
import "./login-manager-mocks";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import {
  render,
  fireEvent,
  cleanup,
  waitForElement
} from "react-testing-library";
import { LoginManager } from "./LoginManager";

afterEach(cleanup);

describe("LoginManager", () => {
  describe("it invokes the openModal function with the right arguments on component mounting", () => {
    test("when the prop is passed - openRecoveryOnMount", async () => {
      const openRecoveryEmailModal = jest.fn();
      const { getByTestId } = render(
        <BrowserRouter>
          <LoginManager
            openRecoveryOnMount={true}
            openRecoveryEmailModal={openRecoveryEmailModal}
            isActive={{}}
            location={{ pathname: "" }}
          />
        </BrowserRouter>
      );

      expect(openRecoveryEmailModal).toHaveBeenCalledWith();
    });

    test("does not open when the prop is FALSE - openRecoveryOnMount", async () => {
      const openRecoveryEmailModal = jest.fn();

      const { getByTestId } = render(
        <BrowserRouter>
          <LoginManager
            openRecoveryOnMount={false}
            openRecoveryEmailModal={openRecoveryEmailModal}
            isActive={{}}
            location={{ pathname: "" }}
          />
        </BrowserRouter>
      );

      expect(openRecoveryEmailModal).not.toHaveBeenCalledWith();
    });

    test("does not open  when the prop is NOT passed - openRecoveryOnMount", async () => {
      const openRecoveryEmailModal = jest.fn();

      const { getByTestId } = render(
        <BrowserRouter>
          <LoginManager
            openRecoveryEmailModal={openRecoveryEmailModal}
            isActive={{}}
            location={{ pathname: "" }}
          />
        </BrowserRouter>
      );

      expect(openRecoveryEmailModal).not.toHaveBeenCalledWith();
    });
  });
});
