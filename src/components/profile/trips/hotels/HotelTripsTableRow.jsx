import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';

import ProfileFlexContainer from '../../flexContainer/ProfileFlexContainer';
import { Config } from '../../../../config';
import HotelIcon from '../../../../styles/images/icon-hotel.png';

import '../../../../styles/css/components/profile/trips/hotel-trips-table.css';

function HotelTripsTableRow(props) {

  const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  let tomorrow = new Date();
  tomorrow.setHours(24);
  let afterTomorrow = new Date();
  afterTomorrow.setHours(48);

  const getHostName = (name) => {
    if (name.length <= 50) {
      return name;
    }
    return `${name.substring(0, 50)}...`;
  };

  const extractDatesData = (trip) => {
    const startDateMoment = moment(trip.arrival_date, 'YYYY-MM-DD');
    const endDateMoment = moment(trip.arrival_date).add(trip.nights, 'days');

    const checkIn = {
      day: startDateMoment.format('D'),
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

  const isFutureDate = (date) => {
    const startDateMoment = moment(date, 'YYYY-MM-DD');
    const today = moment();
    const isFutureDate = today.diff(startDateMoment) < 0;
    return isFutureDate;
  };

  isFutureDate(props.trip.arrival_date);

  const dates = extractDatesData(props.trip);

  return (
    <ProfileFlexContainer styleClass={`flex-container-row ${props.styleClass}`}>
      <div className="tablet-col-1">
        <div className="flex-row-child trips-image">
          {props.trip.hotel_photo &&
            <img className="image-host" src={`${Config.getValue('imgHost')}${JSON.parse(props.trip.hotel_photo).original}`} alt="host-profile" />
          }
        </div>
        <div className="flex-row-child trips-host">
          <img className="icon" src={HotelIcon} alt="hotel" />
          <div className="content-row">
            <div className="hostName">{getHostName(props.trip.hotel_name)}</div>
            <div className="email">{props.trip.hostEmail}</div>
            <div className="phoneNumber">{props.trip.hostPhone}</div>
            {props.trip.hostEmail ? <div><span className="send-message-icon"></span><a href={`mailto:${props.trip.hostEmail}`}>Send Message</a></div> : ''}
          </div>
        </div>
      </div>
      <div className="tablet-col-2">
        <div className="flex-row-child trips-location">
          <i className="fa fa-info-circle icon" />
          <Link className="trips-location-link content-row" to={`/hotels/listings/${props.trip.hotel_id}?currency=GBP&startDate=${moment(tomorrow).format('DD/MM/YYYY')}&endDate=${moment(afterTomorrow).format('DD/MM/YYYY')}&rooms=%5B%7B"adults":2,"children":%5B%5D%7D%5D`}><u>{getHostName(props.trip.hotel_name)}</u></Link>
        </div>
        <div className="flex-row-child trips-dates">
          <span className="icon-calendar icon" />
          <div className="content-row">
            <span className="date-in-day">{dates.checkIn.day}</span> {dates.checkIn.month}, {dates.checkIn.year} <i aria-hidden="true" className="fa fa-long-arrow-right" /> <span className="date-out-day">{dates.checkOut.day}</span> {dates.checkOut.month}, {dates.checkOut.year}
          </div>
        </div>
        <div className="flex-row-child trips-actions">
          {(props.trip.status && props.trip.status.toUpperCase() === 'DONE') ||
            props.trip.has_details !== 0 ?
            <i className="fa fa-bolt icon" /> : null}
          <div className="content-row">
            {props.trip.status && props.trip.status.toUpperCase() === 'DONE' && isFutureDate(props.trip.arrival_date) &&
              <button type="submit" onClick={e => { e.preventDefault(); props.onTripSelect(props.trip.id); props.handleCancelReservation(); }}>Cancel Trip</button>
            }
            {props.trip.has_details === 0 ?
              null :
              <Link to={`/profile/trips/hotels/${props.trip.id}`}>Details</Link>}
          </div>
        </div>
        <div className="flex-row-child trips-status">
          {
            <span className="status">{capitalize(props.trip.status != null && props.trip.status.length > 0 ? props.trip.status : 'PENDING')}</span>
          }
          <span>&nbsp;</span>
          {props.trip.status && props.trip.status.toUpperCase() === 'FAILED' &&
            <div className="icon-question" title={props.trip.error ? props.trip.error : 'Transaction failed.'}></div>
          }
          {props.trip.status && props.trip.status.toUpperCase() === 'DONE' &&
            <div>Reference No.: {props.trip.booking_id}</div>
          }
        </div>
      </div>
    </ProfileFlexContainer>
  );
}

HotelTripsTableRow.propTypes = {
  trip: PropTypes.object,
  styleClass: PropTypes.string,
  handleCancelReservation: PropTypes.func,
  onTripSelect: PropTypes.func
};

export default HotelTripsTableRow;