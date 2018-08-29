import DateRangePicker from 'react-bootstrap-daterangepicker';
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import SearchBarDatePickerHidePreview from './SearchBarDatePickerHidePreview';

function SearchBarDatePicker(props) {
  let { startDate, endDate } = props;
  const start = (startDate && startDate.format('DD/MM/YYYY')) || '';
  let end = (endDate && endDate.format('DD/MM/YYYY')) || '';

  if (end && start === end) {
    endDate = endDate.add(1, 'days');
  }

  const datesDetails = {
    startDateDay: startDate.format('DD'),
    startDateMonth: startDate.format('MMM').toUpperCase(),
    startDateDayOfWeek: startDate.format('ddd').toUpperCase(),
    endDateDay: endDate.format('DD'),
    endDateMonth: endDate.format('MMM').toUpperCase(),
    endDateDayOfWeek: endDate.format('ddd').toUpperCase()
  };

  const pickerProps = {
    startDate,
    endDate,
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
        <SearchBarDatePickerHidePreview datesDetails={datesDetails} />
      </div>
    </DateRangePicker>
  );
}

SearchBarDatePicker.propTypes = {
  startDate: PropTypes.any,
  endDate: PropTypes.any,
  isInvalidDate: PropTypes.bool,
  nights: PropTypes.number,
  onApply: PropTypes.func,
};

export default SearchBarDatePicker;