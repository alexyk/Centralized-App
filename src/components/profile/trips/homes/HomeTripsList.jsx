import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import NoEntriesMessage from '../../../common/messages/NoEntriesMessage';
import ProfileFlexContainer from '../../flexContainer/ProfileFlexContainer';
import HomeTrip from './HomeTrip';

function HomeTripsList(props) {

  const renderTrips = () => {
    if (!props.trips) {
      return;
    }

    if (props.trips.length === 0) {
      return (
        <HomeTrip
            key={'123456789'}
            trip={[]}
            tomorrow={moment().add(1, 'days').format('DD/MM/YYYY')}
            afterTomorrow={moment().add(2, 'days').format('DD/MM/YYYY')}
            styleClass="trips-flex-container"
            onTripSelect={props.onTripSelect}
            handleCancelReservation={props.handleCancelReservation}
          />
      );
    }

    return (
      props.trips.map((trip) => {
        return (
          <HomeTrip
            key={trip.id}
            trip={trip}
            tomorrow={moment().add(1, 'days').format('DD/MM/YYYY')}
            afterTomorrow={moment().add(2, 'days').format('DD/MM/YYYY')}
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

HomeTripsList.propTypes = {
  trips: PropTypes.array,
  handleCancelReservation: PropTypes.func,
  onTripSelect: PropTypes.func
};

export default HomeTripsList;
