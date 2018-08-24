import DateRangePicker from 'react-bootstrap-daterangepicker';
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

function SearchBarDatePicker(props) {
  const { startDate, endDate } = props;
  const start = (startDate && startDate.format('DD/MM/YYYY')) || '';
  let end = (endDate && endDate.format('DD/MM/YYYY')) || '';

  if (end && start === end) {
    end = endDate.add(1, 'days').format('DD/MM/YYYY');
  }

  let label = start + ' - ' + end;

  const pickerProps = {
    startDate,
    endDate,
  };

  return (
    <div>
      <span>Check in &amp; Check out</span>
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
        <input
          className="datepicker-input"
          readOnly
          required="required"
          autoComplete="off"
          placeholder="Select date"
          name="stay"
          value={label}
        />
      </DateRangePicker>
    </div>
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