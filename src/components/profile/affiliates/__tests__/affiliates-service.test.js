import React from "react";
import {
  render,
  fireEvent,
  cleanup,
  waitForElement
} from "react-testing-library";

import referralIdPersister from "../service/persist-referral-id";
import { mockedRequests } from "../service/affiliates-rest-client-mocks";
import { AffiliatesServiceClass } from "../service/affiliates-rest-client";

const AffiliateService = new AffiliatesServiceClass(mockedRequests);
afterEach(cleanup);

describe("services", () => {
  describe("rest client", () => {
    test("", async () => {});
  });
  describe("local storage - referral id", () => {
    test("", async () => {});
  });
});
