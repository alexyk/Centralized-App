import "babel-polyfill";
import React from "react";
import mocks from "./app-mocks";
import App from "./App.REF";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import {
  render,
  fireEvent,
  cleanup,
  waitForElement
} from "react-testing-library";
import { shallow } from "enzyme";

afterEach(cleanup);

test("calls referralIdPersister with the refId", () => {
  let mockedRefIdPersister = jest.fn();
  shallow(
    <App
      persistReferralId={mockedRefIdPersister}
      requestCountries={() => {}}
      requestExchangeRates={() => {}}
      requestLocEurRate={() => {}}
      initCalendar={() => {}}
      location={{ search: "whatever?refId=123", pathname: "" }}
    />
  );
  expect(mockedRefIdPersister).toHaveBeenCalledWith("whatever?refId=123");
});

test("Renders the LoginManager with the correct prop", async () => {
  let mockedRefIdPersister = jest.fn();
  const { getByTestId } = render(
    <MemoryRouter initialEntries={["/recover"]}>
      <App
        persistReferralId={mockedRefIdPersister}
        requestCountries={() => {}}
        requestExchangeRates={() => {}}
        requestLocEurRate={() => {}}
        initCalendar={() => {}}
        location={{ search: "", pathname: "/recover" }}
      />
    </MemoryRouter>
  );
  let node = await waitForElement(() => getByTestId("login-manager"));
  console.log(mocks.LoginManager.mock.calls);
  expect(mocks.LoginManager).toHaveBeenCalledWith(
    {
      openRecoveryOnMount: true
    },
    {}
  );
});
