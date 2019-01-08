import '../../../../styles/css/components/profile/trips/details.css';

import { Link, withRouter } from 'react-router-dom';

import FillStar from '../../../../styles/images/fill-star.png';
import LogoLockTrip from '../../../../styles/images/logolocktrip.png';
import React from 'react';
import PropTypes from 'prop-types';
import Star from '../../../../styles/images/star.png';
import moment from 'moment';
import requester from '../../../../requester';

import {parseAccommodationDates} from "../../utils/parse-accomodation-dates";

class HotelTripDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      bookingData: {
        hotelName: '',
        hotelId: '',
        guestsCount: '',
        startDate: '',
        endDate: '',
        roomType: [],
        boardType: [],
        bookingId: '',
        hotelAddress: '',
        hotelPhone: '',
        hotelScore: '',
        hotelUrl: '',
        hotelPhoto: '',
        staticImagesUrl: '',
        staticFontsUrl: '',
        locationUrl: '',
        latitude: '',
        longitude: '',
        checkIn: '',
        checkOut: '',
        safeChargeMode: '',
      }
    };

    this.getDates = this.getDates.bind(this)
  }

  componentDidMount() {
    const bookingId = this.props.match.params.id;
    console.log(this.props.location.search);
    if (bookingId === 'error_url') {
      this.setState({
        safeChargeMode: 'error'
      });
    } else if (bookingId === 'success') {
      this.setState({
        safeChargeMode: 'success'
      });
    } else {
      requester.getHotelBookingDetails(bookingId).then(res => {
        res.body.then(data => {
          if (data) {
            const bookingData = data;
            this.extractDatesData(bookingData);
            this.setState({
              bookingData,
            });
          }
        });
      });
    }
  }

  extractDatesData(bookingData) {
    const startDateMoment = moment(bookingData.startDate).utc();
    const endDateMoment = moment(bookingData.endDate).utc();

    let startDateHour = startDateMoment.hour();
    let endDateHour = endDateMoment.hour();

    startDateHour = '2:00 PM';
    endDateHour = '12:00 PM';

    const checkIn = {
      day: startDateMoment.format('D'),
      dayOfWeek: startDateMoment.format('ddd').toUpperCase(),
      month: startDateMoment.format('MMM').toUpperCase(),
      hour: startDateHour,
    };

    const checkOut = {
      day: endDateMoment.format('D'),
      dayOfWeek: endDateMoment.format('ddd').toUpperCase(),
      month: endDateMoment.format('MMM').toUpperCase(),
      hour: endDateHour,
    };

    bookingData.checkIn = checkIn;
    bookingData.checkOut = checkOut;
  }

  renderHotelStars(starsCount) {
    const maxCountOfStars = 5;
    const hotelStarsCount = Math.round(starsCount);

    let stars = [];

    for (let i = 0; i < maxCountOfStars; i++) {
      if (i < hotelStarsCount) {
        stars.push(<img className="star-image" src={FillStar} key={`fill-star-${i}`} alt="fill-star" />);
      } else {
        stars.push(<img className="star-image" src={Star} key={`star-${i}`} alt="star" />);
      }
    }

    return (
      <div className="stars">
        {stars.map((star) => {
          return star;
        })}
      </div>
    );
  }

  renderRoomTypes(roomTypes){
    if(!Array.isArray(roomTypes)){
      return (<h5>{roomTypes}</h5>);
    } else {
      const types = roomTypes.map((rt) => <h5>{rt}</h5>);
      return ( <div>{types}</div> );
    }
  }

  renderRoomBoards(roomBoards){
    if(!Array.isArray(roomBoards)){
      return (<h5>{roomBoards}</h5>);
    } else {
      const boards = roomBoards.map((rt) => <h5>{rt}</h5>);
      return ( <div>{boards}</div> );
    }
  }

  renderHeading() {
    switch (this.state.bookingData.bookingStatus) {
      case 'PENDING':
        return 'Your reservation is being confirmed';
      case 'DONE':
        return 'Your reservation is confirmed';
      case 'FAILED':
      case 'FAIL':
        return 'Your reservation failed. Please contact our support';
      case 'CANCELLED':
        return 'Your reservation has been canelled';
      default:
        return 'Reservation details';
    }
  }

  getDates(){
    try {
      return parseAccommodationDates(this.state.bookingData.startDate, null, this.state.bookingData.endDate);
    } catch (e) {
      return {
        startDate: {
          day: "",
          date: "",
          month: ""
        },
        endDate: {
          day: "",
          date: "",
          month: ""
        }
      };
    }

  }

  render() {
    const { bookingData, safeChargeMode } = this.state;
    const checkInData = bookingData.checkIn;
    const checkOutData = bookingData.checkOut;

    let _dates = this.getDates();

    if (safeChargeMode === 'success') {
      return (
        <section className="details-view safecharge-success" id="details">
          <h2>Thank you! Your payment has been successfully received.</h2>
          <p>Your reservation has been initiated to the hotel and is pending confirmation. </p>
          <p>Confirmation usually takes few minutes but in some rare occasions could take up to several hours.</p>
          <p>You can monitor the status of your booking in your Dashboard under <Link to="/profile/trips/hotels">My Trips</Link> tab.</p>
          <p>As soon as the booking is confirmed by the hotel, we will immediately notify you via email.</p>
          <div className="button-holder">
            <Link className="btn button-regular" to="/profile/trips/hotels">Go to My Trips</Link>
          </div>
        </section>
      );
    }

    if (safeChargeMode === 'error') {
      return (
        <section className="details-view safecharge-error" id="details">
          <h2>Something wrong with your credit card payment request!</h2>
        </section>
      );
    }

    return (
      <div>
        <section className="details-view" id="details">
          <div className="with-padding">
            <div className="logo-container">
              <img width="200" src={`${LogoLockTrip}`} alt="lock-trip-logo" />
            </div>
            <h2>{this.renderHeading()}</h2>
            {bookingData.bookingId ?
              <h3 className="reffernce">Booking Reference ID: <span className="refference-id">{bookingData.bookingId}</span></h3>
              : null}
            <img className="details-background no-print" src={`${bookingData.hotelPhoto}`} alt="details" />
            <h4>{bookingData.hotelName}</h4>
            {this.renderHotelStars(bookingData.hotelScore)}
            <hr />
            <div className="visit-info">
              <div className="check-in">
                <h3 className="check-in-header">Check In</h3> 
                <h5 className="check-in-content">
                  <div style={{ marginBottom: '5%' }}><span className="date-in-day">{_dates.startDate.date}</span> {_dates.startDate.month}, {_dates.startDate.day}</div>
                  <div>After {checkInData.hour}</div>
                </h5>
              </div>
              <div className="check-out">
                <h3 className="check-out-header">Check Out</h3>
                <h5 className="check-out-content">
                  <div style={{ marginBottom: '5%' }}><span className="date-out-day">{_dates.endDate.date}</span> {_dates.endDate.month}, {_dates.endDate.day}</div>
                  <div>Before {checkOutData.hour}</div>
                </h5>
              </div>
              <div className="guests">
                <h3 className="guests-header">Guests</h3>
                <h5 className="guests-content">{bookingData.guestsCount}</h5>
              </div>
            </div>
            <h3>Room Type</h3>
            {/*<h5 style={{ marginBottom: '5%' }}>{bookingData.roomType}</h5>*/}
            {this.renderRoomTypes(bookingData.roomType)}
            <h3 style={{ marginTop: '5%' }}>Board Type</h3>
            {/*<h5>{bookingData.boardType}</h5>*/}
            {this.renderRoomBoards(bookingData.boardType)}
            <hr />
            <h3>Address</h3>
            <h5>{bookingData.hotelAddress}</h5>
          </div>
          <iframe className="address-map no-print" title="location" src={`https://maps.google.com/maps?q=${bookingData.latitude},${bookingData.longitude}&z=15&output=embed`} frameBorder="0" />
          <div className="static-map-container">
            <img className="static-map-address" src={`https://maps.googleapis.com/maps/api/staticmap?center=${bookingData.latitude},${bookingData.longitude}&zoom=13&size=640x480&markers=${bookingData.latitude},${bookingData.longitude}&key=AIzaSyBLMYRyzRm83mQIUj3hsO-UVz8-yzfAvmU`} alt="static-map-address" />
          </div>
          <hr className="no-print" />
          <div className="with-padding">
            <h4><a className="directions button-regular no-print" href={`https://www.google.com/maps/dir//${bookingData.hotelAddress}/@${bookingData.latitude},${bookingData.longitude},15z`} target="_blank" rel="noopener noreferrer">Get Directions</a></h4>
            <hr />
            <div className="contact-info">
              <h4>Contact Hotel</h4>
              <div className="contact-info-content-wrapper">
                <span className="contact-info-content-text">Message Hotel</span>
                <span className="contact-info-content-dot">•</span>
                <span className="contact-info-content-text">{bookingData.hotelPhone}</span>
              </div>
            </div>
          </div>
          <div className="essential-info">
            <h4>MUST-READ ESSENTIAL INFORMATION</h4>
            <div>
              <p>This booking is a result of a complex distribution channel partnership, not of a direct contract between LockTrip and the hotel.</p>
              <p>We have acquired the right to book this hotel from a company that is authorized to redistribute its inventory. This is a common practice within all big OTAs, which enables us to cover as many properties as possible for you to choose from around the world.</p>
              <p>In this regard, the hotel&#39;s personnel, and more specifically the receptionists, should not be expected to know the exact end-retail website or travel agent that the booking originates from (<a href="https://locktrip.com/" rel="noopener noreferrer" target="_blank">LockTrip.com</a>). They will be aware of the company authorized to redistribute their inventory and send the booking through.</p>
              <p>To ensure fast check-in and avoid misunderstandings, LockTrip provides you here with with a unique booking reference ID which is your undisputed proof/booking confirmation easily identifiable at the reception along with your name and surname. Alternatively, you may simply hand in the printed voucher (attached to this mail).</p>
              <p>NOTE: Should you want to re-confirm your stay prior to arrival, please make sure you wait between 6 and 24 hours before contacting the hotel.</p>
              <p>Information as where you made the booking, what payment method and/or currency you used to make the booking etc. will not help the receptionist retrieve your booking from the system as it is irrelevant. </p>
              <p>Don&#39;t hesitate to contact us if you need additional assistance.</p>
            </div>
          </div>
        </section>
        <section className="details-buttons-wrapper no-print">
          <Link className="btn button-regular" to="/profile/trips/hotels">Back to Hotels</Link>
          <button className="btn button-regular" onClick={() => window.print()}>Print this page</button>
        </section>
      </div>
    );
  }
}

HotelTripDetails.propTypes = {
  match: PropTypes.object,

  //Router props
  location: PropTypes.object
};

export default withRouter(HotelTripDetails);
