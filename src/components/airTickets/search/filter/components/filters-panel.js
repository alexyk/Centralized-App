import React from "react";
import * as _ from "ramda";
import { makeFiltersObjectFromResults } from "../filtering-function/filter-options-generating";
import "../../../../../styles/css/components/airTickets/search/filter/air-tickets-search-filter-panel.css";

/**
 * Individual Filter Components
 */
import PriceSlider from "./price-slider";

import { getStopName } from "../../../../common/flights/util";
import Select from "react-select";

/**
 * Helpers
 */
import { Config } from "../../../../../config";
import InputRange from "react-input-range";

const makeFiltersFromResultsAndTheServer = (results, _options) => {
  let options = {
    getCityNameForAirport(airportId) {
      return fetch(
        `${Config.getValue("apiHost")}flight/city/airports/${airportId}`
      )
        .then(res => res.json())
        .then(data => {
          return data.cityName;
        });
    },
    getAirlines() {
      return fetch(
        `${Config.getValue("apiHost")}flight/search/filter/data?searchId=${
          _options.searchId
        }`
      )
        .then(res => res.json())
        .then(data => {
          return data.airlines;
        });
    }
  };

  return makeFiltersObjectFromResults(results, options);
};

/**
 * FiltersPanel
 * 1. Receives the results of the search
 * 2. Generates a filters object, based on the results and data from the server
 * 3. Passes on the options to the filters
 * 4. Passes the state of the filters object, back to whichever component wants it via
 * onFiltersChange
 */

