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
    this.generateFiltersOptionsObject(this.props.results);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!_.equals(prevState.selectedValues, this.state.selectedValues)) {
      this.onSelectedFiltersChange();
    }
  }
  /**
   * Generate The Options Object
   */
  async generateFiltersOptionsObject(results) {
    let options = makeDefaultOptionsForFilterGenaration(this.props.searchId);
    let filterOptions = await makeFiltersObjectFromResults(results, options);
    let selectedValues = this._selectAllFilterOptionsByDefault(filterOptions);
    this.setState({
      filterOptions,
      selectedValues
    });
  }

  _selectAllFilterOptionsByDefault(filterOptions) {
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
  handlePriceRangeChange(value) {
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
    let selectedChangesId = e.target.value;
    let checked = e.target.checked;
    let changes = this._markSelectedStops(selectedChangesId, checked);
    this.setState({
      selectedValues: {
        ...(this.state.selectedValues || {}),
        changes
      }
    });
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
  handleJourneyTimeChange(value) {
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
    let selectedAirportId = e.target.value;
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
   * Transfer Changes
   */
  handleTransfersChange(value) {
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
