import React from 'react';
import PropTypes from 'prop-types';
import NoEntriesMessage from '../common/NoEntriesMessage';
import ProfileFlexContainer from '../flexContainer/ProfileFlexContainer';
import HotelTripsTableRow from './HotelTripsTableRow';

import './hotel-trips-table.css';

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
      props.trips.map((trip, i) => {
        return (
          <HotelTripsTableRow
            key={i}
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
        <div className="flex-header-child trips-image-width"></div>
        <div className="flex-header-child trips-host-width">Host</div>
        <div className="flex-header-child trips-property-width">Property</div>
        <div className="flex-header-child trips-dates-width">Dates</div>
        <div className="flex-header-child trips-actions-width">Actions</div>
        <div className="flex-header-child trips-status-width">Status</div>
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