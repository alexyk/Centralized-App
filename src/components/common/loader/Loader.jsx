import React, { Component } from 'react';

import './style.css';

class Loader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { minWidth, minHeight } = this.props;
    return (
      <div className="container-loader-wrapper" style={{ minWidth, minHeight }}>
        <div className="container-loader"></div>
      </div>
    );
  }
}

Loader.defaultProps = {
  minWidth: '150px',
  minHeight: '0',
};

export default Loader;
