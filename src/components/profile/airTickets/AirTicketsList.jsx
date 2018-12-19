import React from 'react';
import PropTypes from 'prop-types';
import AirTicket from './AirTicket';
import NoEntriesMessage from '../../common/messages/NoEntriesMessage';
import ProfileFlexContainer from '../flexContainer/ProfileFlexContainer';

import '../../../styles/css/components/profile/airTickets/air-tickets-list.css';

function AirTicketsList(props) {

  const renderTickets = () => {
    if (!props.tickets) {
      return;
    }

    if (props.tickets.length === 0) {
      return (
        <NoEntriesMessage text="There are no tickets. If you book ticket, it will appear here." />
      );
    }

    return (
      props.tickets.map((ticket, ticketIndex) => {
        return (
          <AirTicket
            key={ticketIndex}
            ticket={ticket}
            styleClass="ticket-flex-container"
          />
        );
      })
    );
  };

  return (
    <div className="tickets-flex-container">
      <ProfileFlexContainer styleClass="flex-container-header ticket-flex-container">
        <div className="tickets-image"></div>
        <div className="tickets-airports-holder">
          <div className="tickets-airports">Airports</div>
          <div className="tickets-dates">Dates &amp; Times</div>
        </div>
        <div className="tickets-actions">Actions</div>
        <div className="tickets-status">Status</div>
      </ProfileFlexContainer>
      {renderTickets()}
    </div>
  );
}

AirTicketsList.propTypes = {
  tickets: PropTypes.array
};

export default AirTicketsList;