import React from 'react';
import PropTypes from 'prop-types';
import AirTicket from './AirTicket';
import NoEntriesMessage from '../../common/messages/NoEntriesMessage';
import ProfileFlexContainer from '../flexContainer/ProfileFlexContainer';

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
            styleClass="tickets-flex-container"
          />
        );
      })
    );
  };

  return (
    <div>
      <ProfileFlexContainer styleClass="flex-container-header tickets-flex-container">
        <div className="tablet-col-1">
          <div className="tickets-image"></div>
          <div className="tickets-host">Host</div>
        </div>
        <div className="tablet-col-2">
          <div className="tickets-location">Location</div>
          <div className="tickets-dates">Dates</div>
          <div className="tickets-actions">Actions</div>
          <div className="tickets-status">Status</div>
        </div>
      </ProfileFlexContainer>
      {renderTickets()}
    </div>
  );
}

AirTicketsList.propTypes = {
  tickets: PropTypes.array
};

export default AirTicketsList;