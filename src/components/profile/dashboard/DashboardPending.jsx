import PropTypes from 'prop-types';
import React from 'react';
import NoEntriesMessage from '../../common/messages/NoEntriesMessage';
import ProfileFlexContainer from '../flexContainer/ProfileFlexContainer';
import DashboardTripRow from './DashboardTripRow';
import DashboardReservationRow from './DashboardReservationRow';

function DashboardPending(props) {

  const renderReservations = () => {
    if (!props.reservations) {
      return;
    }

    if (props.reservations.length === 0) {
      return (
        <NoEntriesMessage text="There are no reservation requests. If someone requests to book your property, it will appear here." />
      );
    }

    return (
      props.reservations.map(reservation => {
        return (
          <DashboardReservationRow
            key={reservation.id}
            styleClass="dashboard-flex-reservations-container"
            capitalize={capitalize}
            reservation={reservation}
          />
        );
      })
    );
  };

  const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

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
      props.trips.map(trip => {
        return (
          <DashboardTripRow
            key={trip.id}
            styleClass="dashboard-flex-trips-container"
            capitalize={capitalize}
            trip={trip}
          />
        );
      })
    );
  };

  return (
    <section id="profile-dashboard-pending">
      <div className="container">
        <h2>Latest Reservation Requests</h2>
        <hr className="profile-line" />
        <ProfileFlexContainer styleClass="flex-container-header dashboard-flex-reservations-container">
          <div className="tablet-col-1">
            <div className="dashboard-image" />
            <div className="dashboard-booker">Booker</div>
          </div>
          <div className="tablet-col-2">
            <div className="dashboard-dates">Trip Dates</div>
            <div className="dashboard-nights">Nights</div>
            <div className="dashboard-status">Status</div>
            <div className="dashboard-date">Date</div>
          </div>
        </ProfileFlexContainer>
        {renderReservations()}
      </div>

      <div className="container">
        <h2>Latest Trips</h2>
        <hr className="profile-line" />
        <ProfileFlexContainer styleClass="flex-container-header dashboard-flex-trips-container">
          <div className="dashboard-image" />
          <div className="dashboard-host">Host</div>
          <div className="dashboard-dates">Trip Dates</div>
          <div className="dashboard-status">Status</div>
        </ProfileFlexContainer>
        {renderTrips()}
      </div>
    </section>
  );
}

DashboardPending.propTypes = {
  reservations: PropTypes.array,
  trips: PropTypes.array
};

export default DashboardPending;