import { Config } from "../../../../../../config";
import type { OptionsForGeneratingFilters } from "./filter-options-generating";

let options: OptionsForGeneratingFilters = {
  getCityNameForAirport(airportId: string) {
    return fetch(
      `${Config.getValue("apiHost")}flight/city/airports/${airportId}`
    )
      .then(res => res.json())
      .then(data => data.cityName);
  }
};
export { options };
