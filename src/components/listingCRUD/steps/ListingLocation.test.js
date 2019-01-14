import {
  render,
  fireEvent,
  cleanup,
  waitForElement
} from "react-testing-library";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import "./ListingLocation.test.mocks";
import { shallow, mount } from "enzyme";
import { ListingLocation } from "./ListingLocation";

afterEach(cleanup);

const minimalProps = {
  values: {
    street: ""
  },
  routes: {
    placetype: "",
    accommodation: "",
    facilities: "",
    safetyamenities: "",
    location: ""
  },
  location: {
    pathname: ""
  },
  onChange() {}
};

describe("ListingLocation", () => {
  describe("Street Address", () => {
    describe("On typing", () => {
      test("Updates the field correctly", async () => {
        // mock the shitty react-select compoonent
      });

      test("sends a request to Autocomplete", () => {});

      test("displays the options", () => {});
    });
    describe("On 'option selected'", () => {
      test("updates the state", () => {});

      test("the fields render correctly with the new state", () => {});

      test("the map shows up", () => {});
    });
  });

  describe("simple fields update the state and render correctly", () => {
    test("Country/Region", () => {});

    test("City", () => {});

    test("State", () => {});
  });

  describe("Next button - on click", () => {
    test("it adapts the state for the request correctly and makes the request", () => {});
  });

  test(`displays`, async () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <ListingLocation {...minimalProps} />
      </BrowserRouter>
    );

    // let node = await waitForElement(() => getByTestId(TEST_ID));
    // let displayedValue = node.innerHTML;
    // expect(displayedValue).toBe(value + "");
  });
});
