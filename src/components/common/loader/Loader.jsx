import React from 'react';
import PropTypes from 'prop-types';

import './style.css';

const Loader = ({ minWidth, minHeight }) => {

  return (
    <div className="container-loader-wrapper" style={{ minWidth, minHeight }}>
      <div className="container-loader"></div>
    </div>
  );
};

Loader.defaultProps = {
  minWidth: '150px',
  minHeight: '0',
};

Loader.propTypes = {
  minWidth: PropTypes.string,
  minHeight: PropTypes.string,
};

export default Loader;
