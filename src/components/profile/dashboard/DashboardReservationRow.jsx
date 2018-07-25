import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import ProfileFlexContainer from '../flexContainer/ProfileFlexContainer';
import { Config } from '../../../config';

import '../../../styles/css/components/profile/dashboard/dashboard-reservations.css';

function DashboardReservationRow(props) {
  const extractDatesData = (reservation) => {
    const startDateMoment = moment(reservation.startDate);
    const endDateMoment = moment(reservation.endDate);

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

  const dates = extractDatesData(props.reservation);

  return (
    <ProfileFlexContainer styleClass={`flex-container-row ${props.styleClass}`}>
      <div className="tablet-col-1">
        <div className="flex-row-child dashboard-image">
          <img className="image-host" src={`${Config.getValue('imgHost')}${props.reservation.userImage}`} alt="booker" />
        </div>
        <div className="flex-row-child dashboard-booker">
          <div className="content-row">
            <div className="booker-name">{props.reservation.guestName}</div>
            <div>{props.reservation.listingName}</div>
          </div>
        </div>
      </div>
      <div className="tablet-col-2">
        <div className="flex-row-child dashboard-dates">
          <span className="icon-calendar icon" />
          <div className="content-row">
            <span className="date-in-day">{dates.checkIn.day}</span> {dates.checkIn.month}, {dates.checkIn.year} <i aria-hidden="true" className="fa fa-long-arrow-right" /> <span className="date-out-day">{dates.checkOut.day}</span> {dates.checkOut.month}, {dates.checkOut.year}
          </div>
        </div>
        <div className="flex-row-child dashboard-nights">
          <span className="icon-moon icon" />
          <div className="content-row">
            <span>{parseInt((new Date(props.reservation.endDate) - new Date(props.reservation.startDate)) / (1000 * 60 * 60 * 24), 10)} nights &bull; {props.reservation.guests} guests</span>
          </div>
        </div>
        <div className="flex-row-child dashboard-status">
          <span className="status">{props.reservation.accepted ? 'Accepted' : 'Pending'}</span>
          <span> - </span>
          <span>{props.reservation.currencyCode} {props.reservation.price}</span>
        </div>
        <div className="flex-row-child dashboard-date">
          {/* Creation date */}
        </div>
      </div>
    </ProfileFlexContainer>
  );
}

DashboardReservationRow.propTypes = {
  reservation: PropTypes.object,
  styleClass: PropTypes.string
};

export default DashboardReservationRow;