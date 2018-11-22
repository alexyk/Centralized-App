import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import NoEntriesMessage from '../../common/messages/NoEntriesMessage';
import MyGuestsReservations from './MyGuestsReservations';
import ProfileFlexContainer from '../flexContainer/ProfileFlexContainer';

import '../../../styles/css/components/profile/guests/homes-guests-table.scss';

function MyGuestsTable(props) {

  if (!props.reservations) {
    return;
  }

  if (props.reservations.length === 0) {
    return (
      <NoEntriesMessage text="There are no reservation requests. If someone requests to book your property, it will appear here." />
    );
  }

  return (
    <Fragment>
      <ProfileFlexContainer styleClass="flex-container-header guests-flex-container">
        <div className="tablet-col-1">
          <div className="guests-image" />
          <div className="guests-guest">Guest</div>
        </div>
        <div className="tablet-col-2">
          <div className="guests-date-location">Dates &amp; Location</div>
          <div className="guests-price">Price</div>
          <div className="guests-actions">Actions</div>
          <div className="guests-status">Status</div>
        </div>
      </ProfileFlexContainer>
      {props.reservations.map(reservation => {
        return (
          <MyGuestsReservations
            key={reservation.id}
            reservation={reservation}
            styleClass="guests-flex-container"
            onReservationSelect={props.onReservationSelect}
            onReservationAccept={props.onReservationAccept}
            onReservationReject={props.onReservationReject}
            onReservationCancel={props.onReservationCancel}
          />
        );
      })}
    </Fragment>
  );
}

MyGuestsTable.propTypes = {
  reservations: PropTypes.array,
  onReservationAccept: PropTypes.func,
  onReservationCancel: PropTypes.func,
  onReservationReject: PropTypes.func,
  onReservationSelect: PropTypes.func
};

export default MyGuestsTable;