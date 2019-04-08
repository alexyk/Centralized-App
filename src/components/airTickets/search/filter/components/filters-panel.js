import React from "react";
import { makeFiltersObjectFromResults } from "../filtering-function/filter-options-generating";
import "../../../../../styles/css/components/airTickets/search/filter/air-tickets-search-filter-panel.css";

/**
 * Individual Filter Components
 */
import PriceSlider from "./price-slider";
import FilterCheckbox from "./stops";

import { getStopName } from "../../../../common/flights/util";

/**
 * Helpers
 */
const makeFiltersFromResultsAndTheServer = results => {
  let options = {
    getCityNameForAirport() {},
    getAirlines() {}
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
    this.handlePriceRangeChange = this.handlePriceRangeChange.bind(this);
    this.generateFiltersOptionsObject = this.generateFiltersOptionsObject.bind(
      this
    );
    this.onSelectedFiltersChange = this.onSelectedFiltersChange.bind(this);
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
    let filterOptions = await makeFiltersFromResultsAndTheServer(results);
    this.setState({
      filterOptions,
      selectedValues: { ...filterOptions }
    });
  }

  /**
   * Inform Parent Component About Changes
   */
  onSelectedFiltersChange() {
    this.props.onSelectedFiltersChange(this.state.selectedValues);
  }

  /**
   * Individual Filter Change Handlers
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

  handleSelectedStopsChange(selectedChangesId) {
    this.setState(
      {
        selectedValues: {
          ...(this.state.selectedValues || {}),
          changes: this.state.filterOptions.changes.map(currentChanges => {
            if (currentChanges.changesId === selectedChangesId) {
              return {
                ...currentChanges,
                selected: true
              };
            }
            return {
              ...currentChanges,
              selected: false
            };
          })
        }
      },
      this.onSelectedFiltersChange
    );
  }

  render() {
    return (
      this.state.selectedValues && (
        <div>
          {Object.values(this.state.filterOptions.changes).map((item, i) => {
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
          })}

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
        </div>
      )
    );
  }
}
