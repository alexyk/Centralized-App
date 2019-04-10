import React from "react";
import * as _ from "ramda";

export default class AirportsFilter extends React.Component {
  constructor(props) {
    super(props);
    this.onSelectedAirportsChange = this.onSelectedAirportsChange.bind(this);
    this._renderAirportOptionsForCity = this._renderAirportOptionsForCity.bind(
      this
    );
    this._renderIndividualAirportOption = this._renderIndividualAirportOption.bind(
      this
    );
  }

  render() {
    if (!this.props.selectedValues.airports) return null;
    return (
      <div className="filter-box">
        <div className="filter stops-filter">
          <h5>Airports</h5>
          {this._renderAirportOptions()}
        </div>
      </div>
    );
  }
  _renderAirportOptions() {
    let allAirports = Object.values(this.props.selectedValues.airports.all);
    let airportsByCity = _.groupBy(_.prop("city"), allAirports);
    let cityNames = _.keys(airportsByCity);
    return cityNames.map((cityName, i) => {
      return this._renderAirportOptionsForCity(cityName, airportsByCity);
    });
  }

  _renderAirportOptionsForCity(cityName, airportsByCity) {
    let currentCityAirports = airportsByCity[cityName];
    if (currentCityAirports.length <= 1) {
      return null;
    }
    let currentCityAirportsElements = currentCityAirports.map(
      this._renderIndividualAirportOption
    );
    return (
      <ul key={cityName}>
        <h6>{cityName}</h6>
        {currentCityAirportsElements}
      </ul>
    );
  }

  _renderIndividualAirportOption(airport) {
    return (
      <li key={airport.airportId}>
        <label className="filter-label">
          <input
            data-testid={"stop-checkbox"}
            type="checkbox"
            className="filter-checkbox"
            name="stops[]"
            value={airport.airportId}
            onChange={this.onSelectedAirportsChange}
            checked={airport.selected}
          />
          <span>{airport.airportName}</span>
        </label>
      </li>
    );
  }

  onSelectedAirportsChange(value) {
    this.props.handleSelectedAirportsChange(value);
  }
}
