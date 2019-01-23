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
import queryString from "query-string";

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

  // TODO: Move getQueryStringForMobile() implementation and test to a separate utils class
  test("getQueryStringForMobile - parses an url from mobile app", async () => {
    const url = "http://localhost:3000/homes/listings/?countryId=9&startDate=23/01/2019&endDate=24/01/2019&guests=2&priceMin=1&priceMax=5000&currency=EUR&authEmail=mallex@abv.bg&authToken=Bearer%20eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYWxsZXhAYWJ2LmJnIiwiZXhwIjoxNTQ4OTU0MDg1fQ.7_w1qE9iTfvDqqc8iUzvM3b_SjYq3eDm8TjKIZ9ZfsZpTPBiHcaYWnO4NTixd-RJd7okgApFSScyQZoKXOBcHw";
    const params = queryString.parse(url);
    const result = LoginManager.getQueryStringForMobile(params);

    expect(result).toBe(
        '?' +
        '&currency=EUR'+
        '&startDate=23/01/2019'+
        '&endDate=24/01/2019' +
        '&guests=2'
    );
  });
});
