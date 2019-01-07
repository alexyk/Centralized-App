import "babel-polyfill";

import { shallow } from "enzyme";

import AppFunctionality from "./AppFunctionality.REF";
import React from "react";

test("calls referralIdPersister with the refId", () => {
  let mockedRefIdPersister = jest.fn();
  shallow(
    <AppFunctionality
      persistReferralId={mockedRefIdPersister}
      requestCountries={() => {}}
      requestExchangeRates={() => {}}
      requestLocEurRate={() => {}}
      initCalendar={() => {}}
      location={{ search: "whatever?refId=123" }}
    />
  );
  expect(mockedRefIdPersister).toHaveBeenCalledWith("whatever?refId=123");
});
