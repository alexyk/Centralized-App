import React from 'react';
import PropTypes from 'prop-types';
import InputRange from 'react-input-range';

import './style.css';

const NumberRangeSlider = ({ minValue, maxValue, value, minLabel, maxLabel, onChange }) => {
  return (
    <div className="number-range-slider">
      <InputRange
        minValue={minValue}
        maxValue={maxValue}
        value={value}
        onChange={onChange} />
      <div className="labels">
        <label>{minLabel}</label>
        <label>{maxLabel}</label>
      </div>
    </div>
  );
};

NumberRangeSlider.propTypes = {
  minLabel: PropTypes.string,
  maxLabel: PropTypes.string,
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
  value: PropTypes.object,
  onChange: PropTypes.func,
};

export default NumberRangeSlider;

