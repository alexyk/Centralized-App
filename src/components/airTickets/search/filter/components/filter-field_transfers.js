import React from "react";
import Select from "react-select";

export default class TransfersFilter extends React.Component {
  render() {
    if (!this.props.filterOptions.airports) return null;
    return (
      <div className="filter airlines-filter">
        <h5>Transfers</h5>
        <Select
          name="airlines[]"
          placeholder=""
          value={this.props.selectedValues.airports.transfers}
          getOptionValue={option => option.airportId}
          getOptionLabel={option => option.airportName}
          options={this.props.filterOptions.airports.transfers}
          onChange={this.props.handleTransfersChange}
          isMulti
        />
      </div>
    );
  }
}
