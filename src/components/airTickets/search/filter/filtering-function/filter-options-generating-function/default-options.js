import { Config } from "../../../../../../config";
import type { OptionsForGeneratingFilters } from "./filter-options-generating";

const makeDefaultOptionsForFilterGenaration = function makeDefaultOptionsForFilterGenaration(
  searchId: string
): OptionsForGeneratingFilters {
  return {
    getCityNameForAirport(airportId: string) {
      return fetch(
        `${Config.getValue("apiHost")}flight/city/airports/${airportId}`
      )
        .then(res => res.json())
        .then(data => data.cityName);
    },
    getAirlines() {
      return fetch(
        `${Config.getValue(
          "apiHost"
        )}flight/search/filter/data?searchId=${searchId}`
      )
        .then(res => res.json())
        .then(data => data.airlines);
    }
  };
};

export { makeDefaultOptionsForFilterGenaration };
