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
  // 5. Working with the google client
  // 5.1 Initiates the client
  // 5.2. When loading options, calls fetchCitiesForInput with the input from the state
  // 6. Working with react select
  // 6.1 Loading options
  // 6.1.1. When loading the options for react-select it adapts them properly
  // 6.1.2. Calls the react-select component with the proper options
  // 6.1.3. Executes the callback function
  // 6.2. On selected city change
  // 6.2.1 calls googleClient.getCityAndStateOfPlaceWithId with the right value
  // 6.2.2 displays the value correctly
  // 6.2.3 calls onCityChange with the correct value

  // it("sets the value and passes it to the select component", async () => {
  //   // using a mocked input field to bypass react-select
  //   jest.doMock("react-select/lib/Async", () => {
  //     return function MockedAsyncSelect(props) {
  //       return <div data-testid="mock">{(props.value || {}).label}</div>;
  //     };
  //   });
  //   const CityField = require("./CityField").default;
  //   const initialCityValue = "some city";
  //   const { getByText } = render(
  //     <CityField googleClient={{}} initialCityValue={initialCityValue} />
  //   );
  //   await waitForElement(() => getByText(initialCityValue));
  // });
  // -----------------------------------------------------------------------
  const TEST_ID = "mock";
  jest.doMock("react-select/lib/Async", () => {
    return function MockedAsyncSelect(props) {
      return (
        <div data-testid={TEST_ID} onClick={props.loadOptions}>
          {(props.value || {}).label}
        </div>
      );
    };
  });
  const CityField = require("./CityField").default;

  describe("Clears the state if the selected country from props changes", () => {
    it("Sets the state to its defaults", async () => {
      const initialCityValue = "some city";
      const { rerender, getByTestId } = render(
        <CityField googleClient={{}} initialCityValue={initialCityValue} />
      );

      let before = await waitForElement(() => getByTestId("mock"));
      expect(before.innerHTML).toBe(initialCityValue);

      // update the props, passing the new country code
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
      expect(onClearCityField).toHaveBeenCalledTimes(1);
    });
    it("Notifies the parent component of the change", () => {});
  });
  // -----------------------------------------------------------------------
  describe("When loading options, calls fetchCitiesForInput with the input from the state", () => {
    it("on 'load options'", async () => {
      // mock the google client
      const mockedGoogleClient = {
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

      const countryCode = "some country";
      const initialCityValue = "some initial city";

      const { rerender, getByTestId } = render(
        <CityField
          googleClient={mockedGoogleClient}
          countryCode={countryCode}
          initialCityValue={initialCityValue}
        />
      );
      let node = await waitForElement(() => getByTestId(TEST_ID));
      fireEvent.click(node);
      // makes a call to its method 'fetchCitiesForInput'
      expect(mockedGoogleClient.fetchCitiesForInput).toHaveBeenCalledTimes(1);
      // the countryCode from props and the input
      expect(mockedGoogleClient.fetchCitiesForInput).toHaveBeenCalledWith([
        initialCityValue,
        countryCode
      ]);
      // assuming the method returns [{place_id, description}, {place_id, description}], validate the argument of the 'callback function'
    });

    it("on selected entry change", () => {});
  });
});

describe("CityGoogleClient", () => {});
