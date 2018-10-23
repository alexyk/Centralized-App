import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import './styles.css';
import DateInput from './date-input';
import { connect } from 'react-redux';
import { setStartDate, setEndDate } from '../../../actions/searchInfo.js';

import 'react-datepicker/dist/react-datepicker.css';
import './date-picker-preview.css';
import './search-bar-date-picker-hide-preview.css';

class Datepicker extends Component {
  constructor(props) {
    super(props);

    const startDate = this.getStartDate();
    const endDate = this.getEndDate(startDate);
    props.dispatch(setStartDate(startDate));
    props.dispatch(setEndDate(endDate));
    // this.state = {
    //   startDate,
    //   endDate,
    // };

    this.getStartDate = this.getStartDate.bind(this);
    this.getEndDate = this.getEndDate.bind(this);
    this.openEndDatePicker = this.openEndDatePicker.bind(this);
    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleChangeEnd = this.handleChangeEnd.bind(this);
    this.handleStartDateOnBlur = this.handleStartDateOnBlur.bind(this);
    this.handleEndDateOnBlur = this.handleEndDateOnBlur.bind(this);
  }

  getStartDate() {
    const startDate = moment();
    const { excludedDates } = this.props;

    while (excludedDates.find((date) => { return date.isSame(startDate, 'day'); })) {
      startDate.add(1, 'days');
    }

    return startDate;
  }

  getEndDate(startDate) {
    const { enableRanges, enableSameDates } = this.props;
    if (!enableRanges) {
      return null;
    }

    if (!enableSameDates) {
      return moment(startDate).add(1, 'days');
    }

    return moment(startDate);
  }

  handleChangeStart(date) {
    this.props.dispatch(setStartDate(date));
    // this.setState({
    // startDate: date
    // }, () => {
    const { startDate, endDate, enableRanges } = this.props;
    if (enableRanges && endDate.isSameOrBefore(startDate, 'day')) {
      this.props.dispatch(setEndDate(moment(startDate)));
      // this.setState({ endDate: moment(startDate) }, () => {
          this.openEndDatePicker();
      // });
    } else {
      this.openEndDatePicker(date);
    }
    // });
  }

  handleChangeEnd(date) {
    this.props.dispatch(setEndDate(date));
    // this.setState({
    // endDate: date,
    // }, () => {
    if (date.isBefore(this.props.startDate, 'day')) {
      this.props.dispatch(setStartDate(date));
      // this.setState({ startDate: date }, () => {
          this.openEndDatePicker();
      // });
    }
    // });
  }

  handleStartDateOnBlur(date) {
    const { enableRanges, enableSameDates } = this.props;
    if (!enableRanges) {
      return;
    }

    const { startDate, endDate } = this.props;
    if (enableSameDates && endDate.isBefore(startDate)) {
      this.props.dispatch(setEndDate(moment(startDate)));
      // this.setState({ endDate: moment(startDate) });
    } else if (!enableSameDates && endDate.isSameOrBefore(startDate, 'day')) {
      this.props.dispatch(setEndDate(moment(startDate).add(1, 'days')));
      // this.setState({ endDate: moment(startDate).add(1, 'days') });
    }

    if (date.format) {
      this.openEndDatePicker();
    }
  }

  handleEndDateOnBlur() {
    const { enableRanges, enableSameDates } = this.props;
    if (!enableRanges) {
      return;
    }

    const { startDate, endDate } = this.props;
    if (enableSameDates && endDate.isBefore(startDate)) {
      this.props.dispatch(setEndDate(moment(startDate)));
      // this.setState({ endDate: moment(startDate) });
    } else if (!enableSameDates && endDate.isSameOrBefore(startDate, 'day')) {
      this.props.dispatch(setEndDate(moment(startDate).add(1, 'days')));
      // this.setState({ endDate: moment(startDate).add(1, 'days') });
    }
  }

  openEndDatePicker() {
    if (this.props.enableRanges) {
      setTimeout(() => {
        this.enddatepicker.setOpen(true);
      }, 100);
    }
  }

  getExcludedDates() {
    const { excludedDates, enableSameDates, enableRanges } = this.props;
    const result = excludedDates.slice(0);
    if (enableRanges && !enableSameDates) {
      result.push(this.props.startDate);
    }

    return result;
  }

  render() {
    const excludedDates = this.getExcludedDates();
    let isMobile = window.innerWidth < 1024;
    return (
      <div className="search-bar-date-picker-hide-preview">
        <DatePicker
          ref={(c) => (this.startdatepicker = c)}
          customInput={<DateInput text={'Check-in'} date={this.props.startDate} calendar={this.startdatepicker} />}
          selected={this.props.startDate}
          selectsStart
          startDate={this.props.startDate}
          endDate={this.props.endDate}
          onChange={this.handleChangeStart}
          excludeDates={this.props.excludedDates}
          onBlur={this.handleStartDateOnBlur}
          withPortal={isMobile}
          {...this.props}
        />

        {this.props.enableRanges && <span className="icon-arrow-right arrow"></span>}

        {this.props.enableRanges &&
          <DatePicker
            ref={(c) => (this.enddatepicker = c)}
            customInput={<DateInput text={'Check-out'} date={this.props.endDate} calendar={this.enddatepicker} />}
            selected={this.props.endDate}
            selectsEnd
            startDate={this.props.startDate}
            endDate={this.props.endDate}
            onChange={this.handleChangeEnd}
            excludeDates={excludedDates}
            onBlur={this.handleEndDateOnBlur}
            withPortal={isMobile}
            {...this.props}
          />
        }
      </div>
    );
  }
}

Datepicker.defaultProps = {
  enableRanges: false,
  enableSameDates: false,
  excludedDates: []
};

const mapStateToProps = (state) => ({
  startDate: state.searchInfo.startDate,
  endDate: state.searchInfo.endDate
});

export default connect(mapStateToProps)(Datepicker);
