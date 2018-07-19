import React, { Component } from 'react';
import BancorConvertWidget from '../external/BancorConvertWidget';

class StompTest extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container">
        <BancorConvertWidget />
      </div>
    );
  }
}

export default StompTest;