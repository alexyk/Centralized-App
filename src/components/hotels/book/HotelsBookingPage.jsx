import { LONG } from '../../../constants/notificationDisplayTimes.js';
import { INVALID_CHILD_AGE, INVALID_GUEST_NAME } from '../../../constants/warningMessages.js';

import { Config } from '../../../config';
import { CurrencyConverter } from '../../../services/utilities/currencyConverter';
import { NotificationManager } from 'react-notifications';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import queryString from 'query-string';
import { setCurrency } from '../../../actions/paymentInfo';
import { withRouter } from 'react-router-dom';
import BookingSteps from '../../common/utility/BookingSteps';
import { RoomsXMLCurrency } from '../../../services/utilities/roomsXMLCurrency';
import LocPrice from '../../common/utility/LocPrice';
import validator from 'validator';

class HotelsBookingPage extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.getQueryString = this.getQueryString.bind(this);
  }

  calculateRoomsTotalPrice(rooms) {
    let total = 0;
    for (let i = 0; i < rooms.length; i++) {
      total += rooms[i].price;
    }

    return total;
  }

  calculateReservationTotalNights(search) {
    const searchParams = queryString.parse(search);
    const start = moment(searchParams.startDate, 'DD/MM/YYYY');
    const end = moment(searchParams.endDate, 'DD/MM/YYYY');
    return end.diff(start, 'days');
  }

  handleSubmit() {
    if (!this.isValidNames()) {
      NotificationManager.warning(INVALID_GUEST_NAME, '', LONG);
    } else if (!this.isValidAges()) {
      NotificationManager.warning(INVALID_CHILD_AGE, '', LONG);
    } else {
      const queryParams = queryString.parse(this.props.location.search);
      const id = this.props.match.params.id;
      const query = this.getQueryString(queryParams);
      const isWebView = this.props.location.pathname.indexOf('/mobile') !== -1;
      const rootURL = !isWebView ? `/hotels/listings/book/${id}/confirm` : '/mobile/book/confirm';
      this.props.history.push(`${rootURL}${query}`);
    }
  }

  getQueryString(queryStringParameters) {
    let queryString = '?';
    queryString += 'region=' + encodeURI(queryStringParameters.region);
    queryString += '&currency=' + encodeURI(queryStringParameters.currency);
    queryString += '&startDate=' + encodeURI(queryStringParameters.startDate);
    queryString += '&endDate=' + encodeURI(queryStringParameters.endDate);
    queryString += '&rooms=' + encodeURI(JSON.stringify(this.props.guests));
    queryString += '&quoteId=' + encodeURI(queryStringParameters.quoteId);
    return queryString;
  }

  isValidNames() {
    const regexp = /^([A-Za-z]{2,}([-\s][A-Za-z]{2,})?)$/;
    const rooms = this.props.guests;
    for (let i = 0; i < rooms.length; i++) {
      const adults = rooms[i].adults;
      for (let j = 0; j < adults.length; j++) {
        const first = adults[j].firstName;
        const last = adults[j].lastName;
        if (!(validator.matches(first, regexp) && validator.matches(last, regexp))) {
          return false;
        }
      }
    }

    return true;
  }

  isValidAges() {
    const rooms = this.props.guests;
    for (let i = 0; i < rooms.length; i++) {
      const children = rooms[i].children;
      for (let j = 0; j < children.length; j++) {
        const age = children[j].age;
        if (age < 1 || 17 < age) {
          return false;
        }
      }
    }

    return true;
  }

  render() {
    if (!this.props.hotel) {
      return (<div className="loader"></div>);
    }

    if (!this.props.rooms) {
      return (<div className="loader"></div>);
    }

    if (!this.props.rates) {
      return (<div className="loader"></div>);
    }

    const hotelName = this.props.hotel && this.props.hotel.name;
    const hotelMainAddress = this.props.hotel && this.props.hotel.additionalInfo.mainAddress;
    const hotelCityName = this.props.hotel && this.props.hotel.city;
    const totalPrice = this.calculateRoomsTotalPrice(this.props.rooms);
    const guests = this.props.guests;
    const rates = this.props.rates;
    const currency = this.props.paymentInfo.currency;
    const hotelPicUrl = this.props.hotel.hotelPhotos && this.props.hotel.hotelPhotos.length > 0 ? this.props.hotel.hotelPhotos[0].url : '/listings/images/default.png';
    const priceInSelectedCurrency = Number(CurrencyConverter.convert(rates, RoomsXMLCurrency.get(), currency, totalPrice)).toFixed(2);
    const nights = this.calculateReservationTotalNights(this.props.location.search);

    return (
      <div>
        <BookingSteps steps={['Provide Guest Information', 'Review Room Details', 'Confirm and Pay']} currentStepIndex={1} />

        <div>
          <section id="room-book">
            <div className="container">
              <div className="col-md-5" style={{ 'padding': '0', 'margin': '0' }}>
                <div className="hotel-info">
                  <div className="hotel-picture">
                    <img src={`${Config.getValue('imgHost')}${hotelPicUrl}`} alt="Hotel" />
                  </div>
                  <h6>{hotelName}</h6>
                  <h6>{hotelMainAddress}&nbsp;{hotelCityName}</h6>
                  <hr />
                  {this.props.rooms && this.props.rooms.map((room, index) => {
                    return (
                      <h6 key={index}>
                        {room.name}, {nights} nights: {this.props.paymentInfo.currencySign}{rates && (CurrencyConverter.convert(rates, RoomsXMLCurrency.get(), currency, room.price)).toFixed(2)} <LocPrice fiat={room.price} />
                      </h6>
                    );
                  })}
                  <hr />
                  <h6 className="total-price">
                    Total: {this.props.paymentInfo.currencySign}{priceInSelectedCurrency} {totalPrice && <LocPrice fiat={totalPrice} />}
                  </h6>
                  <div className="clearfix"></div>
                </div>
              </div>
              <div className="col-md-7" style={{ 'padding': '0', 'margin': '20px 0' }}>
                {guests && guests.map((room, roomIndex) => {
                  return (
                    <div className="form-group" key={roomIndex}>
                      <h4>Room</h4>
                      <hr className="sm-none" />
                      {room && room.adults.map((adult, adultIndex) => {
                        return (
                          <div className="form-row" key={adultIndex}>
                            <label htmlFor="title">Guest</label>
                            <select
                              className="title-select"
                              name="title"
                              value={this.props.guests[roomIndex].adults[adultIndex].title}
                              onChange={(e) => { this.props.handleAdultChange(e, roomIndex, adultIndex); }}
                            >
                              <option value="Mr">Mr</option>
                              <option value="Mrs">Mrs</option>
                            </select>

                            <input className="guest-name"
                              type="text"
                              placeholder="First Name"
                              name="firstName"
                              value={this.props.guests[roomIndex].adults[adultIndex].firstName || ''}
                              onChange={(e) => { this.props.handleAdultChange(e, roomIndex, adultIndex); }}
                            />
                            <input
                              className="guest-name"
                              type="text"
                              placeholder="Last Name"
                              value={this.props.guests[roomIndex].adults[adultIndex].lastName || ''}
                              name="lastName" onChange={(e) => { this.props.handleAdultChange(e, roomIndex, adultIndex); }}
                            />
                          </div>
                        );
                      })}

                      {room && room.children.map((child, childIndex) => {
                        return (
                          <div className="form-row" key={childIndex}>
                            <label htmlFor="age">Child (age)</label>
                            <input className="child-age" type="number" value={this.props.guests[roomIndex].children[childIndex].age} placeholder="Age" name="age" onChange={(e) => { this.props.handleChildAgeChange(e, roomIndex, childIndex); }} />
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
              <div className="col col-md-12" style={{ 'padding': '0', 'margin': '10px 0' }}>
                <button className="btn btn-primary btn-book" onClick={this.handleSubmit}>Proceed</button>
              </div>
              {this.props.location.pathname.indexOf('/mobile') !== -1 &&
                <div>
                  <div className="col col-md-12" style={{ 'padding': '0', 'margin': '10px 0' }}>
                    <button className="btn btn-primary btn-book" onClick={() => this.props.history.goBack()}>Back</button>
                  </div>
                  <select
                    className="currency"
                    value={this.props.paymentInfo.currency}
                    style={{ 'height': '40px', 'marginBottom': '10px', 'textAlignLast': 'right', 'paddingRight': '45%', 'direction': 'rtl' }}
                    onChange={(e) => this.props.dispatch(setCurrency(e.target.value))}
                  >
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              }
            </div>
          </section>
        </div>
      </div>
    );
  }
}

HotelsBookingPage.propTypes = {
  userInfo: PropTypes.object,
  match: PropTypes.object,

  // start Router props
  history: PropTypes.object,
  location: PropTypes.object,

  // start Redux props
  dispatch: PropTypes.func,
  paymentInfo: PropTypes.object
};

function mapStateToProps(state) {
  const { paymentInfo } = state;
  return {
    paymentInfo
  };
}

export default withRouter(connect(mapStateToProps)(HotelsBookingPage));
