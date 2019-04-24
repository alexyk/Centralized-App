import React from "react";
import Select from "react-select";

export default class AirlinesFilter extends React.Component {
  render() {
    if (!this.props.filterOptions.airlines) return null;
    return (
      <div className="filter airlines-filter">
        <h5>Airlines</h5>
        <Select
          name="airlines[]"
          placeholder=""
          value={this.props.selectedValues.airlines}
          options={this.props.filterOptions.airlines}
          onChange={this.props.handleAirlinesChange}
          getOptionValue={option => option.airlineId}
          getOptionLabel={option => option.airlineName}
          isMulti
        />
      </div>
    );
  }
}
