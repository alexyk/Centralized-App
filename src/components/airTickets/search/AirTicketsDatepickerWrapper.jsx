import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import DatePicker from '../../common/datepicker';
import { asyncSetEndDate } from '../../../actions/searchDatesInfo';
import { getStartDate, getEndDate } from '../../../selectors/searchDatesInfo';
import MultiStopsPopup from './common/multiStopsPopup';
import { selectMultiStopsDestinations } from '../../../selectors/airTicketsSearchSelector';

import '../../../styles/css/components/airTickets/search/air-tickets-datepicker-wrapper.css';
import { selectFlightRouting } from '../../../selectors/airTicketsSearchSelector';

class AirTicketsDatepickerWrapper extends Component {
  componentDidMount() {
    this.validateDates();
  }

  componentDidUpdate() {
    this.validateDates();
  }

  validateDates() {
    const { startDate, endDate } = this.props;
    if (endDate.isBefore(startDate, 'day') || (endDate.isAfter(startDate, 'day') && this.props.flightRouting === '1')) {
      this.props.dispatch(asyncSetEndDate(moment(startDate)));
    }
  }

  render() {
    const { flightRouting } = this.props;

    return (
      <div className="check">
        <DatePicker
          minDate={moment()}
          enableRanges={flightRouting === '2'}
          intervalStartText="Departure"
          intervalEndText="Return"
          enableSameDates
        />

        {flightRouting === '3' &&
          <MultiStopsPopup showMultiStopsPopup={this.props.openMultiStopsPopup()} closeMultiStopsPopup={this.props.closeMultiStopsPopup} />
        }
      </div>
    );
  }
}

AirTicketsDatepickerWrapper.propTypes = {
  openMultiStopsPopup: PropTypes.func,
  closeMultiStopsPopup: PropTypes.func,

  // Redux props
  dispatch: PropTypes.func,
  flightRouting: PropTypes.string,
  startDate: PropTypes.object,
  endDate: PropTypes.object
};

const mapStateToProps = (state) => {
  const { airTicketsSearchInfo, searchDatesInfo } = state;

  return {
    flightRouting: selectFlightRouting(airTicketsSearchInfo),
    startDate: getStartDate(searchDatesInfo),
    endDate: getEndDate(searchDatesInfo),
    multiStopsDestinations: selectMultiStopsDestinations(airTicketsSearchInfo)
  };
};

export default connect(mapStateToProps)(AirTicketsDatepickerWrapper);
