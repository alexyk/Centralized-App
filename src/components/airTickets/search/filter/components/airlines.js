import React from "react";
import Select from "react-select";

export default class AirlinesFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      airlines: props.airlines || []
    };

    this.onStateChange = this.onStateChange.bind(this);
  }
  onStateChange(value) {
    this.setState(value, () => {
      if (this.props.onStateChange) {
        let adaptedValue = value;
        this.props.onStateChange(adaptedValue);
      }
    });
  }

  render() {
    return (
      <Select
        name="airlines[]"
        placeholder=""
        value={this.state.airlines}
        getOptionValue={option => option.airlineId}
        getOptionLabel={option => option.airlineName}
        options={this.state.airlines}
        onChange={option => this.onChange("airlines", option)}
        isMulti
      />
    );
  }
}
