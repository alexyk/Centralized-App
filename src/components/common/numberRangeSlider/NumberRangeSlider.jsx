import React from 'react';
import PropTypes from 'prop-types';
import InputRange from 'react-input-range';

import './style.css';

const NumberRangeSlider = ({ value, onChange }) => {
  return (
    <div className="number-range-slider">
      <InputRange
        formatLabel={value => `$${value}`}
        maxValue={5000}
        minValue={0}
        value={value}
        onChange={onChange} />
      <div className="labels">
        <label>${value.min}</label>
        <label>${value.max}</label>
      </div>
    </div>
  );
};

NumberRangeSlider.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func,
};

export default NumberRangeSlider;

