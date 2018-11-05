import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import DatePicker from '../../../common/datepicker';
import { asyncSetStartDate, asyncSetEndDate } from '../../../../actions/searchDatesInfo';
import { setFlightRouting } from '../../../../actions/airTicketsSearchInfo';

class AirTicketsDatepickerWrapper extends Component {
  constructor(props) {
    super(props);

    this.chooseRoundtrip = this.chooseRoundtrip.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(asyncSetStartDate(moment()));
    this.props.dispatch(asyncSetEndDate(moment().add(1, 'days')));
  }

  chooseRoundtrip() {
    this.props.dispatch(setFlightRouting('2'));
  }

  render() {
    return (
      <Fragment>
        <DatePicker
          minDate={moment()}
          enableRanges={this.props.airTicketsSearchInfo.flightRouting === '2'}
          intervalStartText="Departure"
          intervalEndText="Arrival"
          enableSameDates
        />
        <div className={`choose-roundtrip ${this.props.airTicketsSearchInfo.flightRouting === '2' ? 'hide-single' : 'show-single'}`}>
          <div>
            <span className="icon-arrow-right arrow"></span>
          </div>
          <div className="roundtrip" onClick={this.chooseRoundtrip}>Choose roundtrip</div>
        </div>
      </Fragment>
    );
  }
}

AirTicketsDatepickerWrapper.propTypes = {
  // Redux props
  dispatch: PropTypes.func,
  airTicketsSearchInfo: PropTypes.object
};

const mapStateToProps = (state) => {
  const { airTicketsSearchInfo } = state;

  return {
    airTicketsSearchInfo
  };
};

export default connect(mapStateToProps)(AirTicketsDatepickerWrapper);
