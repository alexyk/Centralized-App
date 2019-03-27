import React, {Fragment, Component} from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

class FilterSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      airlines: [],
      arrivalAirports: [],
      transferAirports: [],
      departureAirports: []
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(name, value) {
    this.setState({
      [name]: value
    },  () => { this.props.applyFilters(this.state)});
  }

  render () {
    const { airlines, arrivalAirports, transferAirports, departureAirports } = this.state;

    return (
      <Fragment>
        {airlines.length > 0 &&
          <Select
            value={airlines}
            onChange={this.onChange}
            options={this.props.airlines}
          />
        }
        {arrivalAirports.length > 0 &&
          <Select
            value={arrivalAirports}
            onChange={this.onChange}
            options={this.props.arrivalAirports}
          />
        }
        {transferAirports.length > 0 &&
          <Select
            value={transferAirports}
            onChange={this.onChange}
            options={this.props.transferAirports}
          />
        }
        {departureAirports.length > 0 &&
          <Select
            value={departureAirports}
            onChange={this.onChange}
            options={this.props.departureAirports}
          />
        }
      </Fragment>
    );
  }
}

FilterSelect.PropTypes = {
  airlines: PropTypes.array,
  transferAirports: PropTypes.array,
  arrivalAirports: PropTypes.array,
  departureAirports: PropTypes.array,
  applyFilters: PropTypes.object
}


export default FilterSelect
