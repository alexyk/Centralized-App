import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import DatePicker from '../../common/datepicker';
import { asyncSetEndDate } from '../../../actions/searchDatesInfo';
import { setFlightRouting } from '../../../actions/airTicketsSearchInfo';

import '../../../styles/css/components/airTickets/search/air-tickets-datepicker-wrapper.css';

class AirTicketsDatepickerWrapper extends Component {
  constructor(props) {
    super(props);

    this.changeFlightRouting = this.changeFlightRouting.bind(this);
  }

  componentDidMount() {
    this.validateDates();
  }

  componentDidUpdate() {
    this.validateDates();
  }

  validateDates() {
    const { startDate, endDate } = this.props.searchDatesInfo;
    if (endDate.isBefore(startDate, 'day') || (endDate.isAfter(startDate, 'day') && this.props.airTicketsSearchInfo.flightRouting === '1')) {
      this.props.dispatch(asyncSetEndDate(moment(startDate)));
    }
  }

  changeFlightRouting(flightRouting) {
    this.props.dispatch(setFlightRouting(flightRouting));
  }

  render() {
    return (
      <div className="check">
        <DatePicker
          minDate={moment()}
          enableRanges={this.props.airTicketsSearchInfo.flightRouting === '2'}
          intervalStartText="Departure"
          intervalEndText="Return"
          enableSameDates
        />
        <div className={`choose-roundtrip${this.props.airTicketsSearchInfo.flightRouting === '2' ? ' hide-single' : ''}`}>
          <span className="icon-arrow-right arrow"></span>
          <div className="roundtrip" onClick={() => this.changeFlightRouting('2')}>
            <span className='icon-calendar'></span>
            <div className="choose-roundtrip-content">
              <div className="text">Choose</div>
              <div className="text">roundtrip</div>
            </div>
          </div>
        </div>
        <div className="close-roundtrip-holder">
          <span className={`close-roundtrip-button${this.props.airTicketsSearchInfo.flightRouting === '1' ? ' hide-close-roundtrip' : ''}`} onClick={() => this.changeFlightRouting('1')} />
        </div>
      </div>
    );
  }
}

AirTicketsDatepickerWrapper.propTypes = {
  // Redux props
  dispatch: PropTypes.func,
  airTicketsSearchInfo: PropTypes.object,
  searchDatesInfo: PropTypes.object
};

const mapStateToProps = (state) => {
  const { airTicketsSearchInfo, searchDatesInfo } = state;

  return {
    airTicketsSearchInfo,
    searchDatesInfo
  };
};

export default connect(mapStateToProps)(AirTicketsDatepickerWrapper);
