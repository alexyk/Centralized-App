import React from "react";
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
 * Generating the filters object
 */
import {
  GeneratedFilterOptions,
  Filters as FiltersForFilteringFunction,
  makeFiltersObjectFromResults,
  makeDefaultOptionsForFilterGenaration
} from "../filtering-function";

/**
 * FiltersPanel
 * 1. Receives the results of the search
 * 2. Generates a filters object, based on the results and data from the server
 * 3. Passes on the options to the filters
 * 4. Passes the state of the filters object, back to whichever component wants it via
 * onFiltersChange
 */
type Props = {
  onSelectedFiltersChange: (filters: FiltersForFilteringFunction) => void,
  searchId: string
};
type State = {
  filterOptions: null | GeneratedFilterOptions,
  selectedValues: null | GeneratedFilterOptions
};

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
    let options = makeDefaultOptionsForFilterGenaration(this.props.searchId);
    let filterOptions = await makeFiltersObjectFromResults(results, options);
    this.setState({
      filterOptions,
      selectedValues: { ...filterOptions, airlines: [] }
    });
  }

  /**
   * Inform Parent Component About Changes
   */
  onSelectedFiltersChange() {
    let filters: FiltersForFilteringFunction = this._adaptFiltersForFilteringFunction();
    this.props.onSelectedFiltersChange(filters);
  }
  _adaptFiltersForFilteringFunction(): FiltersForFilteringFunction {
    let selectedValues = this.state.selectedValues;
    return {
      ...selectedValues,
      changes: selectedValues.changes.filter(change => change.selected),
      journeyTime: selectedValues.journeyTime.max
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
    return this.state.selectedValues.changes.map(currentChanges =>
      currentChanges.changesId !== selectedChangesId
        ? currentChanges
        : {
            ...currentChanges,
            selected: checked ? true : false
          }
    );
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
    return this.state.selectedValues.airports.all.map(currentAirport =>
      currentAirport.airportId !== selectedAirportId
        ? currentAirport
        : {
            ...currentAirport,
            selected: checked ? true : undefined
          }
    );
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
