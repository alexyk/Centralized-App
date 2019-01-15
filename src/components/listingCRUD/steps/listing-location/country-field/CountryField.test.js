import React from "react";
import {
  render,
  fireEvent,
  cleanup,
  waitForElement
} from "react-testing-library";

import CountryField from "./CountryField";

afterEach(cleanup);

// CountryField
// What does it do?

// 1. Loads the initial value passed from props correctly
// 2. Loads options on input change correctly
// - calls googleClient.fetchPredictedCountriesForInput correctly
// - adapts the result correctly and returns it
// 3. On selecting a new option, displays it correctly and notifies the parent of the change
describe("CountryField", () => {
  const TEST_ID = "mocked-select-component";
  test("Loads the initial value passed from props correctly", async () => {
    let mockedGoogleClient = {
      fetchPredictedCountriesForInput: jest.fn(input => {
        return [
          { place_id: "id1", description: "description 1" },
          { place_id: "id2", description: "description 2" }
        ];
      }),
      getCountryCodeAndCountryNameForPlaceId: jest.fn(placeId =>
        Promise.resolve({
          countryCode: "some code",
          countryName: "Some Country"
        })
      )
    };

    const SelectComponent = props => (
      <div data-testid={TEST_ID}>{(props.value || {}).label}</div>
    );

    const { getByTestId } = render(
      <CountryField
        googleClient={mockedGoogleClient}
        initialCountryValue={{
          countryName: "Test Country"
        }}
        SelectComponent={SelectComponent}
      />
    );

    let node = await waitForElement(() => getByTestId(TEST_ID));
    expect(node.innerHTML).toBe("Test Country");
  });
  describe("Loads options on input change correctly", () => {
    let mockedGoogleClient, cb, input;
    beforeEach(async function() {
      mockedGoogleClient = {
        fetchPredictedCountriesForInput: jest.fn(input => {
          return [
            { place_id: "id1", description: "description 1" },
            { place_id: "id2", description: "description 2" }
          ];
        }),
        getCountryCodeAndCountryNameForPlaceId: jest.fn(placeId =>
          Promise.resolve({
            countryCode: "some code",
            countryName: "Some Country"
          })
        )
      };

      cb = jest.fn();
      input = "some test value";
      const SelectComponent = props => (
        <div data-testid={TEST_ID} onClick={() => props.loadOptions(input, cb)}>
          {(props.value || {}).label}
        </div>
      );

      const { getByTestId } = render(
        <CountryField
          googleClient={mockedGoogleClient}
          initialCountryValue={{
            countryName: "Test Country"
          }}
          SelectComponent={SelectComponent}
        />
      );

      let node = await waitForElement(() => getByTestId(TEST_ID));
      fireEvent.click(node, {});
    });

    test("calls googleClient.fetchPredictedCountriesForInput correctly", async () => {
      expect(
        mockedGoogleClient.fetchPredictedCountriesForInput
      ).toHaveBeenCalledWith(input);
    });
    test("adapts the result correctly and returns it", async () => {
      expect(cb).toHaveBeenCalledWith([
        { value: "id1", label: "description 1" },
        { value: "id2", label: "description 2" }
      ]);
    });
  });
  describe("On selecting a new option, displays it correctly and notifies the parent of the change", () => {
    let mockedGoogleClient, getByTestId, onCountrySelected;
    const selectedOption = {
      value: "some place id",
      label: "Some Country Name"
    };
    let resolvedCountryDetailsFromGoogle;
    const SelectComponent = props => (
      <div data-testid={TEST_ID} onClick={() => props.onChange(selectedOption)}>
        {(props.value || {}).label}
      </div>
    );

    beforeEach(async function() {
      onCountrySelected = jest.fn(() => {});
      resolvedCountryDetailsFromGoogle = {
        countryCode: "some code",
        countryName: "Some Country"
      };
      mockedGoogleClient = {
        fetchPredictedCountriesForInput: jest.fn(input => {
          return [
            { place_id: "id1", description: "description 1" },
            { place_id: "id2", description: "description 2" }
          ];
        }),
        getCountryCodeAndCountryNameForPlaceId: jest.fn(placeId =>
          Promise.resolve(resolvedCountryDetailsFromGoogle)
        )
      };
      const { getByTestId: _getByTestId } = render(
        <CountryField
          googleClient={mockedGoogleClient}
          initialCountryValue={{
            countryName: "Test Country"
          }}
          onCountrySelected={onCountrySelected}
          SelectComponent={SelectComponent}
        />
      );
      getByTestId = _getByTestId;

      let node = await waitForElement(() => getByTestId(TEST_ID));
      fireEvent.click(node, {});
    });

    test("calls googleClient.getCountryCodeAndCountryNameForPlaceId correctly", () => {
      expect(
        mockedGoogleClient.getCountryCodeAndCountryNameForPlaceId
      ).toHaveBeenCalledWith(selectedOption.value);
    });
    test("displays the new option correctly", async () => {
      let node = await waitForElement(() => getByTestId(TEST_ID));
      expect(node.innerHTML).toBe(selectedOption.label);
    });
    test("notifies the parent component - calls props.onCountrySelected with the result from googleClient.getCountryCodeAndCountryNameForPlaceId", () => {
      expect(onCountrySelected).toHaveBeenCalledWith({
        countryCode: resolvedCountryDetailsFromGoogle.countryCode,
        countryName: resolvedCountryDetailsFromGoogle.countryName
      });
    });
  });
});
