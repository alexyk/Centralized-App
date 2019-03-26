import "../../../../styles/css/components/profile/trips/hotel-trips-table.css";

import { Config } from "../../../../config";
import { Link } from "react-router-dom";
import ProfileFlexContainer from "../../flexContainer/ProfileFlexContainer";
import PropTypes from "prop-types";
import React from "react";
import moment from "moment";
import { parseAccommodationDates } from "../../utils/parse-accomodation-dates";
import { parseBookingStatus } from "../../utils/parse-booking-status";
import { NotificationManager } from "react-notifications";
import { LONG } from "../../../../constants/notificationDisplayTimes.js";

const STATUS = {
  DONE: "COMPLETE",
  CONFIRMED: "PENDING",
  FAIL: "BOOKING FAILED",
  FAILED: "BOOKING FAILED",
  PENDING: "PENDING",
  QUEUED: "PENDING",
  QUEUED_FOR_CONFIRMATION: "PENDING",
  CANCELLED: "CANCELLED",
  PENDING_SAFECHARGE_CONFIRMATION: "PENDING",
  PENDING_CANCELLATION: "PENDING CANCELLATION",
  CANCELLATION_FAILED: "CANCELLATION FAILED"
};

/*
const STATUS_TOOLTIP = {
  COMPLETE: "Your reservation is complete",
  PENDING: "Contact us if status is still Pending after 30 minutes",
  "BOOKING FAILED": "Your booking failed please contact us",
  CANCELLED: "You canceled your reservation",
  "PENDING CANCELLATION": "Your cancelation is being processed",
  "CANCELLATION FAILED": "Your booking cancellation was unsuccessful, please contact us",
  CANCELLATION_FAILED: "Your booking cancellation was unsuccessful, please contact us"
};
*/
const STATUS_TOOLTIP = {
  DONE: "Your reservation is complete",
  CONFIRMED: "Contact us if status is still Pending after 30 minutes",
  FAIL: "Your booking failed please contact us",
  FAILED: "Your booking failed please contact us",
  PENDING: "Contact us if status is still Pending after 30 minutes",
  QUEUED: "Contact us if status is still Pending after 30 minutes",
  QUEUED_FOR_CONFIRMATION: "Contact us if status is still Pending after 30 minutes",
  CANCELLED: "You canceled your reservation",
  PENDING_SAFECHARGE_CONFIRMATION: "Contact us if status is still Pending after 30 minutes",
  PENDING_CANCELLATION: "Your cancelation is being processed",
  CANCELLATION_FAILED: "Your booking cancellation was unsuccessful, please contact us"
};


class HotelTrip extends React.Component {
  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  getHostName(name) {
    if (this.props.getHostName) {
      return this.props.getHostName(name);
    }

    if (name.length <= 50) {
      return name;
    }
    return `${name.substring(0, 50)}...`;
  }

  isFutureDate(date) {
    const today = moment().format("YYYY-MM-DD");
    const startDateMoment = moment(date).utc();
    const todayMoment = moment(today, "YYYY-MM-DD");
    const isFutureDate = todayMoment.diff(startDateMoment) < 0;
    return isFutureDate;
  }

  getDates() {
    try {
      return parseAccommodationDates(
        this.props.trip.arrival_date,
        this.props.trip.nights
      );
    } catch (e) {
      return {
        startDate: {
          date: "",
          month: "",
          year: "",
          day: ""
        },
        endDate: {
          date: "",
          month: "",
          year: "",
          day: ""
        }
      };
    }
  }

  render() {
    const _parseBookingStatus =
      this.props.parseBookingStatus || parseBookingStatus;
    // const status = STATUS[this.props.trip.status];
    const status = _parseBookingStatus(this.props.trip.status);
    const statusMessage = STATUS_TOOLTIP[this.props.trip.status];
    const testTrip = { id: '1', hotel_id: '1H', hotel_photo: '', hotel_name :'Hotel Name', hostEmail: 'martin.y.kiriloff@gmail.com', hostPhone: '359877699383', has_details: 1 };
    const items = (this.props.trip.length > 0) ? this.props.trip : testTrip;
    const { id, hotel_id, hotel_photo, hotel_name, hostEmail, hostPhone, has_details } = items;
    const isCompleted =
      status === "COMPLETE" && this.isFutureDate(this.props.trip.arrival_date);
    var _dates = this.getDates();
    if (this.props.trip.status === "PENDING_SAFECHARGE_CONFIRMATION") return null;
    return (
      <ProfileFlexContainer
        styleClass={`flex-container-row ${this.props.styleClass}`}
      >
        <div className="tablet-col-1">
          <div className="flex-row-child trips-image">
            {hotel_photo && (
              <img
                className="image-host"
                src={`${Config.getValue("imgHost")}${
                  JSON.parse(hotel_photo).original
                }`}
                alt="host-profile"
              />
            )}
          </div>
          <div className="flex-row-child trips-host">
            <div className="content-row">
              <div className="hostName">{this.getHostName(hotel_name)}</div>
              <div className="email">{hostEmail}</div>
              <div className="phoneNumber">{hostPhone}</div>
              {hostEmail ? (
                <div>
                  <span className="send-message-icon" />
                  <a href={`mailto:${hostEmail}`}>
                    Send Message
                  </a>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <div className="tablet-col-2">
          <div className="flex-row-child trips-location">
            <i className="fa fa-info-circle icon" />
            <Link
              className="trips-location-link content-row"
              to={`/hotels/listings/${
                hotel_id
              }?currency=GBP&startDate=${this.props.today}&endDate=${
                this.props.afterTomorrow
              }&rooms=%5B%7B"adults":2,"children":%5B%5D%7D%5D`}
            >
              {this.getHostName(hotel_name)}
            </Link>
          </div>
          <div className="flex-row-child trips-dates">
            <span className="icon-calendar icon" />
            <div className="content-row">
              <span className="date-in-day">{_dates.startDate.date}</span>{" "}
              {_dates.startDate.month}, {_dates.startDate.year}{" "}
              <i aria-hidden="true" className="fa fa-long-arrow-right" />{" "}
              <span className="date-out-day">{_dates.endDate.date}</span>{" "}
              {_dates.endDate.month}, {_dates.endDate.year}
            </div>
          </div>
          <div className="flex-row-child trips-actions">
            {(isCompleted || has_details === 1) && (
              <i className="fa fa-bolt icon" />
            )}
            <div className="content-row">
                <button type="submit" onClick={e => { e.preventDefault(); this.props.onTripSelect(id); this.props.handleCancelReservation(id); }}>Cancel Trip</button>
              {this.props.trip.has_details === 1 && (
                <Link to={`/profile/trips/hotels/${this.props.trip.id}`}>
                  Details
                </Link>
              )}
            </div>
          </div>
          <div className="flex-row-child trips-status">
            <span className="status" data-testid="status-field">
              {status}
            </span>
            {this.props.trip.status && (
              <span
                className="icon-question"
                tooltip={
                  (this.props.trip.error && !this.props.trip.error.includes('{') && !this.props.trip.error.includes('}')) ? this.props.trip.error : statusMessage
                }
              />
            )}
            {this.props.trip.status &&
              this.props.trip.status.toUpperCase() === "DONE" && (
                <div>Reference No.: {this.props.trip.booking_id}</div>
              )}
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
  onTripSelect: PropTypes.func,
  parseBookingStatus: PropTypes.func,
  getHostName: PropTypes.func
};

export default HotelTrip;
