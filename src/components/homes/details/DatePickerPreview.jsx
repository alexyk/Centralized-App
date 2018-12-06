import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import '../../../styles/css/components/common/search/search-bar-date-picker-hide-preview.css';
import '../../../styles/css/components/common/home/date-picker-preview.css';

function DatePickerPreview(props) {
  const { onClick } = props;
  let isMobile = window.innerWidth < 1024;

  if (!props.calendar) {
    return <div className="loader"></div>;
  }

  const excludedDates = [];
  for (let i = 0; i < props.calendar.length; i++) {
    let calendarSlot = props.calendar[i];
    if (calendarSlot.available === false) {
      excludedDates.push(moment(calendarSlot.date, "DD/MM/YYYY"));
    }
  }

  return (<div onClick={onClick ? onClick : null} className="search-bar-date-picker-hide-preview">
    <DatePicker
      customInput={(
        <div>
          <div className="check-in">
            <div>
              <img src="/images/icon-calendar.png" alt="icon-calendar" />
            </div>
            <div className="row-container">
              <p>Check-in</p>
              <div className="date-mon-day">
                <p><span>{props.startDate.format("DD")} </span>{props.startDate.format("MMM, ddd")}</p>
              </div>
            </div>
          </div>
        </div>)}
      dateFormat="DD MMM, ddd"
      minDate={moment()}
      maxDate={moment().add(365, "days")}
      showDisabledMonthNavigation
      selectsStart
      excludeDates={excludedDates}
      selected={props.startDate}
      startDate={props.startDate}
      endDate={props.endDate}
      onChange={props.handleChangeStart}
      withPortal={isMobile}
      popperModifiers={{
        preventOverflow: {
          enabled: true,
          escapeWithReference: false,
          boundariesElement: 'viewport'
        }
      }} />

    <div className="arrow-icon-container">
      <img src="/images/icon-arrow.png" alt="icon-arrow" />
    </div>

    <DatePicker
      customInput={(
        <div>
          <div className="check-out">
            <div>
              <img src="/images/icon-calendar.png" alt="icon-calendar" />
            </div>
            <div className="row-container">
              <p>Check-out</p>
              <p className="date-mon-day">
                <p><span className="date-color">{props.endDate.format("DD")} </span>{props.endDate.format("MMM, ddd")}</p>
              </p>
            </div>
          </div>
        </div>)}
      dateFormat="DD MMM, ddd"
      minDate={moment()}
      maxDate={moment().add(365, "days")}
      showDisabledMonthNavigation
      selectsEnd
      excludeDates={excludedDates}
      selected={props.endDate}
      startDate={props.startDate}
      endDate={props.endDate}
      onChange={props.handleChangeEnd}
      withPortal={isMobile}
      popperPlacement="bottom-end"
      popperClassName="react-datepicker-popper-custom"
      popperModifiers={{
        preventOverflow: {
          enabled: true,
          escapeWithReference: false,
          boundariesElement: 'viewport'
        }
      }} />
  </div>);
}

export default DatePickerPreview;
