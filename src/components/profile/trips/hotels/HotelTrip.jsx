import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';

import ProfileFlexContainer from '../../flexContainer/ProfileFlexContainer';
import { Config } from '../../../../config';
import HotelIcon from '../../../../styles/images/icon-hotel.png';

import '../../../../styles/css/components/profile/trips/hotel-trips-table.css';

class HotelTrip extends React.Component {
  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  extractDatesData(trip) {
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

    const tomorrow = new Date().setHours(24);
    const afterTomorrow = new Date().setHours(48);
    const dates = this.extractDatesData(this.props.trip);


    return (
      <ProfileFlexContainer styleClass={`flex-container-row ${this.props.styleClass}`}>
        <div className="tablet-col-1">
          <div className="flex-row-child trips-image">
            {this.props.trip.hotel_photo &&
              <img className="image-host" src={`${Config.getValue('imgHost')}${JSON.parse(this.props.trip.hotel_photo).original}`} alt="host-profile" />
            }
          </div>
          <div className="flex-row-child trips-host">
            <img className="icon" src={HotelIcon} alt="hotel" />
            <div className="content-row">
              <div className="hostName">{this.getHostName(this.props.trip.hotel_name)}</div>
              <div className="email">{this.props.trip.hostEmail}</div>
              <div className="phoneNumber">{this.props.trip.hostPhone}</div>
              {this.props.trip.hostEmail ? <div><span className="send-message-icon"></span><a href={`mailto:${this.props.trip.hostEmail}`}>Send Message</a></div> : ''}
            </div>
          </div>
        </div>
        <div className="tablet-col-2">
          <div className="flex-row-child trips-location">
            <i className="fa fa-info-circle icon" />
            <Link className="trips-location-link content-row" to={`/hotels/listings/${this.props.trip.hotel_id}?currency=GBP&startDate=${moment(tomorrow).format('DD/MM/YYYY')}&endDate=${moment(afterTomorrow).format('DD/MM/YYYY')}&rooms=%5B%7B"adults":2,"children":%5B%5D%7D%5D`}><u>{this.getHostName(this.props.trip.hotel_name)}</u></Link>
          </div>
          <div className="flex-row-child trips-dates">
            <span className="icon-calendar icon" />
            <div className="content-row">
              <span className="date-in-day">{dates.checkIn.day}</span> {dates.checkIn.month}, {dates.checkIn.year} <i aria-hidden="true" className="fa fa-long-arrow-right" /> <span className="date-out-day">{dates.checkOut.day}</span> {dates.checkOut.month}, {dates.checkOut.year}
            </div>
          </div>
          <div className="flex-row-child trips-actions">
            {(this.props.trip.status && this.props.trip.status.toUpperCase() === 'DONE') ||
            this.props.trip.has_details !== 0 ?
              <i className="fa fa-bolt icon" /> : null}
            <div className="content-row">
              {this.props.trip.status && this.props.trip.status.toUpperCase() === 'DONE' && this.isFutureDate(moment().format('YYYY-MM-DD'), this.props.trip.arrival_date) &&
                <button type="submit" onClick={e => { e.preventDefault(); this.props.onTripSelect(this.props.trip.id); this.props.handleCancelReservation(); }}>Cancel Trip</button>
              }
              {this.props.trip.has_details === 0 ?
                null :
                <Link to={`/profile/trips/hotels/${this.props.trip.id}`}>Details</Link>}
            </div>
          </div>
          <div className="flex-row-child trips-status">
            {
              <span className="status">{this.capitalize(this.props.trip.status != null && this.props.trip.status.length > 0 ? this.props.trip.status : 'PENDING')}</span>
            }
            <span>&nbsp;</span>
            {this.props.trip.status && this.props.trip.status.toUpperCase() === 'FAILED' &&
              <div className="icon-question" title={this.props.trip.error ? this.props.trip.error : 'Transaction failed.'}></div>
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
  styleClass: PropTypes.string,
  handleCancelReservation: PropTypes.func,
  onTripSelect: PropTypes.func
};

export default HotelTrip;