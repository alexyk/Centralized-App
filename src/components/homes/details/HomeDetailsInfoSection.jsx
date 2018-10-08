import PropTypes from 'prop-types';
import HomeDetailsReviewBox from './HomeDetailsReviewBox';
import React from 'react';
import { withRouter } from 'react-router-dom';
import '../../../styles/css/components/home/details/home-details-info-section.css';
import Facilities from '../../hotels/details/Facilities';

import HomeDetailsBookingPanel from './HomeDetailsBookingPanel';
import RoomSpaceInformationBox from '../common/RoomSpaceInformationBox';
import RoomAccommodationBox from '../common/RoomAccommodationBox';

import MyMapComponent from './MyMapComponent';
import '../../../styles/css/components/homes/booking/homes-booking-page.css';

import HomeDetailsRatingBox from './HomeDetailsRatingBox';
import { setCheckInOutHours } from '../common/detailsPageUtils.js';

class HomeDetailsInfoSection extends React.Component {
  componentDidMount() {
    setCheckInOutHours(this.props.checks);
  }

  render() {
    if (this.props.roomDetails === null || this.props.checks === null) {
      return <div className="loader"></div>;
    }

    const { property_type,
      guests,
      size,
      bathroom,
      bedrooms,
      eventsAllowed,
      smokingAllowed,
      suitableForPets,
      suitableForInfants,
      house_rules } = this.props.roomDetails;

    const { averageRating,
      city,
      country,
      amenities,
      name,
      descriptionText,
      reviews,
      latitude,
      currencyCode,
      cleaningFee,
      longitude } = this.props.data;

    const hasSpaceDetails = property_type || guests || size || bathroom || bedrooms;
    const hasHouseRules = eventsAllowed || smokingAllowed || suitableForPets || suitableForInfants || house_rules;
    const houseRules = house_rules && house_rules.split('\r\n');

    const guestArray = [];
    if (guests) {
      for (let i = 1; i <= guests; i++) {
        guestArray.push(i);
      }
    }
    else {
      for (let i = 1; i <= 10; i++) {
        guestArray.push(i);
      }
    }

    return (
      <section className="home-container">
        <div className="home-box" id="home-box">
          <div className="home-content" id="overview">
            <p className="location">{city.name} &bull; {country.name}</p>
            <h1>{name}</h1>
            {averageRating > 0 && <HomeDetailsRatingBox rating={averageRating} reviewsCount={0} />}

            {hasSpaceDetails &&
              <RoomSpaceInformationBox
                property_type={property_type}
                guests={guests}
                size={size}
                bathroom={bathroom}
                bedrooms={bedrooms} />
            }

            <div className="list-hotel-description">
              <h2>Description</h2>
              <hr />
              {descriptionText}
            </div>

            <Facilities facilities={amenities} />

            {hasHouseRules &&
              <div className="hotel-rules-container">
                <h2>House Rules</h2>
                <hr />
                {eventsAllowed && <p>Events allowed</p>}
                {smokingAllowed && <p>Smoking allowed</p>}
                {suitableForInfants && <p>Suitable for infants</p>}
                {suitableForPets && <p>Suitable for pets</p>}
                {houseRules && houseRules.map((rule, index) => {
                  return (<p key={index}>{rule}</p>);
                })}
              </div>
            }

            <RoomAccommodationBox
              checkInStart={this.props.checks.checkInStart}
              checkInEnd={this.props.checks.checkInEnd}
              checkOutStart={this.props.checks.checkOutStart}
              checkOutEnd={this.props.checks.checkOutEnd} />

            {reviews && reviews.length > 0 &&
              <div id="reviews">
                <h2>User Rating &amp; Reviews</h2>
                {reviews.map((item, i) => {
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

            <div id="location">
              <h2>Location</h2>
              <hr />
              <MyMapComponent key="map" latitude={latitude} longitude={longitude} />
            </div>
          </div>
          <HomeDetailsBookingPanel
            startDate={this.props.startDate}
            endDate={this.props.endDate}
            handleChangeStart={this.props.handleChangeStart}
            handleChangeEnd={this.props.handleChangeEnd}
            calendar={this.props.calendar}
            nights={this.props.nights}
            guestArray={guestArray}
            cleaningFee={cleaningFee}
            currencyCode={currencyCode}
          />
        </div>
      </section >
    );
  }
}

HomeDetailsInfoSection.propTypes = {
  data: PropTypes.object,
  isLogged: PropTypes.bool,
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  match: PropTypes.object,
  openModal: PropTypes.func,
  calendar: PropTypes.array,

  // start Router props
  location: PropTypes.object,

};



export default withRouter(HomeDetailsInfoSection);
