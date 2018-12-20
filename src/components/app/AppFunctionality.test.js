import "babel-polyfill";
import { render } from "react-testing-library";
let mockedReferralIdPersistence = jest.doMock(
  "../profile/affiliates/service/persist-referral-id",
  () => {
    return {
      tryToSetFromSearch: jest.fn(() => {})
    };
  }
);
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

test("calls default referralIdPersister with the refId", () => {
  shallow(
    <AppFunctionality
      requestCountries={() => {}}
      requestExchangeRates={() => {}}
      requestLocEurRate={() => {}}
      initCalendar={() => {}}
      location={{ search: "whatever?refId=123" }}
    />
  );
  console.log("mockedReferralIdPersistence", mockedReferralIdPersistence);
  expect(mockedReferralIdPersistence.tryToSetFromSearch).toHaveBeenCalledWith(
    "whatever?refId=123"
  );
});
