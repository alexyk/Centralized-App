import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import ProfileFlexContainer from '../flexContainer/ProfileFlexContainer';
import { Config } from '../../../config';
import HotelIcon from '../../../styles/images/icon-hotel.png';

import '../../../styles/css/components/profile/dashboard/dashboard-trips.css';

function DashboardTripRow(props) {
  const getHostName = (name) => {
    if (name.length <= 50) {
      return name;
    }
    return `${name.substring(0, 50)}...`;
  };

  const extractDatesData = (trip) => {
    const startDateMoment = moment(trip.displayStartDate, 'DD MMM, YYYY');
    const endDateMoment = moment(trip.displayEndDate, 'DD MMM, YYYY');

    const checkIn = {
      day: startDateMoment.format('DD'),
      year: startDateMoment.format('YYYY'),
      month: startDateMoment.format('MMM').toLowerCase()
    };

    const checkOut = {
      day: endDateMoment.format('D'),
      year: endDateMoment.format('YYYY'),
      month: endDateMoment.format('MMM').toLowerCase()
    };

    return { checkIn, checkOut };
  };

  const dates = extractDatesData(props.trip);

  return (
    <ProfileFlexContainer styleClass={`flex-container-row ${props.styleClass}`}>
      <div className="flex-row-child dashboard-image">
        <img className="image-host" src={`${Config.getValue('imgHost')}${props.trip.userImage}`} alt="user-profile" />
      </div>
      <div className="flex-row-child dashboard-host">
        <img className="icon" src={HotelIcon} alt="hotel" />
        <div className="content-row">
          <div className="host-name">{getHostName(props.trip.hostName)}</div>
          <div>{props.trip.listingName}</div>
        </div>
      </div>
      <div className="flex-row-child dashboard-dates">
        <span className="icon-calendar icon" />
        <div className="content-row">
          <span className="date-in-day">{dates.checkIn.day}</span> {dates.checkIn.month}, {dates.checkIn.year} <i aria-hidden="true" className="fa fa-long-arrow-right" /> <span className="date-out-day">{dates.checkOut.day}</span> {dates.checkOut.month}, {dates.checkOut.year}
        </div>
      </div>
      <div className="flex-row-child dashboard-status">
        {
          <span className="status">{props.capitalize(props.trip.status != null && props.trip.status.length > 0 ? props.trip.status : 'PENDING')}</span>
        }
        <span>&nbsp;</span>
        {props.trip.status && props.trip.status.toUpperCase() === 'FAILED' &&
          <span className="icon-question" title={props.trip.error ? props.trip.error : 'Transaction failed.'}></span>
        }
        {props.trip.status && props.trip.status.toUpperCase() === 'DONE' &&
          <div className="reference">Reference No.: {props.trip.booking_id}</div>
        }
      </div>
    </ProfileFlexContainer>
  );
}

DashboardTripRow.propTypes = {
  trip: PropTypes.object,
  capitalize: PropTypes.func,
  styleClass: PropTypes.string
};

export default DashboardTripRow;