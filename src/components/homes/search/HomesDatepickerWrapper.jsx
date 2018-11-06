import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import DatePicker from '../../common/datepicker';
import { asyncSetEndDate } from '../../../actions/searchDatesInfo';

class HomesDatepickerWrapper extends Component {
  componentDidMount() {
    this.validateDates();
  }

  validateDates() {
    const { startDate, endDate } = this.props.searchDatesInfo;
    if (endDate.isSameOrBefore(startDate, 'day')) {
      this.props.dispatch(asyncSetEndDate(moment(startDate).add(1, 'days')));
    }
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

HomesDatepickerWrapper.propTypes = {
  // Redux props
  dispatch: PropTypes.func,
  searchDatesInfo: PropTypes.object
};

const mapStateToProps = (state) => {
  const { searchDatesInfo } = state;

  return {
    searchDatesInfo
  };
};

export default connect(mapStateToProps)(HomesDatepickerWrapper);
