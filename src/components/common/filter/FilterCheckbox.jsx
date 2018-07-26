import PropTypes from 'prop-types';
import React from 'react';
// import '../../../styles/css/components/profile/listings/listing-facilities.css';

const FilterCheckbox = (props) => (
  <div className="key">
    <input type="checkbox" name={props.id} checked={props.checked} />
    <label htmlFor={props.id}>{props.text}</label>
    {/* <label className={`filter-check-label${props.checked ? ' active' : ''}`}>
      <span className="filter-check"></span>
      <span className="filter-check-text">{props.text}</span>
      <span className="filter-check-count">{props.count}</span>
    </label> */}
  </div>
);

FilterCheckbox.propTypes = {
  checked: PropTypes.bool,
  text: PropTypes.string,
  count: PropTypes.number
};

export default FilterCheckbox;