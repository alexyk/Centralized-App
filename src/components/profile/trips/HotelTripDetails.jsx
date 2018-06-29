import React from 'react';
import { Link } from 'react-router-dom';
import DetailsBackground from '../../../styles/images/background.png';
import LogoLockTrip from '../../../styles/images/logolocktrip.png';
import Star from '../../../styles/images/star.png';
import FillStar from '../../../styles/images/fill-star.png';
import AddressMap from '../../../styles/images/map.png';

import '../../../styles/css/components/profile/trips/details.css';

export default class HotelTripDetails extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  renderHotelStars() {
    const maxCountOfStars = 5;
    const hotelStarsCount = Math.round(4.4);

    let stars = [];

    for (let i = 0; i < maxCountOfStars; i++) {
      if (i < hotelStarsCount) {
        stars.push(<img src={FillStar} key={`fill-star-${i}`} alt="fill-star" />);
      } else {
        stars.push(<img src={Star} key={`star-${i}`} alt="star" />);
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

  render() {
    return (
      <div className="hotel-trip-details">
        <div className="logo-container">
          <img width="200" src={`${LogoLockTrip}`} alt="lock-trip-logo" />
        </div>
        <div>
          <section className="details-view">
            <div className="with-padding">
              <h1>Your reservation is confirmed</h1>
              <h3 className="reffernce">Booking Reference ID: <span className="refference-id">21313498328</span></h3>
              <img className="details-background" src={`${DetailsBackground}`} alt="details" />
              <h4>Crowne Plaza Hotel Beijing Wangfujing</h4>
              {this.renderHotelStars()}
              <hr />
              <div className="visit-info">
                <h3 className="check-in-header">Check In</h3>
                <h3 className="check-out-header">Check Out</h3>
                <h3 className="guests-header">Guests</h3>
                <h5 className="check-in-content">
                  <div><span className="date-in-day">25</span> JAN, THU</div>
                  <div>2PM - 10PM</div>
                </h5>
                <h5 className="check-out-content">
                  <div><span className="date-out-day">27</span> JAN, SAT</div>
                  <div>by 12PM (noon)</div>
                </h5>
                <h5 className="guests-content">2</h5>
              </div>
              <h3>Room Type</h3>
              <h5 style={{ marginBottom: '5%' }}>Double (1 King Bed / Premier Room / Nonsmoking)</h5>
              <h3>Board Type</h3>
              <h5>Breakfast</h5>
              <hr />
              <h3>Address</h3>
              <h5>48 Wangfujing Avenue, Dongcheng District, Beijing, China, 100006</h5>
            </div>
            <img className="address-map" src={AddressMap} alt="address-map" />
            <div className="with-padding">
              <h4><Link className="directions" to="#">Get Directions</Link></h4>
              <hr />
              <h4 className="contact-info">Contact Hotel</h4>
            </div>
            <div className="essential-info">
              <h4>Essential Information</h4>
              <h5>No amendments or name changes can be made to this booking once it is confirmed.</h5>
            </div>
          </section>
          <section className="details-buttons">
            <Link className="btn btn-primary details-print" to="#">Print this page</Link>
            <Link className="btn btn-primary details-back" to="/profile/trips/hotels">Back to Hotels</Link>
          </section>
        </div>
      </div>
    );
  }
}
