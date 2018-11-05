import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import DatePicker from '../../common/datepicker';
import { asyncSetStartDate, asyncSetEndDate } from '../../../actions/searchDatesInfo';

class HotelsDatepickerWrapper extends Component {
  componentDidMount() {
    this.props.dispatch(asyncSetStartDate(moment().add(1, 'days')));
    this.props.dispatch(asyncSetEndDate(moment().add(2, 'days')));
  }

  render() {
    return (
      <DatePicker
        minDate={moment().add(1, 'days')}
        enableRanges
      />
    );
  }
}

HotelsDatepickerWrapper.propTypes = {
  // Redux props
  dispatch: PropTypes.func
};

export default connect()(HotelsDatepickerWrapper);
