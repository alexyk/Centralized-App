import React from 'react';
import PropTypes from 'prop-types';
import ProfileFlexContainer from '../flexContainer/ProfileFlexContainer';
import { Config } from '../../../config';
import HotelIcon from '../../../styles/images/icon-hotel.png';

import '../../../styles/css/components/profile/dashboard/dashboard-trips.css';
import {parseAccommodationDates} from "../utils/parse-accomodation-dates";
import {parseBookingStatus} from "../utils/parse-booking-status";

const STATUS_TOOLTIP = {
  'COMPLETE': 'Your reservation is complete',
  'PENDING': 'Contact us if status is still Pending after 30 minutes',
  'BOOKING FAILED': 'Your booking failed please contact us',
  'CANCELLED': 'You canceled your reservation'
};

function DashboardTripRow(props) {
  const getHostName = props.getHostName || ((name) => {
    if (name.length <= 50) {
      return name;
    }
    return `${name.substring(0, 50)}...`;
  });

  function getDates(){
    try {
      const _parseAccommodationDates = props.parseAccommodationDates || parseAccommodationDates;
      return _parseAccommodationDates(props.trip.arrival_date, props.trip.nights);
    } catch (e) {
      return {
        startDates: {
          date: "",
          month: "",
          year: "",
          day: "",
        },
        endDate: {
          date: "",
          month: "",
          year: "",
          day: "",
        }
      };
    }
  }

  // const status = STATUS[props.trip.status] || STATUS.FAIL;
  const _parseBookingStatus = props.parseBookingStatus || parseBookingStatus;
  const status = _parseBookingStatus(props.trip.status);
  console.log(props.trip.status, status)
  const statusMessage = STATUS_TOOLTIP[status];
  const { hostName, userImage, listingName, error, booking_id } = props.trip;
  var _dates = getDates();


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
          <span className="date-in-day">{_dates.startDate.date}</span> {_dates.startDate.month}, {_dates.startDate.year} <i aria-hidden="true" className="fa fa-long-arrow-right" /> <span className="date-out-day">{_dates.endDate.day}</span> {_dates.endDate.month}, {_dates.endDate.year}
        </div>
      </div>
      <div className="flex-row-child dashboard-status">
        {status &&
          <span className="status" data-testid="status-field">{status}</span>
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
  styleClass: PropTypes.string,
  parseAccommodationDates: PropTypes.func,
  getHostName: PropTypes.func,
};

export default DashboardTripRow;
