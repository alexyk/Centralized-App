import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import NoEntriesMessage from '../../common/messages/NoEntriesMessage';
import MyGuestsReservations from './MyGuestsReservations';
import ProfileFlexContainer from '../flexContainer/ProfileFlexContainer';

import '../../../styles/css/components/profile/guests/homes-guests-table.css';

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
    <React.Fragment>
      {props.reservations.map(reservation => {
        return (
          <Fragment key={reservation.id}>
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
            <MyGuestsReservations
              reservation={reservation}
              styleClass="guests-flex-container"
              onReservationSelect={props.onReservationSelect}
              onReservationAccept={props.onReservationAccept}
              onReservationReject={props.onReservationReject}
              onReservationCancel={props.onReservationCancel}
            />
          </Fragment>
        );
      })}
    </React.Fragment>
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