import CityField, { GoogleClient as CityGoogleClient } from "./CityField";

describe("CityField", () => {
  // Mocks
  // - googleClient
  // What does it do?
  // 1. displays the value while writing
  // 2. displays the selected option correctly
  // 3. On mount tries to set the state to the initial value from props
  // 4. Clears the state if the selected country from props changes
  // 5. Working with the google clinet
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
});

describe("CityGoogleClient", () => {});
