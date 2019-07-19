import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import PropTypes from "prop-types";
import moment from "moment";
import { LONG } from "../../../../constants/notificationDisplayTimes.js";
import { BOOKING_UPDATED } from "../../../../constants/successMessages";
import Axios from "axios";
import {getAxiosConfig} from "../utils/adminUtils";

import "../../../../styles/css/components/profile/admin/reservations/admin-reservations-edit-form.css";
import {Config} from "../../../../config";

class AdminHSReservationsEditForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      booking: ""
    };

    this.requestBookingById = this.requestBookingById.bind(this);
    this.onChange = this.onChange.bind(this);
    this.editBooking = this.editBooking.bind(this);
  }

  componentDidMount() {
    this.requestBookingById(this.props.match.params.id);
  }

  onChange(e) {
    const { booking } = this.state;
    this.setState({
      booking: {
        ...booking,
        [e.target.name]: e.target.value
      }
    });
  }

  requestBookingById(id) {
    const apiHost = Config.getValue('apiHost');
    const url = `${apiHost}/admin/panel/booking/hs/${id}`;

    Axios.get(url, getAxiosConfig())
      .then(data => {
        this.setState({booking: data.data});
      })
      .catch(error => {

      });
  }

  editBooking(e) {
    if (e) {
      e.preventDefault();
    }

    const { booking } = this.state;

    const updatedBooking = {
      bookingId: booking.bookingRefId,
      bookingStatus: booking.bookingStatus,
      provider: booking.provider
    };

    const apiHost = Config.getValue('apiHost');
    const url = `${apiHost}admin/panel/booking/hs/${this.props.match.params.id}`;


    Axios.post(url, updatedBooking, getAxiosConfig())
      .then(data => {
        if(data.data.success){
          NotificationManager.success(BOOKING_UPDATED, "", LONG);
          this.props.history.push("/profile/admin/reservation/booking/all");
        }
      })
      .catch(error => {

      });
  }

  render() {
    const { booking } = this.state;

    if (!booking) {
      return <div className="loading" />;
    }

    return (
      <div className="container reservations-edit-form">
        <h2>Edit Booking</h2>
        <form onSubmit={this.editBooking}>
          <div>{`A booking was requested by ${booking.userEmail} (user id: ${
            booking.userId
          } ) for hotel ${booking.hotelName}.`}</div>
          <div id="booking-id" style={{ display: "none" }}>
            {booking.bookingId}
          </div>
          <div className="transaction-hash">{`Transaction hash: ${
            booking.transactionHash
          }`}</div>
          <div className="booking-ref-id">
            <label htmlFor="bookingRefId">Booking ID</label>
            <input
              id="bookingRefId"
              name="bookingRefId"
              value={booking.bookingRefId || ""}
              onChange={this.onChange}
              type="text"
              required
            />
          </div>
          <div className="status">
            <label htmlFor="status">Current booking status:</label>
            <div className="select">
              <select
                name="bookingStatus"
                className="select"
                id="status"
                onChange={this.onChange}
                value={booking.bookingStatus}
              >
                <option disabled value="">
                  ------------------
                </option>
                <option value="DONE">DONE</option>
                <option value="FAILED">FAILED</option>
                <option value="PENDING_SAFECHARGE_CONFIRMATION">N/A</option>
                <option value="SAFECHARGE_FAILED">PP_PAYMENT_FAILED</option>
                <option value="PAYMENT_REVIEW">PAYMENT_REVIEW</option>
                <option value="CONFIRMED">PAYMENT_DONE</option>
                <option value="FAIL">PAYMENT_FAILED</option>
                <option value="QUEUED_FOR_CONFIRMATION">PENDING_CONFIRMATION</option>
                <option value="PENDING_CANCELLATION">PENDING_CANCELLATION</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="CANCELLATION_FAILED">CANCELLATION_FAILED</option>
                <option value="QUEUED">QUEUED</option>
              </select>
            </div>
          </div>
          <div className="provider">
            <label htmlFor="provider">Provider:</label>
            <input
              id="provider"
              name="provider"
              value={booking.provider || ""}
              onChange={this.onChange}
              type="text"
              required
            />
          </div>
          <div>{`Check-in date: ${moment(booking.checkinDate)
            .utc()
            .format("DD/MM/YYYY")}`}</div>
          <div>{`Check-out date: ${moment(booking.checkoutDate)
            .utc()
            .format("DD/MM/YYYY")}`}</div>
          <div className="admin-booking-rooms">
            {booking.rooms.map((room, roomIndex) => {
              const adults = room.adults.map((adult, adultIndex) => {
                return (
                  <div key={adultIndex}>
                    <div>
                      <span>{`- ${adult.title} ${adult.firstName} ${adult.lastName}`}</span>
                    </div>
                  </div>
                );
              });
              const children = room.children.map((child, childIndex) => {
                return (
                  <div key={childIndex}>
                    <div>
                      <span>{`- ${child.firstName} ${child.lastName}, age: ${child.age}`}</span>
                    </div>
                  </div>
                );
              });

              const haveChildren = room.children.length > 0;

              return (
                <div className="admin-booking-room" key={roomIndex}>
                  <div>{`Room ${roomIndex + 1}`}</div>
                  <div className="room-children">
                    <div>{`Adults: `}</div>
                      {adults}
                  </div>

                  {haveChildren && (
                    <div className="room-children">
                      <div>{`Children: `}</div>
                        {children}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div>{`Guest nationality: ${booking.nationality}`}</div>
          <div className="button-holder">
            <button className="btn">Edit</button>
          </div>
        </form>
      </div>
    );
  }
}

AdminHSReservationsEditForm.propTypes = {
  // Router props
  match: PropTypes.object,
  history: PropTypes.object
};

export default withRouter(AdminHSReservationsEditForm);
