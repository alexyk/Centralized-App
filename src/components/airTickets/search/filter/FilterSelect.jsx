import React, {Fragment, Component} from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

class FilterSelect extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.state = {};
  }

  componentDidMount() {
    const params = this.props;
    this.setState({
      params
    });
  }

  onChange(name, option) {
    this.setState({
      [name]: option
    }, () => this.props.applyFilters(this.state));
  }

  render () {
    const { airlines, arrivalAirports, departureAirports, transferAirports } = this.props;

    return (
      <Fragment>
        {airlines &&
        <div className="filter airlines-filter">
          <h5>Airlines</h5>
          <Select
            name="airlines[]"
            placeholder=""
            value={this.state.airlines}
            getOptionValue={(option) => option.airlineId}
            getOptionLabel={(option) => option.airlineName}
            options={airlines}
            onChange={(option) => this.onChange('airlines', option)}
            isMulti
          />
        </div>
        }
        {arrivalAirports &&
        <div className="filter airlines-filter">
          <h5>Arrivals</h5>
          <Select
            name="arrivalAirports[]"
            placeholder=""
            value={this.state.arrivalAirports}
            getOptionValue={(option) => option.airportId}
            getOptionLabel={(option) => option.airportName}
            options={arrivalAirports}
            onChange={(option) => this.onChange('arrivalAirports', option)}
            isMulti
          />
        </div>
        }
        {departureAirports &&
        <div className="filter airlines-filter">
          <h5>Departures</h5>
          <Select
            name="departureAirports[]"
            placeholder=""
            value={this.state.departureAirports}
            getOptionValue={(option) => option.airportId}
            getOptionLabel={(option) => option.airportName}
            options={departureAirports}
            onChange={(option) => this.onChange('departureAirports', option)}
            isMulti
          />
        </div>
        }
        {transferAirports &&
        <div className="filter airlines-filter">
          <h5>Transfers</h5>
          <Select
            name="transferAirports[]"
            placeholder=""
            value={transferAirports}
            getOptionValue={(option) => option.airportId}
            getOptionLabel={(option) => option.airportName}
            options={transferAirports}
            onChange={(option) => this.onChange('transferAirports', option)}
            isMulti
          />
        </div>
        }
      </Fragment>
    );
  }
}

FilterSelect.propTypes = {
  airlines: PropTypes.array,
  transferAirports: PropTypes.array,
  arrivalAirports: PropTypes.array,
  departureAirports: PropTypes.array,
  applyFilters: PropTypes.func
}

export default FilterSelect;
