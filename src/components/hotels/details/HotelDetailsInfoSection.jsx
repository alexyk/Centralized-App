import HotelDetailsReviewBox from './HotelDetailsReviewBox';
import { LOGIN, EMAIL_VERIFICATION } from '../../../constants/modals.js';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { openModal } from '../../../actions/modalsInfo.js';
import { withRouter } from 'react-router-dom';
import { CurrencyConverter } from '../../../services/utilities/currencyConverter';
import { RoomsXMLCurrency } from '../../../services/utilities/roomsXMLCurrency';
import Facilities from './Facilities';
import requester from '../../../requester';
import LocPrice from '../../common/utility/LocPrice';

function HotelDetailsInfoSection(props) {
  const getTotalPrice = (room) => {
    let total = 0;
    for (let i = 0; i < room.length; i++) {
      total += room[i].price;
    }

    return total;
  };

  const calculateStars = (ratingNumber) => {
    let starsElements = [];
    let rating = Math.round(ratingNumber);
    for (let i = 0; i < rating; i++) {
      starsElements.push(<span key={i} className="full-star"></span>);
    }

    return starsElements;
  };

  const hangleBookNowClick = (resultIndex) => {
    requester.getUserInfo().then(res => res.body)
      .then(data => {
        const { isEmailVerified } = data;
        if (!isEmailVerified) {
          props.dispatch(openModal(EMAIL_VERIFICATION));
        } else {
          props.handleBookRoom(roomsResults.slice(resultIndex));
        }
      });
  };

  const getButton = (resultIndex) => {
    if (!props.userInfo.isLogged) {
      return <button className="btn btn-primary" onClick={(e) => props.dispatch(openModal(LOGIN, e))}>Login</button>;
    } else {
      return <button className="btn btn-primary" onClick={() => hangleBookNowClick(resultIndex)}>Book Now</button>;
    }
  };

  const { hotelAmenities, city, country, generalDescription } = props.hotel;
  const address = props.hotel.additionalInfo.mainAddress;
  const rooms = props.hotelRooms;
  let roomsResults = [];
  if (rooms) {
    const usedRoomsByTypeAndMeal = {};
    for (let room of rooms) {
      let key = '';
      let price = 0;
      for (let result of room.roomsResults) {
        key += result.name + '|' + result.mealType + '%';
        price += result.price;
      }
      if (!usedRoomsByTypeAndMeal.hasOwnProperty(key)) {
        usedRoomsByTypeAndMeal[key] = [];
      }
      usedRoomsByTypeAndMeal[key].push({
        totalPrice: price,
        quoteId: room.quoteId,
        roomsResults: room.roomsResults,
        key: key
      });
    }
    for (let key in usedRoomsByTypeAndMeal) {
      roomsResults.push(usedRoomsByTypeAndMeal[key].sort((x, y) => x.totalPrice > y.totalPrice ? 1 : -1));
    }
    roomsResults = roomsResults.sort((x, y) => getTotalPrice(x[0].roomsResults) > getTotalPrice(y[0].roomsResults) ? 1 : -1);
  }

  const currency = props.paymentInfo.currency;
  const roomsXMLCurrency = RoomsXMLCurrency.get();

  return (
    <section id="hotel-info">
      <div className="container">
        <div className="hotel-content" id="hotel-section">
          <h2> {props.hotel.name} </h2>
          <div className="list-hotel-rating">
            <div className="list-hotel-rating-stars">
              {calculateStars(props.hotel.star)}
            </div>
          </div>
          <div className="clearfix" />
          <p>{address} {city}, {country}</p>
          <div className="list-hotel-description">
            <h2>Description</h2>
            <span dangerouslySetInnerHTML={{ __html: generalDescription }}></span>
          </div>

          <Facilities facilities={hotelAmenities} />

          <div className="hotel-extras">
            {props.descriptionsAccessInfo &&
              <div id="hotel-rules">
                <h2>Access info</h2>
                <p>{props.hotel.descriptionsAccessInfo}</p>
                <hr />
              </div>
            }
            <div className="clearfix" />

            {props.hotel.reviews && props.hotel.reviews.length > 0 &&
              <div id="reviews">
                <h2>User Rating &amp; Reviews</h2>
                {props.hotel.reviews.map((item, i) => {
                  return (
                    <HotelDetailsReviewBox
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

            <div id="rooms">
              <h2>Available Rooms</h2>
              {props.loadingRooms
                ? <div className="loader"></div>
                : <div>{roomsResults && roomsResults.map((results, resultIndex) => {
                  return (
                    <div key={resultIndex} className="row room-group">
                      <div className="col col-md-6 parent vertical-block-center">
                        <div className="room-titles">
                          {results[0].roomsResults && results[0].roomsResults.map((room, roomIndex) => {
                            return (
                              <div key={roomIndex} className="room">
                                <span>{room.name} ({room.mealType}) - </span>
                                {props.userInfo.isLogged &&
                                  <span>{props.currencySign}{props.rates && Number((CurrencyConverter.convert(props.rates, roomsXMLCurrency, currency, room.price)) / props.nights).toFixed(2)} </span>
                                }
                                <LocPrice fiat={room.price / props.nights} />
                                / night
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="col col-md-3">
                        <div className="book-details vertical-block-center">
                          <span className="price-details">
                            <span>{props.nights} {props.nights === 1 ? 'night: ' : 'nights: '}</span>
                            {props.userInfo.isLogged &&
                              <span>{props.currencySign}{props.rates && Number(CurrencyConverter.convert(props.rates, roomsXMLCurrency, currency, getTotalPrice(results[0].roomsResults))).toFixed(2)} </span>
                            }
                            <LocPrice fiat={getTotalPrice(results[0].roomsResults)} />
                          </span>
                        </div>
                      </div>
                      <div className="col col-md-3 content-center">
                        {getButton(resultIndex)}
                      </div>
                    </div>
                  );
                })}
                </div>
              }
            </div>
            <div className="clearfix" />

            <div id="map">
              <h2>Location</h2>
              <iframe title="location" src={`https://maps.google.com/maps?q=${props.hotel.latitude},${props.hotel.longitude}&z=15&output=embed`}
                width="100%" height="400" frameBorder="0" style={{ border: 0 }} />
              <hr />
            </div>
            <div className="clearfix" />
          </div>
          <div className="clearfix"></div>
        </div>
      </div>
    </section>
  );
}

HotelDetailsInfoSection.propTypes = {
  hotel: PropTypes.object,
  hotelRooms: PropTypes.array,
  showLoginModal: PropTypes.bool,
  isLogged: PropTypes.bool,
  userInfo: PropTypes.object,
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
  descriptionText: PropTypes.string,
  handleBookRoom: PropTypes.func,
  loadingRooms: PropTypes.bool,
  currencySign: PropTypes.string,
  rates: PropTypes.object,

  // Redux props
  paymentInfo: PropTypes.object,
  dispatch: PropTypes.func,
};

function mapStateToProps(state) {
  const { userInfo, paymentInfo } = state;
  return {
    userInfo,
    paymentInfo
  };
}

export default withRouter(connect(mapStateToProps)(HotelDetailsInfoSection));
