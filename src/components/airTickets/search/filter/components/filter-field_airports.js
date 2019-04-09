import React from "react";
import * as _ from "ramda";

export default class AirportsFilter extends React.Component {
  render() {
    return (
      <div className="filter-box">
        <div className="filter stops-filter">
          <h5>Airports</h5>
          {this.renderAirportOptions()}
        </div>
      </div>
    );
  }

  renderAirportOptions() {
    let allAirports = Object.values(this.props.filterOptions.airports.all);
    let airportsByCity = _.groupBy(_.prop("city"), allAirports);

    let cityNames = _.keys(airportsByCity);

    return cityNames.map((cityName, i) => {
      let currentCityAirports = airportsByCity[cityName];
      if (currentCityAirports.length <= 1) {
        return null;
      }

      let currentCityAirportsElements = currentCityAirports.map(airport => {
        return (
          <li key={airport.airportId}>
            <label className="filter-label">
              <input
                data-testid={"stop-checkbox"}
                type="checkbox"
                className="filter-checkbox"
                name="stops[]"
                value={airport.airportId}
                onChange={this.props.handleSelectedAirportsChange}
              />
              <span>{airport.airportName}</span>
            </label>
          </li>
        );
      });

      return (
        <ul key={cityName}>
          <h6>{cityName}</h6>
          {currentCityAirportsElements}
        </ul>
      );
    });
  }
}
