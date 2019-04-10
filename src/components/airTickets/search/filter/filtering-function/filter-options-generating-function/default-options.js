import { Config } from "../../../../../../config";

export function makeDefaultOptionsForFilterGenaration(searchId) {
  return {
    getCityNameForAirport(airportId) {
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
}
