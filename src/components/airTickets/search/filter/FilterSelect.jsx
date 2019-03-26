import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

class FilterSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      airlines: [],
      arrivalAirports: [],
    };
  }

  render () {
    const { airlines, arrivalAirports, departureAirports } = this.state;

    return (
      {airlines &&
      <Select
        value={selectedOption}
        onChange={this.handleChange}
        options={options}
        />
      }
    );
  }
}
