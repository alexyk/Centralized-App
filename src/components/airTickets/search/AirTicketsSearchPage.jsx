import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import AirTicketsSearchBar from './AirTicketsSearchBar';

class AirTicketsSearchPage extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  populateSearchBar() {
    
  }

  render() {
    return (
      <div className="container">
        <AirTicketsSearchBar />
      </div>
    );
  }
}

AirTicketsSearchPage.propTypes = {

};

export default withRouter(AirTicketsSearchPage);