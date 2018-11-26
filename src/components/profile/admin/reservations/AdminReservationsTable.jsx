import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import queryString from 'query-string';
import AdminNav from '../AdminNav';
import requester from '../../../../requester';
import Pagination from '../../../common/pagination/Pagination';

import '../../../../styles/css/components/profile/admin/reservations/admin-reservations-table.css';

class AdminReservationsTable extends Component {
  constructor(props) {
    super(props);

    let queryParams = queryString.parse(this.props.location.search);

    this.state = {
      loading: true,
      bookings: '',
      page: !queryParams.page ? 0 : Number(queryParams.page),
      totalElements: '',
      totalPages: '',
    };

    this.requestBookings = this.requestBookings.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
  }

  componentDidMount() {
    this.requestBookings(this.state.page);
  }

  requestBookings(page) {
    requester.getAllBookingsWithTransactionHash([`page=${page}`])
      .then((res) => {
        if (res.success) {
          res.body.then((data) => {
            this.setState({
              loading: false,
              bookings: data.content,
              totalElements: data.totalElements
            });
          });
        } else {
          console.log(res);
        }
      });
  }

  onPageChange(page) {
    this.setState({
      page: page - 1,
      loading: true
    });

    window.scrollTo(0, 0);

    this.requestBookings(page - 1);
  }

  render() {
    const { bookings, totalElements, loading } = this.state;

    if (loading) {
      return <div className="loader"></div>;
    }

    return (
      <div className="reservations-container">
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
                <th>Payment Method</th>
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
                const isValidHash = booking.transactionHash.startsWith('0x');
                let txHash = booking.transactionHash;
                if (isValidHash) {
                  txHash = <a target='_blank' rel="noopener noreferrer" href={'https://etherscan.io/tx/' + booking.transactionHash}>{booking.transactionHash}</a>;
                }
                return (
                  <tr key={bookingIndex}>
                    <td>{booking.bookingId}</td>
                    <td>{booking.bookingStatus}</td>
                    <td>{txHash}</td>
                    <td>{booking.paymentMethod}</td>
                    <td>{booking.userEmail}</td>
                    <td>{booking.hotelName}</td>
                    <td>{moment(booking.checkinDate).utc().format('DD/MM/YYYY')}</td>
                    <td>{moment(booking.checkoutDate).utc().format('DD/MM/YYYY')}</td>
                    <td>{booking.nationality}</td>
                    <td>{booking.childrenYears}</td>
                    <td>{booking.adultNames}</td>
                    <td>{moment(booking.createdOn).utc().format('DD/MM/YYYY')}</td>
                    <td>{booking.provider}</td>
                    <td><Link to={`/profile/admin/reservation/booking/${booking.id}`}>Edit</Link></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Pagination
            loading={loading}
            onPageChange={this.onPageChange}
            currentPage={this.state.page + 1}
            pageSize={10}
            totalElements={totalElements}
          />
        </div>
      </div>
    );
  }
}

AdminReservationsTable.propTypes = {
  // Router props
  location: PropTypes.object
};

export default withRouter(AdminReservationsTable);