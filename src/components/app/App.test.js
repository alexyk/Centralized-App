import "babel-polyfill";
import React from "react";
import "./global-mocks";
import MockedLoginManager from "./LoginManager-mock";
import App from "./App.REF";
import { BrowserRouter } from "react-router-dom";

import {
  render,
  fireEvent,
  cleanup,
  waitForElement
} from "react-testing-library";

afterEach(cleanup);

test("Renders the LoginManager with the correct prop", async () => {
  let mockedRefIdPersister = jest.fn();
  const { getByTestId } = render(
    <BrowserRouter>
      <App
        persistReferralId={mockedRefIdPersister}
        requestCountries={() => {}}
        requestExchangeRates={() => {}}
        requestLocEurRate={() => {}}
        initCalendar={() => {}}
        location={{ search: "whatever?refId=123", pathname: "" }}
      />
    </BrowserRouter>
  );
  let node = await waitForElement(() => getByTestId("login-manager"));
});
