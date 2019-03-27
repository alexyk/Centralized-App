import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import InputRange from 'react-input-range';
import {TimeRangeSlider} from 'react-time-range-slider'

class FilterSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      waitingTimeRange: {},
      journeyTimeRange: {},
      departureTime: {},
      arrivalTime: {},
      priceRange: {}
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(name, value) {
    this.setState({
      [name]: value
    },  () => { this.props.applyFilters(this.state)});
  }

  render () {
    const { waitingTimeRange } = this.state;

    return (
      <Fragment>
        <InputRange
          maxValue={20}
          minValue={0}
          value={this.state.arrivalTime}
          onChange={value => this.setState({ value })} />

          <TimeRangeSlider
            maxValue={20}
            minValue={0}
            value={this.state.departureTime}
            onChange={value => this.setState({ value })} />
        <TimeRangeSlider
          maxValue={20}
          minValue={0}
          value={this.state.journeyTimeRange}
          onChange={value => this.setState({ value })} />
      <InputRange
        maxValue={20}
        minValue={0}
          value={this.state.priceRange}
        onChange={value => this.setState({ value })} />
      <TimeRangeSlider
        maxValue={20}
        minValue={0}
        value={this.state.waitingTimeRangeq}
        onChange={value => this.setState({ value })} />
    </Fragment>
    );
  }
}

FilterSelect.PropTypes = {
  waitingTimeRange: PropTypes.object,
  journeyTimeRange: PropTypes.object,
  departureTime: PropTypes.object,
  arrivalTime: PropTypes.object,
  priceRange: PropTypes.object,
  applyFilters: PropTypes.object
}
