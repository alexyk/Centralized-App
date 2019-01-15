import React from "react";
import {
  render,
  fireEvent,
  cleanup,
  waitForElement
} from "react-testing-library";
import StreetField from "./StreetField";

afterEach(cleanup);

// StreetField

// What does it do?

// 1. Displays initial value correctly
// - and loads the map with it

// 2. On input change
// - displays the value correctly
// - notifies the parent component of the change
// - tries to load a map for the address

// 3. When the selected country changes, the field resets to its defaults

describe("StreetField", () => {
  let initialStreetValue, getByTestId;
  beforeEach(function() {
    let mockedGoogleClient = {
      getLocationOfAddress: jest.fn((address, countryCode) => ({
        lat: 10,
        lng: 20
      })),
      getLocationForStreetPlaceId: jest.fn(placeId => ({ lat: 10, lng: 20 }))
    };

    const mockedLocationPicker = jest.fn(() => (
      <div data-testid="location-picker" />
    ));

    initialStreetValue = "Some Street Address";
    const { getByTestId: _getByTestId } = render(
      <StreetField
        LocationPicker={mockedLocationPicker}
        googleClient={mockedGoogleClient}
        initialStreetValue={initialStreetValue}
      />
    );
    getByTestId = _getByTestId;
  });

  test("Displays initial value correctly", async () => {
    let node = await waitForElement(() => getByTestId("street-address-input"));
    expect(node.innerHTML).toBe(initialStreetValue);
  });
  describe("On input change", () => {
    test("displays the value correctly", async () => {});
    test("notifies the parent component of the change", async () => {});
    test("tries to load a map for the address", async () => {});
  });
  test("When the selected country changes, the field resets to its defaults", () => {});
});
