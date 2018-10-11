import DateRangePicker from 'react-bootstrap-daterangepicker';
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import AirTicketsSearchBarDatePickerHidePreview from './AirTicketsSearchBarDatePickerHidePreview';

function AirTicketsSearchBarDatePicker(props) {
  let { departureDate, arrivalDate } = props;
  
  const datesDetails = {
    departureDateDay: departureDate.format('DD'),
    departureDateMonth: departureDate.format('MMM').toUpperCase(),
    departureDateDayOfWeek: departureDate.format('ddd').toUpperCase(),
    arrivalDateDay: arrivalDate.format('DD'),
    arrivalDateMonth: arrivalDate.format('MMM').toUpperCase(),
    arrivalDateDayOfWeek: arrivalDate.format('ddd').toUpperCase()
  };

  const pickerProps = {
    departureDate,
    arrivalDate,
  };

  return (
    <DateRangePicker
      autoUpdateInput={true}
      onApply={props.onApply}
      isInvalidDate={props.isInvalidDate}
      autoApply={true}
      minDate={moment().format('DD/MM/YYYY')}
      maxDate={moment().add(12, 'months').format('DD/MM/YYYY')}
      locale={{ format: 'DD/MM/YYYY' }}
      {...pickerProps}
      {...props}>
      <div>
        <AirTicketsSearchBarDatePickerHidePreview datesDetails={datesDetails} />
      </div>
    </DateRangePicker>
  );
}

AirTicketsSearchBarDatePicker.propTypes = {
  departureDate: PropTypes.any,
  arrivalDate: PropTypes.any,
  isInvalidDate: PropTypes.bool,
  onApply: PropTypes.func,
};

export default AirTicketsSearchBarDatePicker;