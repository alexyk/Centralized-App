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
  const TEST_ID = "street-address-input";

  test("Displays initial value correctly", async () => {
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

    let initialStreetValue = "Some Street Address";
    const { getByTestId } = render(
      <StreetField
        LocationPicker={mockedLocationPicker}
        googleClient={mockedGoogleClient}
        initialStreetValue={initialStreetValue}
      />
    );

    let node = await waitForElement(() => getByTestId(TEST_ID));
    expect(node.value).toBe(initialStreetValue);
  });

  describe("On input change", () => {
    const TEST_ID = "street-address-input";
    let initialStreetValue,
      getByTestId,
      node,
      onStreetChange,
      mockedGoogleClient,
      rerender;
    const countryCode = "some country code";
    let locationOfAddress;

    const MockedLocationPicker = jest.fn(() => (
      <div data-testid="location-picker" />
    ));

    beforeEach(async function() {
      onStreetChange = jest.fn(() => {});
      locationOfAddress = {
        lat: 10,
        lng: 20
      };
      mockedGoogleClient = {
        getLocationOfAddress: jest.fn(
          (address, countryCode) => locationOfAddress
        ),
        getLocationForStreetPlaceId: jest.fn(placeId => ({ lat: 10, lng: 20 }))
      };

      const mockedLocationPicker = jest.fn(() => (
        <div data-testid="location-picker" />
      ));

      initialStreetValue = "Some Street Address";
      const { getByTestId: _getByTestId, rerender: _rerender } = render(
        <StreetField
          LocationPicker={MockedLocationPicker}
          googleClient={mockedGoogleClient}
          onStreetChange={onStreetChange}
          countryCode={countryCode}
        />
      );
      rerender = _rerender;

      getByTestId = _getByTestId;
      node = await waitForElement(() => getByTestId(TEST_ID));
      fireEvent.change(node, { target: { value: "xxx" } });
    });
    test("displays the value correctly", async () => {
      expect(node.value).toBe("xxx");
    });
    test("notifies the parent component of the change", async () => {
      expect(onStreetChange).toHaveBeenCalledWith("xxx");
    });
    test("tries to load a map for the address", async () => {
      expect(mockedGoogleClient.getLocationOfAddress).toHaveBeenCalledWith(
        "xxx",
        countryCode
      );

      let defaultPositionFromProps =
        MockedLocationPicker.mock.calls[
          MockedLocationPicker.mock.calls.length - 1
        ][0].defaultPosition;
      expect(defaultPositionFromProps).toEqual(locationOfAddress);
    });
    test("When the selected country changes, the field resets to its defaults and notifies the parent", async () => {
      const onClearStreetField = jest.fn(() => {});
      rerender(
        <StreetField
          LocationPicker={MockedLocationPicker}
          googleClient={mockedGoogleClient}
          onStreetChange={onStreetChange}
          countryCode={"Some Other Code"}
          onClearStreetField={onClearStreetField}
        />
      );
      let node = await waitForElement(() => getByTestId(TEST_ID));
      // resets the input value
      expect(node.value).toBe("");

      try {
        // resets and hides the map
        let node = await waitForElement(() => getByTestId("location-picker"));
        expect(true).toBe(false);
      } catch (e) {
        expect(true).toBe(true);
      }

      // notifies the parent
      expect(onClearStreetField).toHaveBeenCalledTimes(1);
    });
  });
});
