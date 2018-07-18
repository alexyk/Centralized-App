import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';
import ProfileFlexContainer from '../flexContainer/ProfileFlexContainer';
import { Config } from '../../../config';

function HotelTripsTableRow(props) {

  const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  let tomorrow = new Date();
  tomorrow.setHours(24);
  let afterTomorrow = new Date();
  afterTomorrow.setHours(48);

  return (
    <ProfileFlexContainer key={props.trip.id} styleClass={`flex-container-row ${props.styleClass}`}>
      <div className="flex-row-child trips-image-width">
        {props.trip.hotel_photo &&
          <img className="trips-image-host" src={`${Config.getValue('imgHost')}${JSON.parse(props.trip.hotel_photo).original}`} alt="host-profile" />
        }
      </div>
      <div className="flex-row-child trips-host-width">
        <div className="bold">{props.trip.hotel_name}</div>
        <div>{props.trip.hostEmail}</div>
        <div>{props.trip.hostPhone}</div>
        {props.trip.hostEmail ? <div><span className="send-message-icon"></span><a href={`mailto:${props.trip.hostEmail}`}>Send Message</a></div> : ''}
      </div>
      <div className="flex-row-child trips-property-width">
        <Link className="trips-property-link" to={`/hotels/listings/${props.trip.hotel_id}?currency=GBP&startDate=${moment(tomorrow).format('DD/MM/YYYY')}&endDate=${moment(afterTomorrow).format('DD/MM/YYYY')}&rooms=%5B%7B"adults":2,"children":%5B%5D%7D%5D`}><u>{props.trip.hotel_name}</u></Link>
      </div>
      <div className="flex-row-child trips-dates-width">
        {moment(new Date(props.trip.arrival_date)).format('DD MMM, YYYY')}<i aria-hidden="true" className="fa fa-long-arrow-right"></i>{moment(new Date(props.trip.arrival_date)).add(props.trip.nights, 'days').format('DD MMM, YYYY')}
      </div>
      <div className="flex-row-child trips-actions-width">
        {props.trip.status && props.trip.status.toUpperCase() === 'DONE' &&
          <button type="submit" onClick={e => { e.preventDefault(); props.onTripSelect(props.trip.id); props.handleCancelReservation(); }}>Cancel Trip</button>
        }
        {props.trip.has_details === 0 ?
          null
          : <div><Link to={`/profile/trips/hotels/${props.trip.id}`}>Details</Link></div>}
      </div>
      <div className="flex-row-child trips-status-width">
        {
          capitalize(props.trip.status != null && props.trip.status.length > 0 ? props.trip.status : 'PENDING')
        }
        <span>&nbsp;</span>
        {props.trip.status && props.trip.status.toUpperCase() === 'FAILED' &&
          <div className="icon-question" title={props.trip.error ? props.trip.error : 'Transaction failed.'}></div>
        }
        {props.trip.status && props.trip.status.toUpperCase() === 'DONE' &&
          <div>Reference No.: {props.trip.booking_id}</div>
        }
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