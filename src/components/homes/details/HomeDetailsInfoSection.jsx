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

import Facilities from '../../hotels/details/Facilities';

function HomeDetailsInfoSection(props) {
  // const getAmenities = (amenities) => {
  //   const result = new Array(3);
  //   for (let i = 0; i < 3; i++) {
  //     result[i] = new Array(0);
  //   }

  //   for (let i = 0; i < amenities.length; i++) {
  //     if (i % 3 === 0) {
  //       result[0].push(amenities[i]);
  //     } else if (i % 3 === 1) {
  //       result[1].push(amenities[i]);
  //     } else if (i % 3 === 2) {
  //       result[2].push(amenities[i]);
  //     }
  //   }

  //   return result;
  // };

  const allAmenities = props.data.amenities;
  const calendar = props.calendar;
  // const mostPopularFacilities = allAmenities.filter(a => a.picture != null).slice(0, 5);
  // const amenities = getAmenities(allAmenities);
  const { street, city, country } = props.data;
  if (calendar === null) {
    return <div>Loading...</div>;
  }
  return (
    <section id="hotel-info">
      <div className="container">
        <div className="hotel-content" id="overview">
          <ContactHostModal id={props.match.params.id} isActive={props.isShownContactHostModal} closeModal={props.closeModal} sendMessageToHost={props.sendMessageToHost} />

          <h1> {props.data.name} </h1>
          <div className="clearfix" />
          <p>{street}, {city.name}, {country.name}</p>
          <div className="btn-home-details-info-section-container">
            <button className="btn btn-primary" onClick={props.openModal}>Contact Host</button>
            {props.userInfo.isLogged ?
              <Link to={`/homes/listings/book/${props.match.params.id}${props.location.search}`} className="btn btn-primary btn-home-details-info-section-container">Book Now</Link> :
              <button className="btn btn-primary" onClick={(e) => props.dispatch(openModal(LOGIN, e))}>Login</button>}
          </div>

          {props.allEvents && <HomeDetailsCalendar
            onApply={props.onApply}
            startDate={props.startDate}
            endDate={props.endDate}
            allEvents={props.allEvents}
            prices={props.prices} />}

          <div className="list-hotel-description">
            <h2>Description</h2>
            <hr />
            {props.data.descriptionText}
          </div>

          <Facilities facilities={allAmenities} />

          <div className="hotel-extras">

            {props.descriptionsAccessInfo &&
              <div id="hotel-rules">
                <h2>Access info</h2>
                <p>{props.data.descriptionsAccessInfo}</p>
                <hr />
              </div>
            }
            <div className="clearfix" />

            {props.data.reviews && props.data.reviews.length > 0 &&
              <div id="reviews">
                <h2>User Rating &amp; Reviews</h2>
                {props.data.reviews.map((item, i) => {
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
            <div className="clearfix" />

            <div id="map">
              <h2>Location</h2>
              <iframe title="location" src={`https://maps.google.com/maps?q=${props.data.longitude},${props.data.latitude}&z=15&output=embed`}
                width="100%" height="400" frameBorder="0" style={{ border: 0 }} />
              <hr />
            </div>
            <div className="clearfix" />
          </div>
        </div>
        {/* <HomeReservationPanel
          locRate={props.locRate}
          showLoginModal={props.showLoginModal}
          isLogged={props.isLogged}
          calendar={calendar}
          nights={props.nights}
          onApply={props.onApply}
          startDate={props.startDate}
          endDate={props.endDate}
          listing={props.data}
          loading={props.loading}
        /> */}
        <div className="clearfix"></div>
      </div>
    </section>
  );
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
  const { userInfo } = state;
  return {
    userInfo
  };
}

export default withRouter(connect(mapStateToProps)(HomeDetailsInfoSection));
