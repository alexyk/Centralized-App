import React from 'react';
import PropTypes from 'prop-types';

import NoEntriesMessage from '../../common/NoEntriesMessage';
import ProfileFlexContainer from '../../flexContainer/ProfileFlexContainer';
import HotelTripsTableRow from './HotelTripsTableRow';

function HotelTripsTable(props) {

  const renderTrips = () => {
    if (!props.trips) {
      return;
    }

    if (props.trips.length === 0) {
      return (
        <NoEntriesMessage text="There are no upcoming trips. If you book any property, it will appear here." />
      );
    }

    return (
      props.trips.map((trip) => {
        return (
          <HotelTripsTableRow
            key={trip.id}
            trip={trip}
            styleClass="trips-flex-container"
            onTripSelect={props.onTripSelect}
            handleCancelReservation={props.handleCancelReservation}
          />
        );
      })
    );
  };

  return (
    <div>
      <ProfileFlexContainer styleClass="flex-container-header trips-flex-container">
        <div className="tablet-col-1">
          <div className="trips-image"></div>
          <div className="trips-host">Host</div>
        </div>
        <div className="tablet-col-2">
          <div className="trips-location">Location</div>
          <div className="trips-dates">Dates</div>
          <div className="trips-actions">Actions</div>
          <div className="trips-status">Status</div>
        </div>
      </ProfileFlexContainer>
      {renderTrips()}
    </div>
  );
}

HotelTripsTable.propTypes = {
  trips: PropTypes.array,
  handleCancelReservation: PropTypes.func,
  onTripSelect: PropTypes.func
};

export default HotelTripsTable;