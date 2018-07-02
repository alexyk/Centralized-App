import { getHotelBookingDetails } from '../../../requester';
import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import LogoLockTrip from '../../../styles/images/logolocktrip.png';
import Star from '../../../styles/images/star.png';
import FillStar from '../../../styles/images/fill-star.png';

import styles from '../../../styles/css/components/profile/trips/details-test.module.css';

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
    const bookingData = {
      'hotelName': 'COMO Metropolitan London', // done
      'hotelId': 6669, // unused
      'guestsCount': 2, // done
      'startDate': 1530230400000,
      'endDate': 1530316800000,
      'roomType': 'City Room - Double', // done
      'boardType': 'Hot Breack', // done
      'bookingId': 720120716, // done
      'hotelAddress': '19 Old Park Lane', // done
      'hotelPhone': '44-20-74471000', // done
      'hotelScore': 5, // done
      'hotelUrl': 'http://localhost:3000/hotels/listings/6669?region52612&currency=GBP&startDate30/06/2018&endDate=01/07/2018&rooms=%5b%7B%22adults%22:2,%22children%22:%5B%5D%7D%5D', // unused
      'hotelPhoto': 'https://static.locktrip.com/hotels/images/img-2-2846718761338376-53815.png', // done
      'staticImagesUrl': 'https://static.locktrip.com/public/images', // unused
      'staticFontsUrl': 'https://static.locktrip.com/public/fonts', // unused
      'locationUrl': 'http://maps.google.com/?q=51.505029,-0.150089', // unused
      'latitude': '51.505029', // done
      'longitude': '-0.150089', // done
    };

    this.extractDatesData(bookingData);

    this.setState({
      bookingData
    });

    getHotelBookingDetails(1)
      .then((data) => {
        console.log(data);
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
        stars.push(<img className={styles.starImage} src={FillStar} key={`fill-star-${i}`} alt="fill-star" />);
      } else {
        stars.push(<img className={styles.starImage} src={Star} key={`star-${i}`} alt="star" />);
      }
    }

    return (
      <div className={styles.stars}>
        {stars.map((star) => {
          return star;
        })}
      </div>
    );
  }

  render() {
    const { bookingData } = this.state;
    const checkInData = bookingData.checkIn;
    const checkOutData = bookingData.checkOut;

    return (
      <div>
        <section className={styles.detailsView} id="details">
          <div className={`${styles.withPadding}`}>
            <div className={styles.logoContainer}>
              <img width="200" src={`${LogoLockTrip}`} alt="lock-trip-logo" />
            </div>
            <h1 className={styles.headerOne}>Your reservation is confirmed</h1>
            <h3 className={styles.reffernce}>Booking Reference ID: <span className={styles.refferenceId}>{bookingData.bookingId}</span></h3>
            <img className={styles.detailsBackground} src={`${bookingData.hotelPhoto}`} alt="details" />
            <h4>{bookingData.hotelName}</h4>
            {this.renderHotelStars(bookingData.hotelScore)}
            <hr className={styles.horizonatName} />
            <div className={styles.visitInfo}>
              <h3 className={styles.checkInHeader}>Check In</h3>
              <h3 className={styles.checkOutHeader}>Check Out</h3>
              <h3 className={styles.guestsHeader}>Guests</h3>
              <h5 className={styles.checkInContent}>
                <div className={styles.marginBottom5}><span className={styles.dateInDay}>{checkInData.day}</span> {checkInData.month}, {checkInData.dayOfWeek}</div>
                <div>{checkInData.hour}</div>
              </h5>
              <h5 className={styles.checkOutContent}>
                <div className={styles.marginBottom5}><span className={styles.dateOutDay}>{checkOutData.day}</span> {checkOutData.month}, {checkOutData.dayOfWeek}</div>
                <div>by {checkOutData.hour}</div>
              </h5>
              <h5 className={styles.guestsContent}>{bookingData.guestsCount}</h5>
            </div>
            <h3>Room Type</h3>
            <h5 className={styles.marginBottom5}>{bookingData.roomType}</h5>
            <h3>Board Type</h3>
            <h5>{bookingData.boardType}</h5>
            <hr className={styles.horizonatName} />
            <h3>Address</h3>
            <h5>{bookingData.hotelAddress}</h5>
          </div>
          <iframe className={styles.addressMap} title="location" src={`https://maps.google.com/maps?q=${bookingData.latitude},${bookingData.longitude}&z=15&output=embed`} frameBorder="0" />
          <hr className={styles.horizonatName} />
          <div className={`${styles.withPadding}`}>
            <h4><a className={[styles.directions, styles.buttonRegular]} href={`https://www.google.com/maps/dir//${bookingData.hotelAddress}/@${bookingData.latitude},${bookingData.longitude},15z`} target="_blank" rel="noopener noreferrer">Get Directions</a></h4>
            <hr />
            <div className={styles.contactInfo}>
              <h4>Contact Hotel</h4>
              <div className={styles.contactInfoContentWrapper}>
                <span className={styles.contactInfoContentText}>Message Hotel</span>
                <span className={styles.contactInfoContentDot}>•</span>
                <span className={styles.contactInfoContentText}>{bookingData.hotelPhone}</span>
              </div>
            </div>
          </div>
          <div className={styles.essentialInfo}>
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
        <section className={styles.detailsButtonsWrapper}>
          <Link className={`btn ${styles.buttonRegular}`} to="/profile/trips/hotels">Back to Hotels</Link>
          <Link className={`btn ${styles.buttonRegular}`} to="#">Print this page</Link>
        </section>
      </div>
    );
  }
}

export default HotelTripDetails;
