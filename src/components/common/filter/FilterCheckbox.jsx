import PropTypes from 'prop-types';
import React from 'react';
// import '../../../styles/css/components/profile/listings/listing-facilities.css';

const FilterCheckbox = ({ id, text, checked }) => (
  <div className="key">
    <input type="checkbox" name={id} checked={checked} />
    <label htmlFor={id}>{text}</label>
  </div>
);

FilterCheckbox.propTypes = {
  id: PropTypes.string,
  text: PropTypes.string,
  checked: PropTypes.bool,
};

export default FilterCheckbox;