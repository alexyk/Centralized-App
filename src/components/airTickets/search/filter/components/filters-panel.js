import React from "react";
import * as _ from "ramda";
import "../../../../../styles/css/components/airTickets/search/filter/air-tickets-search-filter-panel.css";

/**
 * Individual Filter Components
 */
import StopsFilter from "./filter-field_stops";
import AirlinesFilter from "./filter-field_airlines";
import JourneyTimeFilter from "./filter-field_journey-time";
import PriceFilter from "./filter-field_price";
import AirportsFilter from "./filter-field_airports";
import TransfersFilter from "./filter-field_transfers";

/**
 * Helpers
 */
import { makeFiltersObjectFromResults } from "../filtering-function/filter-options-generating-function/filter-options-generating";
import { Config } from "../../../../../config";

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
          <StopsFilter
            handleSelectedStopsChange={this.handleSelectedStopsChange}
            filterOptions={this.state.filterOptions}
          />

          <AirlinesFilter
            selectedValues={this.state.selectedValues}
            filterOptions={this.state.filterOptions}
            handleAirlinesChange={this.handleAirlinesChange}
          />

          <JourneyTimeFilter
            selectedValues={this.state.selectedValues}
            filterOptions={this.state.filterOptions}
            handleJourneyTimeChange={this.handleJourneyTimeChange}
          />

          <PriceFilter
            selectedValues={this.state.selectedValues}
            filterOptions={this.state.filterOptions}
            handlePriceRangeChange={this.handlePriceRangeChange}
          />

          <AirportsFilter
            selectedValues={this.state.selectedValues}
            filterOptions={this.state.filterOptions}
            handleSelectedAirportsChange={this.handleSelectedAirportsChange}
          />

          <TransfersFilter
            selectedValues={this.state.selectedValues}
            filterOptions={this.state.filterOptions}
            handleTransfersChange={this.handleTransfersChange}
          />
        </div>
      )
    );
  }
}
