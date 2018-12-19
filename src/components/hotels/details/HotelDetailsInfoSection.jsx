import HotelDetailsReviewBox from './HotelDetailsReviewBox';
import { LOGIN } from '../../../constants/modals.js';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { openModal } from '../../../actions/modalsInfo.js';
import { isLogged } from '../../../selectors/userInfo';
import { getCurrencyExchangeRates } from '../../../selectors/exchangeRatesInfo';
import { getCurrency, getCurrencySign } from '../../../selectors/paymentInfo';
import { withRouter } from 'react-router-dom';
import { CurrencyConverter } from '../../../services/utilities/currencyConverter';
import { RoomsXMLCurrency } from '../../../services/utilities/roomsXMLCurrency';
import Facilities from './Facilities';
import LocPrice from '../../common/utility/LocPrice';
import Rating from '../../common/rating';

function HotelDetailsInfoSection(props) {
  const getTotalPrice = (room) => {
    let total = 0;
    for (let i = 0; i < room.length; i++) {
      total += room[i].price;
    }

    return total;
  };

  // const calculateStars = (ratingNumber) => {
  //   let starsElements = [];
  //   let rating = Math.round(ratingNumber);
  //   for (let i = 0; i < rating; i++) {
  //     starsElements.push(<span key={i} className="full-star"></span>);
  //   }

  //   return starsElements;
  // };

  const hangleBookNowClick = (resultIndex) => {
    // requester.getUserInfo().then(res => res.body)
    //   .then(data => {
    //     const { isEmailVerified } = data;
    //     if (!isEmailVerified) {
    //       props.dispatch(openModal(EMAIL_VERIFICATION));
    //     } else {
    props.handleBookRoom(roomsResults.slice(resultIndex));
    //   }
    // });
  };

  const getButton = (resultIndex) => {
    if (!props.isUserLogged) {
      return <button className="button" onClick={(e) => props.dispatch(openModal(LOGIN, e))}>Login</button>;
    } else {
      return <button className="button" onClick={() => hangleBookNowClick(resultIndex)}>Book Now</button>;
    }
  };

  const { hotelAmenities, city, country, generalDescription, additionalInfo } = props.hotel;
  const address = additionalInfo.mainAddress;
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

  const { currency, currencySign, currencyExchangeRates, isUserLogged, hotel, loadingRooms, nights } = props;
  const roomsXMLCurrency = RoomsXMLCurrency.get();

  return (
    <section id="hotel-info">
      <div className="container">
        <div className="hotel-content" id="hotel-section">
          <h2> {hotel.name} </h2>
          <Rating rating={hotel.star} />
          {/* <div className="list-hotel-rating">
            <div className="list-hotel-rating-stars">
              {calculateStars(hotel.star)}
            </div>
          </div> */}
          {/* <div className="clearfix" /> */}
          <p>{address} {city}, {country}</p>
          <div className="list-hotel-description">
            <h2>Description</h2>
            <span dangerouslySetInnerHTML={{ __html: generalDescription }}></span>
          </div>

          <Facilities facilities={hotelAmenities} />

          <div className="hotel-extras">
            {hotel.descriptionsAccessInfo &&
              <div id="hotel-rules">
                <h2>Access info</h2>
                <p>{hotel.descriptionsAccessInfo}</p>
                <hr />
              </div>
            }
            <div className="clearfix" />

            {hotel.reviews && hotel.reviews.length > 0 &&
              <div id="reviews">
                <h2>User Rating &amp; Reviews</h2>
                {hotel.reviews.map((item, i) => {
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

            {loadingRooms
              ? <div className="loader"></div>
              :
              roomsResults && roomsResults.length > 0 &&
              <div id="rooms">
                <h2>Available Rooms</h2>
                <div>{roomsResults.map((results, resultIndex) => {
                  return (
                    <div key={resultIndex} className="row room-group">
                      <div className="col col-md-6 parent vertical-block-center">
                        <div className="room-titles">
                          {results[0].roomsResults && results[0].roomsResults.map((room, roomIndex) => {
                            return (
                              <div key={roomIndex} className="room">
                                <span>{room.name} ({room.mealType}) - </span>
                                {isUserLogged &&
                                  <span>{currencySign}{currencyExchangeRates && Number((CurrencyConverter.convert(currencyExchangeRates, roomsXMLCurrency, currency, room.price)) / nights).toFixed(2)} </span>
                                }
                                <LocPrice fiat={room.price / nights} />
                                / night
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="col col-md-3">
                        <div className="book-details vertical-block-center">
                          <span className="price-details">
                            <span>{nights} {nights === 1 ? 'night: ' : 'nights: '}</span>
                            {isUserLogged &&
                              <span>{currencySign}{currencyExchangeRates && Number(CurrencyConverter.convert(currencyExchangeRates, roomsXMLCurrency, currency, getTotalPrice(results[0].roomsResults))).toFixed(2)} </span>
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
              </div>
            }
            <div className="clearfix" />

            <div id="map">
              <h2>Location</h2>
              <iframe title="location" src={`https://maps.google.com/maps?q=${hotel.latitude},${hotel.longitude}&z=15&output=embed`}
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
  nights: PropTypes.number,
  loading: PropTypes.bool,
  handleBookRoom: PropTypes.func,
  loadingRooms: PropTypes.bool,

  // Redux props
  dispatch: PropTypes.func,
  isUserLogged: PropTypes.bool,
  currency: PropTypes.string,
  currencySign: PropTypes.string,
  currencyExchangeRates: PropTypes.object,
};

function mapStateToProps(state) {
  const { userInfo, paymentInfo, exchangeRatesInfo } = state;
  return {
    isUserLogged: isLogged(userInfo),
    currency: getCurrency(paymentInfo),
    currencySign: getCurrencySign(paymentInfo),
    currencyExchangeRates: getCurrencyExchangeRates(exchangeRatesInfo)
  };
}

export default withRouter(connect(mapStateToProps)(HotelDetailsInfoSection));
