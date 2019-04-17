import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import queryString from 'query-string';
import AdminNav from '../AdminNav';
import requester from '../../../../requester';
import Pagination from '../../../common/pagination/Pagination';

import sa from "superagent";

import '../../../../styles/css/components/profile/admin/reservations/admin-reservations-table.css';
import {Config} from "../../../../config";

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
      tab: 'hotels'
    };

    this.requestBookings = this.requestBookings.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
  }

  componentDidMount() {
    this.requestBookings(this.state.page);
  }

  componentDidUpdate(prevProps, prevState){
    if(prevState.tab !== this.state.tab){
      this.requestBookings(this.state.page);
    }
  }

  requestBookings(page) {

    if(this.state.tab === "hotels"){
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
          }
        });
    } else {
      let host = Config.getValue("apiHost");
      let token = localStorage.getItem(Config.getValue("domainPrefix") + ".auth.locktrip");

      sa.get(`${host}/admin/panel/flights/all?page=${page}&sort=id,desc`).set('Authorization', token).then(response=>{
        let data = response.body;
        this.setState({
          loading: false,
          bookings: data.content,
          totalElements: data.totalElements
        });
      })
    }


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

    const activeButtonStyle = {background: "#d87a61", color: "white"};
    return (
      <div className="reservations-container">
        <AdminNav>
          <h2 className="navigation-tab">All Booking With Transaction Hash</h2>
        </AdminNav>

        <button className="a" style={this.state.tab === "hotels" ? activeButtonStyle : {}} onClick={()=>{this.setState({tab: "hotels", totalElements: '', bookings: []})}}>Hotels</button>
        <button className="a" style={this.state.tab === "flights" ? activeButtonStyle : {}} onClick={()=>{this.setState({tab: "flights", totalElements: '', bookings: []})}}>Flights</button>

        {
          this.state.tab === "hotels" && (
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
          )
        }
        {
          this.state.tab === "flights" && (
            <div className="reservations-table">
              <table>
                <thead>
                <tr>
                  {/*{*/}
                    {/*pnr,*/}
                    {/*tripId -> id PK,*/}
                    {/*status,*/}
                    {/*email,*/}
                    {/*phone,*/}
                    {/*passengerInfo,*/}
                    {/*tickets -> count,*/}
                    {/*fare -> dashboardViewModel (include: departure,arrival),*/}
                    {/*price,*/}
                    {/*currency,*/}
                    {/*transactionId,*/}
                    {/*date -> createdOn,*/}
                    {/*paymentMethod,*/}
                  {/*}*/}

                  {/*<th>PNR</th>*/}
                  {/*<th>Trip ID</th>*/}
                  {/*<th>Status</th>*/}
                  {/*<th>Email</th>*/}
                  {/*<th>Phone</th>*/}
                  {/*<th>Names</th>*/}
                  {/*<th>Tickets</th>*/}
                  {/*<th>Fare</th>*/}
                  {/*<th>Price</th>*/}
                  {/*<th>Transaction ID</th>*/}
                  {/*<th>Date Of Purchase</th>*/}
                  {/*<th>Payment Method</th>*/}
                  {/*<th>Nationality</th>*/}
                  {/*<th>Action</th>*/}

                  <th>PNR</th>
                  <th>Trip ID</th>
                  <th>Status</th>
                  <th>Transaction ID</th>
                  <th>Payment Method</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Fare</th>
                  <th>Passenger Names</th>
                  <th>Tickets</th>
                  <th>Price</th>
                  <th>Date Of Purchase</th>
                  <th>Provider</th>
                  <th>Action</th>
                </tr>
                </thead>
                <tbody>

                {(bookings || []).map((booking, bookingIndex) => {
                  let passengerInfo = booking.passengerInfo ? JSON.parse(booking.passengerInfo) : {};
                  let fare = booking.fare ? JSON.parse(booking.fare) : [];
                  return (
                    <tr key={bookingIndex}>

                      <td>{booking.pnr}</td>
                      <td>{booking.tripId}</td>
                      <td>{booking.status}</td>
                      <td>{booking.transactionId}</td>
                      <td>{booking.paymentMethod}</td>
                      <td>{booking.email}</td>
                      <td>{booking.phone}</td>
                      <td style={{    maxWidth: "none",
                        whiteSpace: "nowrap"}}>{
                        (()=>{
                          let group = 0;
                          return (fare || []).map(f=>{
                            let groupLine = null;

                            if(Number(group) !== Number(f.group)){
                              group = f.group;
                              groupLine = <hr />
                            }
                            let line = <div>{f.origin} - {f.destination}, {moment(f.originDate).utc().format('DD MMM YYYY')} {f.originTime}</div>;
                            return <React.Fragment>
                              {groupLine}
                              {line}
                            </React.Fragment>
                          })
                        })()

                      }</td>
                      <td>{passengerInfo && (
                        (passengerInfo.passengers || []).map(passenger=>{
                          return <div>{passenger.title} {passenger.firstName} {passenger.lastName}</div>
                        })
                      )}</td>
                      <td>{booking.tickets}</td>
                      <td>{booking.price} {booking.currency}</td>
                      <td>{moment(booking.date).utc().format('DD/MM/YYYY')}</td>
                      <td>{booking.provider}</td>
                      <td><Link to={`/profile/admin/reservation/booking/${booking.tripId}/flights`}>Edit</Link></td>
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
          )
        }

      </div>
    );
  }
}

AdminReservationsTable.propTypes = {
  // Router props
  location: PropTypes.object
};

export default withRouter(AdminReservationsTable);
