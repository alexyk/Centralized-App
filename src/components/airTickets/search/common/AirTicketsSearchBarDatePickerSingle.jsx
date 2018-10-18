import DateRangePicker from 'react-bootstrap-daterangepicker';
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import AirTicketsSearchBarDatePickerHidePreviewSingle from './AirTicketsSearchBarDatePickerHidePreviewSingle';

function AirTicketsSearchBarDatePickerSingle(props) {
  let { departureDate } = props;
  
  const datesDetails = {
    departureDateDay: departureDate.format('DD'),
    departureDateMonth: departureDate.format('MMM').toUpperCase(),
    departureDateDayOfWeek: departureDate.format('ddd').toUpperCase()
  };

  const pickerProps = {
    departureDate
  };

  return (
    <DateRangePicker
      autoUpdateInput={true}
      onApply={props.onApply}
      autoApply={true}
      minDate={moment().format('DD/MM/YYYY')}
      maxDate={moment().add(12, 'months').format('DD/MM/YYYY')}
      locale={{ format: 'DD/MM/YYYY' }}
      singleDatePicker={true}
      {...pickerProps}
      {...props}
    >
      <div className="air-tickets-date-range-picker-container">
        <AirTicketsSearchBarDatePickerHidePreviewSingle datesDetails={datesDetails} />
      </div>
    </DateRangePicker>
  );
}

AirTicketsSearchBarDatePickerSingle.propTypes = {
  departureDate: PropTypes.any,
  arrivalDate: PropTypes.any,
  onApply: PropTypes.func
};

export default AirTicketsSearchBarDatePickerSingle;