import ContactHostModal from '../../common/modals/ContactHostModal';
import PropTypes from 'prop-types';
import HomeDetailsCalendar from './HomeDetailsCalendar';
import HomeDetailsReviewBox from './HomeDetailsReviewBox';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { openModal } from '../../../actions/modalsInfo.js';
import { LOGIN } from '../../../constants/modals.js';

import '../../../styles/css/components/home/details/home-details-info-section.css';
import '../../../styles/css/components/homes/property/calendar.css';
import DetailsRatingBox from './DetailsRatingBox'
import Facilities from '../../hotels/details/Facilities';
import $ from 'jquery';
import SearchBarDatePicker from '../../common/search/SearchBarDatePicker';

class HomeDetailsInfoSection extends React.Component {
  constructor(props) {
    super(props);
    
    this.isInvalidDate = this.isInvalidDate.bind(this);
  }
  isInvalidDate(date) {
    let allEvents = this.props.allEvents;
    allEvents = allEvents.filter(x => x.available === false);
    if(allEvents.filter(x => x.start.isSame(date)).length > 0) {
      return true;
    }
    return false;
  }

  render() {
    const { averageRating, city, country, calendar, amenities } = this.props.data;
    if (calendar === null) {
      return <div>Loading...</div>;
    }
    return (
      <section className="home-container">
        <div className="home-box" id="home-box">
          <div className="home-content" id="overview">
            <ContactHostModal id={this.props.match.params.id} isActive={this.props.isShownContactHostModal} closeModal={this.props.closeModal} sendMessageToHost={this.props.sendMessageToHost} />

            <p className="location">{city.name} &bull; {country.name}</p>
            <h1>{this.props.data.name}</h1>
            <DetailsRatingBox rating={averageRating} reviewsCount={0} />

            <div className="list-hotel-description">
              <h2>Description</h2>
              <hr />
              {this.props.data.descriptionText}
            </div>

            <Facilities facilities={amenities} />

            <div className="hotel-extras">
              {this.props.descriptionsAccessInfo &&
                <div id="hotel-rules">
                  <h2>Access info</h2>
                  <p>{this.props.data.descriptionsAccessInfo}</p>
                  <hr />
                </div>
              }
            </div>

            {/* {props.userInfo.isLogged ?
                  <Link to={`/homes/listings/book/${props.match.params.id}${props.location.search}`} className="btn btn-primary btn-home-details-info-section-container">Book Now</Link> :
                  <button className="btn btn-primary" onClick={(e) => props.dispatch(openModal(LOGIN, e))}>Login</button>} */}

            {this.props.data.reviews && this.props.data.reviews.length > 0 &&
              <div id="reviews">
                <h2>User Rating &amp; Reviews</h2>
                {this.props.data.reviews.map((item, i) => {
                  return (
                    <HomeDetailsReviewBox
                      key={i}
                      rating={item.average}
                      reviewText={item.comments}
                    />
                  );
                })}
                <hr />
              </div>
            }

            <div id="map">
              <h2>Location</h2>
              <iframe title="location" src={`https://maps.google.com/maps?q=${this.props.data.longitude},${this.props.data.latitude}&z=15&output=embed`}
                width="100%" height="400" frameBorder="0" style={{ border: 0 }} />
              <hr />
            </div>
          </div>
          <div className="home-booking-panel">
            <div className="box" id="test">
              <p className="default-price"><span className="main-fiat">{this.props.paymentInfo.currencySign}{this.props.data.defaultDailyPrice}</span> (62 LOC) /per night</p>
              <div className="booking-dates">
                <SearchBarDatePicker onApply={this.props.onApply} startDate={this.props.startDate} endDate={this.props.endDate} nights={this.props.nights} isInvalidDate={this.isInvalidDate} />
                <div className="days-of-stay">
                  <span className="icon-moon"></span>
                  <span>{this.props.nights} nights</span>
                </div>
              </div>
              <div className="booking-guests">
                <select>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, i) => {
                    return <option>{`${item} Guests`}</option>
                  })}
                </select>
              </div>
              <div className="fiat-price-box">
                <div className="without-fees">
                  <p>{this.props.paymentInfo.currencySign}{this.props.data.defaultDailyPrice}  x {this.props.nights} nights</p>
                  <p>{this.props.paymentInfo.currencySign}{this.props.data.defaultDailyPrice * this.props.nights}</p>
                </div>
                <div className="cleaning-fee">
                  <p>Cleaning fee</p>
                  <p>{this.props.paymentInfo.currencySign}{this.props.data.cleaningFees[this.props.paymentInfo.currency]}</p>
                </div>
                <div className="total">
                  <p>Total</p>
                  <p>{this.props.paymentInfo.currencySign}{(this.props.data.defaultDailyPrice * this.props.nights) + this.props.data.cleaningFees[this.props.paymentInfo.currency]}</p>
                </div>
              </div>
              <button className="pay-in">Request Booking in FIAT</button>
              {/* <hr /> */}
              <div className="loc-price-box">
                <div className="without-fees">
                  <p>{Math.round(this.props.data.defaultDailyPrice / this.props.paymentInfo.locRate, 4)} LOC x {this.props.nights} nights</p>
                  <p>272 LOC </p>
                </div>
                <div className="cleaning-fee">
                  <p>Cleaning fee</p>
                  <p>48 LOC</p>
                </div>
                <div className="total">
                  <p>Total</p>
                  <p>320 LOC</p>
                </div>
              </div>
              <button className="pay-in">Request Booking in LOC</button>
              <p className="booking-helper">You won't be charged yet</p>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

HomeDetailsInfoSection.propTypes = {
  data: PropTypes.object,
  locRate: PropTypes.string,
  showLoginModal: PropTypes.bool,
  isLogged: PropTypes.bool,
  nights: PropTypes.number,
  onApply: PropTypes.func,
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  loading: PropTypes.bool,
  descriptionsAccessInfo: PropTypes.string,
  match: PropTypes.object,
  isShownContactHostModal: PropTypes.bool,
  closeModal: PropTypes.func,
  sendMessageToHost: PropTypes.func,
  allEvents: PropTypes.array,
  prices: PropTypes.array,
  openModal: PropTypes.func,
  calendar: PropTypes.array,
  descriptionText: PropTypes.string,

  // start Router props
  location: PropTypes.object,

  // Redux props
  dispatch: PropTypes.func,
  userInfo: PropTypes.object
};

function mapStateToProps(state) {
  const { userInfo, paymentInfo } = state;
  return {
    userInfo,
    paymentInfo
  };
}

export default withRouter(connect(mapStateToProps)(HomeDetailsInfoSection));
