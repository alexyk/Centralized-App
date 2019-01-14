import React from "react";
import {
  render,
  fireEvent,
  cleanup,
  waitForElement
} from "react-testing-library";

afterEach(cleanup);

describe("CityField", () => {
  // What does it do?
  // ----------------
  // 1. displays the value while writing - can't test directly
  // 2. displays the selected option correctly - can't test directly
  // ---------------------------------------------------------------
  // 3. Sets the initial value from props - X
  // 4. Clears the state if the selected country from props changes - X
  // 5. When loading options for the select component, calls fetchCitiesForInput correctly
  // 6. Working with react select
  // 6.1 Loading options
  // 6.1.1. When loading the options for react-select it adapts them properly
  // 6.1.2. Calls the react-select component with the proper options
  // 6.1.3. Executes the callback function
  // 6.2. On selected city change
  // 6.2.1 calls googleClient.getCityAndStateOfPlaceWithId with the right value
  // 6.2.2 displays the value correctly
  // 6.2.3 calls onCityChange with the correct value
  const TEST_ID = "mock";
  const cb = jest.fn();

  jest.doMock("react-select/lib/Async", () => {
    return function MockedAsyncSelect(props) {
      return (
        <div
          data-testid={TEST_ID}
          onClick={() => props.loadOptions(props.value.label, cb)}
        >
          {(props.value || {}).label}
        </div>
      );
    };
  });
  const CityField = require("./CityField").default;
  // -----------------------------------------------------------------------

  describe("Clears the state if the selected country from props changes", () => {
    const initialCityValue = "some city";
    let rerender, getByText, getByTestId;
    beforeEach(async function() {
      const {
        rerender: _rerender,
        getByTestId: _getByTestId,
        getByText: _getByText
      } = render(
        <CityField googleClient={{}} initialCityValue={initialCityValue} />
      );
      rerender = _rerender;
      getByTestId = _getByTestId;
      getByText = _getByText;
    });

    it("sets the value and passes it to the select component", async () => {
      await waitForElement(() => getByText(initialCityValue));
    });

    it("Sets the state to its defaults", async () => {
      const onClearCityField = jest.fn();
      rerender(
        <CityField
          googleClient={{}}
          initialCityValue={initialCityValue}
          onClearCityField={onClearCityField}
          countryCode={"TEST"}
        />
      );

      let node = await waitForElement(() => getByTestId("mock"));
      expect(node.innerHTML).toBe("");
    });
    it("Notifies the parent component of the change", () => {
      const onClearCityField = jest.fn();
      rerender(
        <CityField
          googleClient={{}}
          initialCityValue={initialCityValue}
          onClearCityField={onClearCityField}
          countryCode={"TEST"}
        />
      );

      expect(onClearCityField).toHaveBeenCalledTimes(1);
    });
  });
  // -----------------------------------------------------------------------
  describe("When loading options for the select component, calls fetchCitiesForInput correctly", () => {
    let mockedGoogleClient;
    const countryCode = "some country";
    const initialCityValue = "some initial city";
    let rerender, getByTestId;
    beforeEach(async function() {
      mockedGoogleClient = {
        fetchCitiesForInput: jest.fn(() => {
          new Promise(resolve => {
            setTimeout(() => {
              resolve([
                { place_id: "", description: "" },
                { place_id: "", description: "" }
              ]);
            }, 1000);
          });
        })
      };

      const { rerender: _rerender, getByTestId: _getByTestId } = render(
        <CityField
          googleClient={mockedGoogleClient}
          countryCode={countryCode}
          initialCityValue={initialCityValue}
        />
      );
      rerender = _rerender;
      getByTestId = _getByTestId;
      let node = await waitForElement(() => getByTestId(TEST_ID));
      fireEvent.click(node, {});
    });

    it("calls fetchCitiesForInput correctly", async () => {
      expect(mockedGoogleClient.fetchCitiesForInput).toHaveBeenCalledTimes(1);
      expect(mockedGoogleClient.fetchCitiesForInput).toHaveBeenCalledWith(
        initialCityValue,
        countryCode
      );
    });

    it("adapts correctly", () => {
      // assuming the method returns [{place_id, description}, {place_id, description}], validate the argument of the 'callback function'
      expect(cb).toHaveBeenCalledWith([]);
    });

    it("on selected entry change", () => {});
  });
});

describe("CityGoogleClient", () => {});
