import PropTypes from 'prop-types';
import React from 'react';

function FilterStarCheckbox(props) {
  return (
    <div>
      <span onClick={() => props.handleToggleStar(props.value)} className={`star ${props.checked ? 'active' : ''}`}>
        {props.text}
      </span>
    </div>
  );
}

FilterStarCheckbox.propTypes = {
  checked: PropTypes.bool,
  text: PropTypes.string
};

export default FilterStarCheckbox;