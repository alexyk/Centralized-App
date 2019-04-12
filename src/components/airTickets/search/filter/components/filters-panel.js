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
 * Generating the filters object
 */
import {
  GeneratedFilterOptions,
  OptionsForGeneratingFilters,
  Filters as FiltersForFilteringFunction,
  Flight,
  makeFiltersObjectFromResults,
  options as defaultFilterMakingOptions
} from "../filtering-function";

/**
 * FiltersPanel
 * 1. Receives the results of the search
 * 2. Generates a filters object, based on the results and data from the server
 * 3. Passes on the options to the filters
 * 4. Passes the state of the filters object, back to whichever component wants it via
 */
type Props = {
  onSelectedFiltersChange: (filters: FiltersForFilteringFunction) => void,
  searchId: string,
  results: [Flight]
};
type State = {
  filterOptions: null | GeneratedFilterOptions,
  selectedValues: null | GeneratedFilterOptions
};

export default class FiltersPanel extends React.Component<Props, State> {
  constructor(props: Props) {
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
    this._generateFiltersOptionsObject = this._generateFiltersOptionsObject.bind(
      this
    );
    this._selectAllFilterOptionsByDefault = this._selectAllFilterOptionsByDefault.bind(
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
    if (!this.props.loading) {
      this.generateFiltersAndSelectThemByDefault();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    let justLoaded = !this.props.loading && prevProps.loading;
    if (justLoaded) {
      this.generateFiltersAndSelectThemByDefault();
    }
    if (!_.equals(prevState.selectedValues, this.state.selectedValues)) {
      this.onSelectedFiltersChange();
    }
  }

  /**
   * Generate The Options Object
   */
  async generateFiltersAndSelectThemByDefault() {
    let filterOptions: GeneratedFilterOptions = await this._generateFiltersOptionsObject(
      this.props.results
    );
    let selectedValues: GeneratedFilterOptions = this._selectAllFilterOptionsByDefault(
      filterOptions
    );
    this.setState({
      filterOptions,
      selectedValues
    });
  }

  async _generateFiltersOptionsObject(
    results: [Flight]
  ): GeneratedFilterOptions {
    let options: OptionsForGeneratingFilters = defaultFilterMakingOptions;
    return await makeFiltersObjectFromResults(results, options);
  }

  _selectAllFilterOptionsByDefault(
    filterOptions: GeneratedFilterOptions
  ): GeneratedFilterOptions {
    filterOptions.airports.all = filterOptions.airports.all.map(ap => ({
      ...ap,
      selected: true
    }));
    filterOptions.changes = filterOptions.changes.map(ch => ({
      ...ch,
      selected: true
    }));
    return filterOptions;
  }

  /**
   * Inform Parent Component About Changes
   */
  onSelectedFiltersChange() {
    let filters: FiltersForFilteringFunction = this._adaptFiltersForFilteringFunction(
      this.state.selectedValues
    );
    this.props.onSelectedFiltersChange(filters);
  }
  _adaptFiltersForFilteringFunction(
    selectedValues
  ): FiltersForFilteringFunction {
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
  handlePriceRangeChange(value: { min: number, max: number }) {
    this.setState({
      selectedValues: {
        ...(this.state.selectedValues || {}),
        price: {
          min: value.min,
          max: value.max
        }
      }
    });
  }

  /**
   * Stops Change
   */
  handleSelectedStopsChange(e) {
    let selectedChangesId: string = e.target.value;
    let checked = e.target.checked;
    let changes = this._markSelectedStops(selectedChangesId, checked);
    this.setState({
      selectedValues: {
        ...(this.state.selectedValues || {}),
        changes
      }
    });
  }

  _markSelectedStops(
    selectedChangesId: string,
    checked: boolean
  ): [{ changesId: string }] {
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
  handleAirlinesChange(value: [{ airlineId: string, airlineName: string }]) {
    this.setState({
      selectedValues: {
        ...this.state.selectedValues,
        airlines: value
      }
    });
  }
  /**
   * Journey Time Changes
   */
  handleJourneyTimeChange(value: number) {
    this.setState({
      selectedValues: {
        ...this.state.selectedValues,
        journeyTime: {
          ...this.state.selectedValues.journeyTime,
          max: value
        }
      }
    });
  }

  /**
   * Airports Changes
   */
  handleSelectedAirportsChange(e) {
    let selectedAirportId: string = e.target.value;
    let checked = e.target.checked;
    let all = this._markSelectedAirports(selectedAirportId, checked);
    this.setState({
      selectedValues: {
        ...(this.state.selectedValues || {}),
        airports: {
          ...this.state.selectedValues.airports,
          all
        }
      }
    });
  }

  _markSelectedAirports(
    selectedAirportId: string,
    checked: boolean
  ): [{ airportId: string, airportName: string }] {
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
   * Transfer Changes
   */
  handleTransfersChange(value: [{ airportId: string, airportName: string }]) {
    this.setState({
      selectedValues: {
        ...this.state.selectedValues,
        airports: {
          ...this.state.selectedValues.airports,
          transfers: value
        }
      }
    });
  }

  render() {
    if (this.props.loading) {
      return (
        <div className="filter-box">
          <div className="form-group">
            <h6 className="filter-info">
              Search in progress, filtering will be possible after it is
              completed
            </h6>
          </div>
        </div>
      );
    }

    if (!this.state.selectedValues) {
      return (
        <div className="filter-box">
          <div className="form-group">
            <h6 className="filter-info">
              No availbale filters for this search.
            </h6>
          </div>
        </div>
      );
    }

    return (
      this.state.selectedValues && (
        <div>
          <StopsFilter
            selectedValues={this.state.selectedValues}
            handleSelectedStopsChange={this.handleSelectedStopsChange}
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
