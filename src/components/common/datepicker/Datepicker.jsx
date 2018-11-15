import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import DateInput from './date-input';
import { connect } from 'react-redux';
import { asyncSetStartDate, asyncSetEndDate } from '../../../actions/searchDatesInfo.js';

import 'react-datepicker/dist/react-datepicker.css';
import './style.css';

class Datepicker extends Component {
  constructor(props) {
    super(props);

    this.openEndDatePicker = this.openEndDatePicker.bind(this);
    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleChangeEnd = this.handleChangeEnd.bind(this);
    this.selectValidDates = this.selectValidDates.bind(this);
  }

  handleChangeStart(date) {
    this.props.dispatch(asyncSetStartDate(date)).then(() => {
      const { startDate, endDate, enableRanges } = this.props;
      if (enableRanges && endDate.isSameOrBefore(startDate, 'day')) {
        this.props.dispatch(asyncSetEndDate(moment(startDate))).then(() => {
          this.openEndDatePicker();
        });
      } else {
        this.openEndDatePicker(date);
      }

      this.selectValidDates();
    });
  }

  handleChangeEnd(date) {
    this.props.dispatch(asyncSetEndDate(date)).then(() => {
      if (date.isBefore(this.props.startDate, 'day')) {
        this.props.dispatch(asyncSetStartDate(date));
        this.openEndDatePicker();
        this.selectValidDates();
      }
    });
  }

  openEndDatePicker() {
    if (this.props.enableRanges) {
      this.enddatepicker.setOpen(true);
    }
  }

  selectValidDates() {
    const { startDate, endDate, enableRanges, enableSameDates } = this.props;
    if (!enableRanges) {
      return;
    }

    if (enableSameDates && endDate.isBefore(startDate)) {
      this.props.dispatch(asyncSetEndDate(moment(startDate)));
    } else if (!enableSameDates && endDate.isSameOrBefore(startDate, 'day')) {
      this.props.dispatch(asyncSetEndDate(moment(startDate).add(1, 'days')));
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
    const { startDate, endDate, intervalStartText, intervalEndText, enableRanges } = this.props;
    const excludedDates = this.getExcludedDates();
    const isMobile = window.innerWidth < 1024;
    const monthsToShow = this.props.monthsToShow ? this.props.monthsToShow : (isMobile ? 1 : 2);

    return (
      <div className="common-datepicker">
        <DatePicker
          popperClassName="check-in-popper"
          ref={(c) => (this.startdatepicker = c)}
          customInput={<DateInput text={intervalStartText} date={this.props.startDate} calendar={this.startdatepicker} />}
          selected={startDate}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          onChange={this.handleChangeStart}
          excludeDates={this.props.excludedDates}
          withPortal={isMobile}
          monthsShown={monthsToShow}
          fixedHeight
          {...this.props}
        />

        {enableRanges && <span className="icon-arrow-right arrow"></span>}

        {enableRanges &&
          <DatePicker
            popperClassName="check-out-popper"
            ref={(c) => (this.enddatepicker = c)}
            customInput={<DateInput text={intervalEndText} date={endDate} calendar={this.enddatepicker} />}
            selected={endDate}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            onChange={this.handleChangeEnd}
            excludeDates={excludedDates}
            withPortal={isMobile}
            monthsShown={monthsToShow}
            fixedHeight
            {...this.props}
          />
        }
      </div>
    );
  }
}

Datepicker.defaultProps = {
  intervalStartText: 'Check-in',
  intervalEndText: 'Check-out',
  enableRanges: false,
  enableSameDates: false,
  excludedDates: []
};

const mapStateToProps = (state) => ({
  startDate: state.searchDatesInfo.startDate,
  endDate: state.searchDatesInfo.endDate
});

export default connect(mapStateToProps)(Datepicker);
