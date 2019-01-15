import React from "react";
import {
  render,
  fireEvent,
  cleanup,
  waitForElement
} from "react-testing-library";
import Form from "./Form";

afterEach(cleanup);

// Form
// What does it do?
// 1. Keeps the countryCode in state to distribute it among the fields

const getLastCallArgs = mockedFn => {
  return mockedFn.mock.calls[mockedFn.mock.calls.length - 1][0];
};

describe("Form", () => {
  describe("sets country code to initial value correctly", () => {
    let mocks;
    beforeEach(async function() {
      const CountryField = jest.fn(() => <div />);
      const CityField = jest.fn(() => <div />);
      const StreetField = jest.fn(() => <div />);
      mocks = { CountryField, CityField, StreetField };
      const { getByTestId } = render(
        <Form initialCountryValue={{ countryCode: "SOME CODE" }} {...mocks} />
      );
    });
    test("city field", () => {
      expect(getLastCallArgs(mocks.CityField).countryCode).toEqual("SOME CODE");
    });
    test("street field", () => {
      expect(getLastCallArgs(mocks.StreetField).countryCode).toEqual(
        "SOME CODE"
      );
    });
    test("country field", () => {
      expect(
        getLastCallArgs(mocks.CountryField).initialCountryValue.countryCode
      ).toEqual("SOME CODE");
    });
  });

  describe("provides the country code to the fields correctly on change", () => {
    let mocks, onCountryChange;
    const selectedCountry = { countryCode: "code", countryName: "name" };
    beforeEach(async function() {
      onCountryChange = jest.fn(() => {});

      const CountryField = jest.fn(props => (
        <div
          data-testid="mocked-country-field"
          onClick={() => props.onCountrySelected(selectedCountry)}
        />
      ));
      const CityField = jest.fn(() => <div />);
      const StreetField = jest.fn(() => <div />);
      mocks = { CountryField, CityField, StreetField };
      const { getByTestId } = render(
        <Form
          onCountryChange={onCountryChange}
          initialCountryValue={{ countryCode: "SOME CODE" }}
          {...mocks}
        />
      );

      let node = await waitForElement(() =>
        getByTestId("mocked-country-field")
      );

      fireEvent.click(node, {});
    });

    test("calls the onCountryChange function correctly", () => {
      expect(onCountryChange).toHaveBeenCalledWith({
        countryCode: "code",
        countryName: "name"
      });
    });

    test("city field", () => {
      expect(getLastCallArgs(mocks.CityField).countryCode).toEqual("code");
    });
    test("street field", () => {
      expect(getLastCallArgs(mocks.StreetField).countryCode).toEqual("code");
    });
  });
});
