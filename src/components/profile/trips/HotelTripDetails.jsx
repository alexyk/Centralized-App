import {getHotelBookingDetails} from '../../../requester';
import React from 'react';
import { Link } from 'react-router-dom';
import DetailsBackground from '../../../styles/images/background.png';
import LogoLockTrip from '../../../styles/images/logolocktrip.png';
import Star from '../../../styles/images/star.png';
import FillStar from '../../../styles/images/fill-star.png';

import styles from '../../../styles/css/components/profile/trips/details-test.module.css';

export default class HotelTripDetails extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    getHotelBookingDetails().then((data) => {
      console.log(data);
    });
  }

  renderHotelStars() {
    const maxCountOfStars = 5;
    const hotelStarsCount = Math.round(4.4);

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
    return (
      <div className={styles.hotelTripDetails}>
        <div className={styles.logoContainer}>
          <img width="200" src={`${LogoLockTrip}`} alt="lock-trip-logo" />
        </div>
        <section className={styles.detailsView}>
          <div className={`${styles.withPadding}`}>
            <h1 className={styles.headerOne}>Your reservation is confirmed</h1>
            <h3 className={styles.reffernce}>Booking Reference ID: <span className={styles.refferenceId}>21313498328</span></h3>
            <img className={styles.detailsBackground} src={`${DetailsBackground}`} alt="details" />
            <h4>Crowne Plaza Hotel Beijing Wangfujing</h4>
            {this.renderHotelStars()}
            <hr className={styles.horizonatName} />
            <div className={styles.visitInfo}>
              <h3 className={styles.checkInHeader}>Check In</h3>
              <h3 className={styles.checkOutHeader}>Check Out</h3>
              <h3 className={styles.guestsHeader}>Guests</h3>
              <h5 className={styles.checkInContent}>
                <div className={styles.marginBottom5}><span className={styles.dateInDay}>25</span> JAN, THU</div>
                <div>2PM - 10PM</div>
              </h5>
              <h5 className={styles.checkOutContent}>
                <div className={styles.marginBottom5}><span className={styles.dateOutDay}>27</span> JAN, SAT</div>
                <div>by 12PM (noon)</div>
              </h5>
              <h5 className={styles.guestsContent}>2</h5>
            </div>
            <h3>Room Type</h3>
            <h5 className={styles.marginBottom5}>Double (1 King Bed / Premier Room / Nonsmoking)</h5>
            <h3>Board Type</h3>
            <h5>Breakfast</h5>
            <hr className={styles.horizonatName} />
            <h3>Address</h3>
            <h5>48 Wangfujing Avenue, Dongcheng District, Beijing, China, 100006</h5>
          </div>
          <iframe className={styles.addressMap} title="location" src={`https://maps.google.com/maps?q=${39.918598},${116.411622}&z=15&output=embed`} frameBorder="0" />
          <hr className={styles.horizonatName} />
          <div className={`${styles.withPadding}`}>
            <h4><Link className={[styles.directions, styles.buttonRegular]} to="#">Get Directions</Link></h4>
            <hr />
            <h4 className={styles.contactInfo}>Contact Hotel</h4>
          </div>
          <div className={styles.essentialInfo}>
            <h4>Essential Information</h4>
            <h5>No amendments or name changes can be made to this booking once it is confirmed.</h5>
          </div>
        </section>
        <section className={styles.detailsButtonsWrapper}>
          <Link className={`btn ${styles.buttonRegular}`} to="#">Print this page</Link>
          <Link className={`btn ${styles.buttonRegular}`} to="/profile/trips/hotels">Back to Hotels</Link>
        </section>
      </div>
    );
  }
}
