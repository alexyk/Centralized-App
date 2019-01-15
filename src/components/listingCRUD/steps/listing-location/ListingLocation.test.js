import React from "react";
import {
  render,
  fireEvent,
  cleanup,
  waitForElement
} from "react-testing-library";
import { ListingLocation } from "./ListingLocation";
import { BrowserRouter } from "react-router-dom";

afterEach(cleanup);

describe("ListingLocation", () => {
  let onChange;
  beforeEach(async function() {
    onChange = jest.fn();
  });

  test("calls onCountryChange correctly", async () => {
    const countryName = "some new country";
    const countryCode = "some country code";
    const Form = jest.fn(props => (
      <div
        data-testid="Form"
        onClick={() => props.onCountryChange({ countryName, countryCode })}
      />
    ));
    const { getByTestId } = render(
      <BrowserRouter>
        <ListingLocation
          routes={{
            loc: "",
            landing: "",
            placetype: "",
            accommodation: "",
            facilities: "",
            safetyamenities: "",
            location: "",
            description: "",
            photos: "",
            houserules: "",
            checking: "",
            price: ""
          }}
          location={{ pathname: "" }}
          values={{ street: "asda sd as" }}
          Form={Form}
          onChange={onChange}
        />
      </BrowserRouter>
    );
    let node = await waitForElement(() => getByTestId("Form"));
    fireEvent.click(node);

    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange.mock.calls[0][0]).toEqual({
      target: { name: "country", value: countryName }
    });
    expect(onChange.mock.calls[1][0]).toEqual({
      target: { name: "countryCode", value: countryCode }
    });
  });

  test("parses and passes initialCountryValue correctly", async () => {
    const Form = jest.fn(props => (
      <div
        data-testid="Form"
        onClick={() => props.onCountryChange({ countryName, countryCode })}
      />
    ));
    const { getByTestId } = render(
      <BrowserRouter>
        <ListingLocation
          routes={{
            loc: "",
            landing: "",
            placetype: "",
            accommodation: "",
            facilities: "",
            safetyamenities: "",
            location: "",
            description: "",
            photos: "",
            houserules: "",
            checking: "",
            price: ""
          }}
          location={{ pathname: "" }}
          values={{
            street: "asda sd as",
            country: "Bulgaria",
            countryCode: "BG"
          }}
          Form={Form}
          onChange={onChange}
        />
      </BrowserRouter>
    );
    expect(
      Form.mock.calls[Form.mock.calls.length - 1][0].initialCountryValue
    ).toEqual({
      countryName: "Bulgaria",
      countryCode: "BG"
    });
  });

  test("calls onCityChange correctly", async () => {
    const cityAndState = "Some City, Some State";
    const Form = jest.fn(props => (
      <div
        data-testid="Form"
        onClick={() => props.onCityChange(cityAndState)}
      />
    ));
    const { getByTestId } = render(
      <BrowserRouter>
        <ListingLocation
          routes={{
            loc: "",
            landing: "",
            placetype: "",
            accommodation: "",
            facilities: "",
            safetyamenities: "",
            location: "",
            description: "",
            photos: "",
            houserules: "",
            checking: "",
            price: ""
          }}
          location={{ pathname: "" }}
          values={{ street: "asda sd as" }}
          Form={Form}
          onChange={onChange}
        />
      </BrowserRouter>
    );
    let node = await waitForElement(() => getByTestId("Form"));
    fireEvent.click(node);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toEqual({
      target: { name: "city", value: cityAndState }
    });
  });
  test("parses and passes initialCityValue correctly", async () => {
    const Form = jest.fn(props => <div data-testid="Form" />);
    const { getByTestId } = render(
      <BrowserRouter>
        <ListingLocation
          routes={{
            loc: "/",
            landing: "/",
            placetype: "/",
            accommodation: "/",
            facilities: "/",
            safetyamenities: "/",
            location: "/",
            description: "/",
            photos: "/",
            houserules: "/",
            checking: "/",
            price: "/"
          }}
          location={{ pathname: "" }}
          values={{
            street: "asda sd as",
            country: "Bulgaria",
            countryCode: "BG",
            city: "Sofia"
          }}
          Form={Form}
          BasicAside={() => null}
          FooterNav={() => null}
          onChange={onChange}
        />
      </BrowserRouter>
    );
    expect(
      Form.mock.calls[Form.mock.calls.length - 1][0].initialCityValue
    ).toEqual("Sofia");
  });

  describe("calls onClearCityField correctly", () => {});
  test("calls onStreetChange correctly", async () => {
    const streetAddress = "Some street address";
    const Form = jest.fn(props => (
      <div
        data-testid="Form"
        onClick={() => props.onStreetChange(streetAddress)}
      />
    ));
    const { getByTestId } = render(
      <BrowserRouter>
        <ListingLocation
          routes={{
            loc: "",
            landing: "",
            placetype: "",
            accommodation: "",
            facilities: "",
            safetyamenities: "",
            location: "",
            description: "",
            photos: "",
            houserules: "",
            checking: "",
            price: ""
          }}
          location={{ pathname: "" }}
          values={{ street: "asda sd as" }}
          Form={Form}
          onChange={onChange}
        />
      </BrowserRouter>
    );
    let node = await waitForElement(() => getByTestId("Form"));
    fireEvent.click(node);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toEqual({
      target: { name: "street", value: streetAddress }
    });
  });
  test("parses and passes initialStreetValue correctly", () => {
    const Form = jest.fn(props => <div data-testid="Form" />);
    const { getByTestId } = render(
      <BrowserRouter>
        <ListingLocation
          routes={{
            loc: "/",
            landing: "/",
            placetype: "/",
            accommodation: "/",
            facilities: "/",
            safetyamenities: "/",
            location: "/",
            description: "/",
            photos: "/",
            houserules: "/",
            checking: "/",
            price: "/"
          }}
          location={{ pathname: "" }}
          values={{
            street: "asda sd as",
            country: "Bulgaria",
            countryCode: "BG",
            city: "Sofia",
            street: "Some Street"
          }}
          Form={Form}
          BasicAside={() => null}
          FooterNav={() => null}
          onChange={onChange}
        />
      </BrowserRouter>
    );
    expect(
      Form.mock.calls[Form.mock.calls.length - 1][0].initialStreetValue
    ).toEqual("Some Street");
  });
  describe("calls onClearStreetField correctly", () => {});
});
