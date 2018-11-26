import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ProfileFlexContainer from '../flexContainer/ProfileFlexContainer';

import '../../../styles/css/components/profile/airTickets/air-ticket.css';

class AirTicket extends Component {
  render() {
    const { ticket } = this.props;

    console.log(ticket);

    return (
      <ProfileFlexContainer styleClass={`flex-container-row ${this.props.styleClass}`}>
        
      </ProfileFlexContainer>
    );
  }
}

AirTicket.propTypes = {
  ticket: PropTypes.object,
  styleClass: PropTypes.string
};

export default AirTicket;
