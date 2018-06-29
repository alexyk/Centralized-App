import React from 'react';
import Dropdown from './Dropdown';
import Counter from './Counter';
import PropTypes from 'prop-types';

function DropdownCounter(props) {
  const { options, dropdownValue, count, updateDropdown, updateCount } = props;

  return (
    <div>
      <Dropdown
        options={options}
        value={dropdownValue}
        onChange={updateDropdown} />

      <Counter
        name={dropdownValue}
        value={count}
        onChange={updateCount} />
    </div>
  );
}

DropdownCounter.propTypes = {
  options: PropTypes.string,
  dropdownValue: PropTypes.any,
  count: PropTypes.number,
  updateDropdown: PropTypes.func,
  updateCount: PropTypes.func,
};

export default DropdownCounter;