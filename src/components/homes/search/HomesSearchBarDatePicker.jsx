import DateRangePicker from 'react-bootstrap-daterangepicker';
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

function HomesSearchBarDatePicker(props) {
  const { startDate, endDate } = props;
  const start = (startDate && startDate.format('DD/MM/YYYY')) || '';
  const end = (endDate && endDate.format('DD/MM/YYYY')) || '';

  let label = '';
  label = start + ' - ' + end;
  if (start === end) {
    label = start;
  }

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

HomesSearchBarDatePicker.propTypes = {
  startDate: PropTypes.any,
  endDate: PropTypes.any,
  isInvalidDate: PropTypes.bool,
  nights: PropTypes.number,
  onApply: PropTypes.func,
};

export default HomesSearchBarDatePicker;