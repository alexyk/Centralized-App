import '../../../../styles/css/components/profile/trips/hotel-trips-table.css';

import { Config } from '../../../../config';
import { Link } from 'react-router-dom';
import ProfileFlexContainer from '../../flexContainer/ProfileFlexContainer';
import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

const STATUS = {
  DONE: 'COMPLETE',
  CONFIRMED: 'PENDING',
  FAIL: 'PAYMENT FAILED',
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
  'PAYMENT FAILED': 'Your payment failed please contact us',
  'BOOKING FAILED': 'Your booking failed please contact us',
  'CANCELLED': 'You canceled your reservation'
};

class HotelTrip extends React.Component {
  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  extractDatesData(trip) {
    const startDateMoment = moment(trip.arrival_date).utc();
    const endDateMoment = moment(trip.arrival_date).add(trip.nights, 'days').utc();
    
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
  }

  getHostName(name) {
    if (name.length <= 50) {
      return name;
    }
    return `${name.substring(0, 50)}...`;
  }

  isFutureDate(today, date) {
    const startDateMoment = moment(date, 'YYYY-MM-DD');
    const todayMoment = moment(today, 'YYYY-MM-DD');
    const isFutureDate = todayMoment.diff(startDateMoment) < 0;
    return isFutureDate;
  }

  render() {
    const status = STATUS[this.props.trip.status];
    const statusMessage = STATUS_TOOLTIP[status];

    const dates = this.extractDatesData(this.props.trip);
    const { hotel_photo, hotel_name, hostEmail, hostPhone } = this.props.trip;

    const isCompleted = status === 'COMPLETE' && this.isFutureDate(moment().format('YYYY-MM-DD'), this.props.trip.arrival_date);

    return (
      <ProfileFlexContainer styleClass={`flex-container-row ${this.props.styleClass}`}>
        <div className="tablet-col-1">
          <div className="flex-row-child trips-image">
            {hotel_photo &&
              <img className="image-host" src={`${Config.getValue('imgHost')}${JSON.parse(hotel_photo).original}`} alt="host-profile" />
            }
          </div>
          <div className="flex-row-child trips-host">
            <div className="content-row">
              <div className="hostName">{this.getHostName(hotel_name)}</div>
              <div className="email">{hostEmail}</div>
              <div className="phoneNumber">{hostPhone}</div>
              {this.props.trip.hostEmail ? <div><span className="send-message-icon"></span><a href={`mailto:${this.props.trip.hostEmail}`}>Send Message</a></div> : ''}
            </div>
          </div>
        </div>
        <div className="tablet-col-2">
          <div className="flex-row-child trips-location">
            <i className="fa fa-info-circle icon" />
            <Link className="trips-location-link content-row" to={`/hotels/listings/${this.props.trip.hotel_id}?currency=GBP&startDate=${this.props.tomorrow}&endDate=${this.props.afterTomorrow}&rooms=%5B%7B"adults":2,"children":%5B%5D%7D%5D`}>{this.getHostName(this.props.trip.hotel_name)}</Link>
          </div>
          <div className="flex-row-child trips-dates">
            <span className="icon-calendar icon" />
            <div className="content-row">
              <span className="date-in-day">{dates.checkIn.day}</span> {dates.checkIn.month}, {dates.checkIn.year} <i aria-hidden="true" className="fa fa-long-arrow-right" /> <span className="date-out-day">{dates.checkOut.day}</span> {dates.checkOut.month}, {dates.checkOut.year}
            </div>
          </div>
          <div className="flex-row-child trips-actions">
            {(isCompleted || this.props.trip.has_details === 1) && <i className="fa fa-bolt icon" />}
            <div className="content-row">
              {isCompleted &&
                <button type="submit" onClick={e => { e.preventDefault(); this.props.onTripSelect(this.props.trip.id); this.props.handleCancelReservation(); }}>Cancel Trip</button>
              }
              {this.props.trip.has_details === 1 && <Link to={`/profile/trips/hotels/${this.props.trip.id}`}>Details</Link>}
            </div>
          </div>
          <div className="flex-row-child trips-status">
            {this.props.trip.status &&
              <span className="status">{status}</span>
            }
            {this.props.trip.status &&
              <span className="icon-question" tooltip={this.props.trip.error ? this.props.trip.error : statusMessage}></span>
            }
            {this.props.trip.status && this.props.trip.status.toUpperCase() === 'DONE' &&
              <div>Reference No.: {this.props.trip.booking_id}</div>
            }
          </div>
        </div>
      </ProfileFlexContainer>
    );
  }
}

HotelTrip.propTypes = {
  trip: PropTypes.object,
  tomorrow: PropTypes.string, // format (DD/MM/YYYY)
  afterTomorrow: PropTypes.string, // format (DD/MM/YYYY)
  styleClass: PropTypes.string,
  handleCancelReservation: PropTypes.func,
  onTripSelect: PropTypes.func
};

export default HotelTrip;
