import '../../../styles/css/components/profile/trips/details.css';

import { Link, withRouter } from 'react-router-dom';

import FillStar from '../../../styles/images/fill-star.png';
import LogoLockTrip from '../../../styles/images/logolocktrip.png';
import React from 'react';
import Star from '../../../styles/images/star.png';
import moment from 'moment';
import requester from '../../../initDependencies';

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
        roomType: '',
        boardType: '',
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
      }
    };
  }

  componentDidMount() {
    // this comments paragraphes are for local testing.

    // const bookingDataMock = {
    //   'hotelName': 'COMO Metropolitan London', // done
    //   'hotelId': 6669, // unused
    //   'guestsCount': 2, // done
    //   'startDate': 1530230400000,
    //   'endDate': 1530316800000,
    //   'roomType': 'City Room - Double', // done
    //   'boardType': 'Hot Breack', // done
    //   'bookingId': 720120716, // done
    //   'hotelAddress': '19 Old Park Lane', // done
    //   'hotelPhone': '44-20-74471000', // done
    //   'hotelScore': 5, // done
    //   'hotelUrl': 'http://localhost:3000/hotels/listings/6669?region52612&currency=GBP&startDate30/06/2018&endDate=01/07/2018&rooms=%5b%7B%22adults%22:2,%22children%22:%5B%5D%7D%5D', // unused
    //   'hotelPhoto': 'https://static.locktrip.com/hotels/images/img-2-2846718761338376-53815.png', // done
    //   'staticImagesUrl': 'https://static.locktrip.com/public/images', // unused
    //   'staticFontsUrl': 'https://static.locktrip.com/public/fonts', // unused
    //   'locationUrl': 'http://maps.google.com/?q=51.505029,-0.150089', // unused
    //   'latitude': '51.505029', // done
    //   'longitude': '-0.150089', // done
    // };
    const bookingId = this.props.match.params.id;
    requester.getHotelBookingDetails(bookingId).then(res => {
      res.body.then(data => {
        console.log(data);
        if (data) {
          const bookingData = data;
          this.extractDatesData(bookingData);
          this.setState({
            bookingData,
          });
        }
        // this.extractDatesData(bookingDataMock);
        // this.setState({
        //   bookingData: bookingDataMock,
        // });
      })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  extractDatesData(bookingData) {
    const startDateMoment = moment(bookingData.startDate);
    const endDateMoment = moment(bookingData.endDate);

    let startDateHour = startDateMoment.hour();
    let endDateHour = endDateMoment.hour();

    startDateHour = startDateMoment.format('h') + ((startDateMoment.hour() >= 12 ? 'PM' : 'AM'));
    endDateHour = endDateMoment.format('h') + ((endDateMoment.hour() >= 12 ? 'PM' : 'AM'));

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

  render() {
    const { bookingData } = this.state;
    const checkInData = bookingData.checkIn;
    const checkOutData = bookingData.checkOut;

    console.log(bookingData.latitude);

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
            <img className="details-background" src={`${bookingData.hotelPhoto}`} alt="details" />
            <h4>{bookingData.hotelName}</h4>
            {this.renderHotelStars(bookingData.hotelScore)}
            <hr />
            <div className="visit-info">
              <h3 className="check-in-header">Check In</h3>
              <h3 className="check-out-header">Check Out</h3>
              <h3 className="guests-header">Guests</h3>
              <h5 className="check-in-content">
                <div style={{ marginBottom: '5%' }}><span className="date-in-day">{checkInData.day}</span> {checkInData.month}, {checkInData.dayOfWeek}</div>
                <div>{checkInData.hour}</div>
              </h5>
              <h5 className="check-out-content">
                <div style={{ marginBottom: '5%' }}><span className="date-out-day">{checkOutData.day}</span> {checkOutData.month}, {checkOutData.dayOfWeek}</div>
                <div>by {checkOutData.hour}</div>
              </h5>
              <h5 className="guests-content">{bookingData.guestsCount}</h5>
            </div>
            <h3>Room Type</h3>
            <h5 style={{ marginBottom: '5%' }}>{bookingData.roomType}</h5>
            <h3>Board Type</h3>
            <h5>{bookingData.boardType}</h5>
            <hr />
            <h3>Address</h3>
            <h5>{bookingData.hotelAddress}</h5>
          </div>
          <iframe className="address-map" title="location" src={`https://maps.google.com/maps?q=${bookingData.latitude},${bookingData.longitude}&z=15&output=embed`} frameBorder="0" />
          <hr />
          <div className="with-padding">
            <h4><a className="directions button-regular" href={`https://www.google.com/maps/dir//${bookingData.hotelAddress}/@${bookingData.latitude},${bookingData.longitude},15z`} target="_blank" rel="noopener noreferrer">Get Directions</a></h4>
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
              <p>We have acquired the right to book this hotel from a company that is authorized to redistribute its inventory. This is a common practice within all big OTAs, which makes it possible to cover as much properties as possible for you to choose from around the world.</p>
              <p>In this regards, the hotel&#39;s personnel, and more specifically the receptionists, should not be expected to know the exact end-retail website or travel agent the booking originates from (<a href="https://locktrip.com/" rel="noopener noreferrer" target="_blank">LockTrip.com</a>). They will be aware of the company authorized to redistribute their inventory and sent the booking through.</p>
              <p>To ensure fast check-in and avoid misunderstandings, LockTrip provides you herewith with a unique booking reference ID which is your undisputed proof/booking confirmation easily identifiable at the reception along with your name and surname. Alternatively, you can simply hand in the printed voucher (attached to this mail).</p>
              <p>NOTE: Should you want to re-confirm your stay prior arrival, make sure you wait between 6 to 24 hours before contacting the hotel.</p>
              <p>Information as where you made the booking, what payment method and/or currency you used to make the booking etc. will not help the receptionist retrieve your booking form the system as it is irrelevant. </p>
              <p>Don&#39;t hesitate to get in touch if you need additional assistance.</p>
            </div>
          </div>
        </section>
        <section className="details-buttons-wrapper">
          <Link className="btn button-regular" to="/profile/trips/hotels">Back to Hotels</Link>
          {/* <Link className="btn button-regular" to="#">Print this page</Link> */}
        </section>
      </div>
    );
  }
}

export default withRouter(HotelTripDetails);