export default class FiltersPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filterOptions: null,
      selectedValues: null
    };

    this.handleSelectedStopsChange = this.handleSelectedStopsChange.bind(this);
    this._markSelectedStops = this._markSelectedStops.bind(this);
    this.handlePriceRangeChange = this.handlePriceRangeChange.bind(this);
    this.handleAirlinesChange = this.handleAirlinesChange.bind(this);
    this.handleJourneyTimeChange = this.handleJourneyTimeChange.bind(this);
    this.handleTransfersChange = this.handleTransfersChange.bind(this);
    this.generateFiltersOptionsObject = this.generateFiltersOptionsObject.bind(
      this
    );
    this.onSelectedFiltersChange = this.onSelectedFiltersChange.bind(this);
    this.handleSelectedAirportsChange = this.handleSelectedAirportsChange.bind(
      this
    );
  }

  /**
   * Hooks
   */
  componentDidMount() {
    this.generateFiltersOptionsObject(this.props.results);
  }

  /**
   * Generate The Options Object
   */
  async generateFiltersOptionsObject(results) {
    let filterOptions = await makeFiltersFromResultsAndTheServer(results, {
      searchId: this.props.searchId
    });
    this.setState({
      filterOptions,
      selectedValues: { ...filterOptions, airlines: [] }
    });
  }

  /**
   * Inform Parent Component About Changes
   */
  onSelectedFiltersChange() {
    let filters = this._adaptFiltersForFilteringFunction();
    this.props.onSelectedFiltersChange(filters);
  }
  _adaptFiltersForFilteringFunction() {
    let _filters = this.state.selectedValues;
    return {
      ..._filters,
      price: {
        minPrice: _filters.price.min,
        maxPrice: _filters.price.max
      },
      changes: Object.values(_filters.changes || {}).filter(change => {
        return change.selected;
      }),
      journeyTime: _filters.journeyTime.max,
      airports: this._adaptAirportsForFilteringFunction(_filters)
    };
  }

  _adaptAirportsForFilteringFunction(_filters) {
    let selectedCities = _filters.airports.all
      .filter(airport => airport.selected !== undefined)
      .map(_.prop("city"));

    let all = _filters.airports.all.filter(
      airport => selectedCities.indexOf(airport.city) !== -1
    );
    let transfers = _filters.airports.transfers;

    return {
      all,
      transfers
    };
  }

  /**
   * Individual Filter Change Handlers
   */
  /**
   * Price Changes
   */
  handlePriceRangeChange(value) {
    this.setState(
      {
        selectedValues: {
          ...(this.state.selectedValues || {}),
          price: {
            min: value.min,
            max: value.max
          }
        }
      },
      this.onSelectedFiltersChange
    );
  }

  /**
   * Stops Change
   */
  handleSelectedStopsChange(e) {
    let selectedChangesId = e.target.value;
    let checked = e.target.checked;
    let changes = this._markSelectedStops(selectedChangesId, checked);
    this.setState(
      {
        selectedValues: {
          ...(this.state.selectedValues || {}),
          changes
        }
      },
      this.onSelectedFiltersChange
    );
  }

  _markSelectedStops(selectedChangesId, checked) {
    return this.state.filterOptions.changes.map(currentChanges => {
      if (currentChanges.changesId === selectedChangesId) {
        return {
          ...currentChanges,
          selected: checked ? true : false
        };
      }
      return {
        ...currentChanges,
        selected: false
      };
    });
  }

  /**
   * Airline Changes
   */
  handleAirlinesChange(value) {
    this.setState(
      {
        selectedValues: {
          ...this.state.selectedValues,
          airlines: value
        }
      },
      this.onSelectedFiltersChange
    );
  }
  /**
   * Journey Time Changes
   */
  handleJourneyTimeChange(value) {
    this.setState(
      {
        selectedValues: {
          ...this.state.selectedValues,
          journeyTime: {
            ...this.state.selectedValues.journeyTime,
            max: value
          }
        }
      },
      this.onSelectedFiltersChange
    );
  }

  handleSelectedAirportsChange(e) {
    let selectedAirportId = e.target.value;
    let checked = e.target.checked;
    let all = this._markSelectedAirports(selectedAirportId, checked);
    this.setState(
      {
        selectedValues: {
          ...(this.state.selectedValues || {}),
          airports: {
            ...this.state.selectedValues.airports,
            all
          }
        }
      },
      this.onSelectedFiltersChange
    );
  }

  _markSelectedAirports(selectedAirportId, checked) {
    return this.state.selectedValues.airports.all.map(currentAirport => {
      if (currentAirport.airportId === selectedAirportId) {
        return {
          ...currentAirport,
          selected: checked ? true : undefined
        };
      }
      return currentAirport;
    });
  }

  /**
   *
   */

  renderAirportOptions() {
    let allAirports = Object.values(this.state.filterOptions.airports.all);
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
                onChange={this.handleSelectedAirportsChange}
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

  handleTransfersChange(value) {
    this.setState(
      {
        selectedValues: {
          ...this.state.selectedValues,
          airports: {
            ...this.state.selectedValues.airports,
            transfers: value
          }
        }
      },
      this.onSelectedFiltersChange
    );
  }

  render() {
    return (
      this.state.selectedValues && (
        <div>
          <div className="filter-box">
            <div className="filter stops-filter">
              <h5>Stops</h5>
              <ul>
                {Object.values(this.state.filterOptions.changes).map(
                  (item, i) => {
                    return (
                      <li key={i}>
                        <label className="filter-label">
                          <input
                            data-testid={"stop-checkbox"}
                            type="checkbox"
                            className="filter-checkbox"
                            name="stops[]"
                            value={item.changesId}
                            onChange={this.handleSelectedStopsChange}
                          />
                          <span>{getStopName(item.changesId)}</span>
                        </label>
                      </li>
                    );
                  }
                )}
              </ul>
            </div>
          </div>

          {this.state.selectedValues && (
            <div className="filter airlines-filter">
              <h5>Airlines</h5>
              <Select
                name="airlines[]"
                placeholder=""
                value={this.state.selectedValues.airlines}
                getOptionValue={option => option.airlineId}
                getOptionLabel={option => option.airlineName}
                options={this.state.filterOptions.airlines}
                onChange={this.handleAirlinesChange}
                isMulti
              />
            </div>
          )}

          <div className="price-range-filters">
            <h5>Journey Time</h5>
            <div className="number-range-slider">
              <InputRange
                minValue={0}
                maxValue={this.state.filterOptions.journeyTime.max}
                value={this.state.selectedValues.journeyTime.max}
                onChange={this.handleJourneyTimeChange}
                name={"priceRange"}
                step={50}
              />
              <span className="waiting-start-time" />
              <span className="waiting-end-time">
                {this.state.selectedValues.journeyTime.max}
              </span>
            </div>
          </div>

          <div className="price-range-filters">
            <h5>Price</h5>
            <div className="number-range-slider">
              <PriceSlider
                priceRange={this.state.selectedValues.price}
                onStateChange={this.handlePriceRangeChange}
              />
              <span className="waiting-start-time">
                {this.state.selectedValues.price.min}
              </span>
              <span className="waiting-end-time">
                {this.state.selectedValues.price.max}
              </span>
            </div>
          </div>

          <div className="filter-box">
            <div className="filter stops-filter">
              <h5>Airports</h5>
              {this.renderAirportOptions()}
            </div>
          </div>

          {this.state.selectedValues && (
            <div className="filter airlines-filter">
              <h5>Transfers</h5>
              <Select
                name="airlines[]"
                placeholder=""
                value={this.state.selectedValues.airports.transfers}
                getOptionValue={option => option.airportId}
                getOptionLabel={option => option.airportName}
                options={this.state.filterOptions.airports.transfers}
                onChange={this.handleTransfersChange}
                isMulti
              />
            </div>
          )}
        </div>
      )
    );
  }
}
