import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import ProfileFlexContainer from '../flexContainer/ProfileFlexContainer';
import { Config } from '../../../config';
import HotelIcon from '../../../styles/images/icon-hotel.png';

import '../../../styles/css/components/profile/dashboard/dashboard-trips.scss';

const STATUS = {
  DONE: 'COMPLETE',
  CONFIRMED: 'PENDING',
  FAIL: 'BOOKING FAILED',
  FAILED: 'BOOKING FAILED',
  PENDING: 'PENDING',
  QUEUED: 'PENDING',
  QUEUED_FOR_CONFIRMATION: 'PENDING',
  CANCELLED: 'CANCELLED',
  PENDING_SAFECHARGE_CONFIRMATION: 'PENDING'
};

const STATUS_TOOLTIP = {
  'COMPLETE': 'Your reservation is complete',
  'PENDING': 'Contact us if status is still Pending after 30 minutes',
  'BOOKING FAILED': 'Your booking failed please contact us',
  'CANCELLED': 'You canceled your reservation'
};

function DashboardTripRow(props) {
  const getHostName = (name) => {
    if (name.length <= 50) {
      return name;
    }
    return `${name.substring(0, 50)}...`;
  };

  const extractDatesData = (trip) => {
    const startDateMoment = moment(trip.displayStartDate, 'DD MMM, YYYY').utc();
    const endDateMoment = moment(trip.displayEndDate, 'DD MMM, YYYY').utc();

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
  const status = STATUS[props.trip.status];
  const statusMessage = STATUS_TOOLTIP[status];
  const { hostName, userImage, listingName, error, booking_id } = props.trip; 

  return (
    <ProfileFlexContainer styleClass={`flex-container-row ${props.styleClass}`}>
      <div className="flex-row-child dashboard-image">
        <img className="image-host" src={`${Config.getValue('imgHost')}${userImage}`} alt="user-profile" />
      </div>
      <div className="flex-row-child dashboard-host">
        <img className="icon" src={HotelIcon} alt="hotel" />
        <div className="content-row">
          <div className="host-name">{getHostName(hostName)}</div>
          <div>{listingName}</div>
        </div>
      </div>
      <div className="flex-row-child dashboard-dates">
        <span className="icon-calendar icon" />
        <div className="content-row">
          <span className="date-in-day">{dates.checkIn.day}</span> {dates.checkIn.month}, {dates.checkIn.year} <i aria-hidden="true" className="fa fa-long-arrow-right" /> <span className="date-out-day">{dates.checkOut.day}</span> {dates.checkOut.month}, {dates.checkOut.year}
        </div>
      </div>
      <div className="flex-row-child dashboard-status">
        {status &&
          <span className="status">{status}</span>
        }
        {status &&
          <span className="icon-question" tooltip={error ? error : statusMessage}></span>
        }
        {status && status === 'COMPLETE' &&
          <div>Reference No.: {booking_id}</div>
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