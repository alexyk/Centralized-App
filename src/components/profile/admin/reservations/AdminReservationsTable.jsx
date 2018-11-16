import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import AdminNav from '../AdminNav';
import { Config } from '../../../../config';

import '../../../../styles/css/components/profile/admin/reservations/admin-reservations-table.css';

class AdminReservationsTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bookings: ''
    };
  }

  componentDidMount() {
    fetch('http://localhost:8080/reservation/admin/booking/all', {
      headers: {
        Authorization: localStorage.getItem(Config.getValue('domainPrefix') + '.auth.locktrip'),
      }
    })
      .then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            this.setState({
              bookings: data
            });
          });
        } else {
          console.log(res);
        }
      });
  }

  render() {
    const { bookings } = this.state;

    if (!bookings) {
      return <div className="loader"></div>;
    }

    return (
      <Fragment>
        <AdminNav>
          <h2 className="navigation-tab">All Booking With Transaction Hash</h2>
        </AdminNav>
        <div className="reservations-table">
          <table>
            <thead>
              <tr>
                <th>Rooms Booking Id</th>
                <th>Booking Status</th>
                <th>Transaction Hash</th>
                <th>User Email</th>
                <th>Hotel Name</th>
                <th>Checkin Date</th>
                <th>Checkout Date</th>
                <th>Nationality</th>
                <th>Children Year</th>
                <th>Adults name</th>
                <th>Created On Date</th>
                <th>Provider</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, bookingIndex) => {
                return (
                  <tr key={bookingIndex}>
                    <td>{booking.bookingId}</td>
                    <td>{booking.bookingStatus}</td>
                    <td>{booking.transactionHash}</td>
                    <td>{booking.userEmail}</td>
                    <td>{booking.hotelName}</td>
                    <td>{moment(booking.checkinDate).utc().format('DD/MM/YYYY')}</td>
                    <td>{moment(booking.checkoutDate).utc().format('DD/MM/YYYY')}</td>
                    <td>{booking.nationality}</td>
                    <td>{booking.childrenYears}</td>
                    <td>{booking.adultNames}</td>
                    <td>{moment(booking.createdOn).utc().format('DD/MM/YYYY')}</td>
                    <td>{booking.provider}</td>
                    <td><Link to=" #">Edit</Link></td>
                  </tr>
                );
              })}
            </tbody>
          </table >
        </div >
      </Fragment >
    );
  }
}

export default AdminReservationsTable;