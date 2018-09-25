import { LONG } from '../../../constants/notificationDisplayTimes.js';
import { INVALID_CHILD_AGE, INVALID_GUEST_NAME, ROOM_NO_LONGER_AVAILABLE } from '../../../constants/warningMessages.js';

import { Config } from '../../../config';
import { CurrencyConverter } from '../../../services/utilities/currencyConverter';
import { NotificationManager } from 'react-notifications';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import queryString from 'query-string';
import requester from '../../../requester';
import { setCurrency } from '../../../actions/paymentInfo';
import validator from 'validator';
import { withRouter } from 'react-router-dom';
import BookingSteps from '../../common/utility/BookingSteps';
import { RoomsXMLCurrency } from '../../../services/utilities/roomsXMLCurrency';
import LocPrice from '../../common/utility/LocPrice';

class HotelsBookingPage extends React.Component {
  constructor(props) {
    super(props);

    const searchString = this.getSearchParams();

    this.state = {
      rooms: this.getRoomsFromURL(searchString),
      data: null,
      loading: true,
      userInfo: {}
    };

    this.handleAdultChange = this.handleAdultChange.bind(this);
    this.handleChildAgeChange = this.handleChildAgeChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.requestHotel = this.requestHotel.bind(this);
    this.requestHotelRooms = this.requestHotelRooms.bind(this);
    this.requestCurrencyRates = this.requestCurrencyRates.bind(this);
    this.requestUserInfo = this.requestUserInfo.bind(this);
    this.getQueryString = this.getQueryString.bind(this);
    this.getRequestSearchParams = this.getRequestSearchParams.bind(this);
  }

  componentDidMount() {
    this.requestHotel();
    this.requestHotelRooms();
    this.requestCurrencyRates();
  }

  requestHotel() {
    const id = this.props.match.params.id;
    const searchParams = this.getRequestSearchParams();
    const searchString = this.getSearchParams();
    const quoteId = searchString.get('quoteId');
    const rooms = this.getRoomsFromURL(searchString);
    const nights = this.calculateReservationTotalNights(searchString);
    searchParams.pop();
    requester.getHotelById(id, searchParams).then(res => {
      res.body.then(data => {
        this.setState({
          hotel: data,
          nights: nights,
          rooms: rooms,
          pictures: data.hotelPhotos,
          loading: false,
          quoteId: quoteId
        }, () => {
          this.requestUserInfo();
        });
      });
    });
  }

  requestCurrencyRates() {
    requester.getCurrencyRates().then(res => {
      res.body.then(data => {
        this.setState({ rates: data });
      });
    });
  }

  requestHotelRooms() {
    const id = this.props.match.params.id;
    const searchParams = this.getRequestSearchParams();
    const quoteId = searchParams.pop().split('=')[1];

    requester.getHotelRooms(id, searchParams).then(res => {
      res.body.then(data => {
        const roomResults = data.filter(x => x.quoteId === quoteId)[0];
        if (roomResults) {
          const room = roomResults.roomsResults;
          const totalPrice = this.calculateRoomsTotalPrice(room);
          this.setState({
            roomResults: room,
            totalPrice: totalPrice,
            loading: false,
          });
        } else {
          NotificationManager.warning(ROOM_NO_LONGER_AVAILABLE, '', LONG);
          const pathname = this.props.location.pathname.indexOf('/mobile') !== -1 ? '/mobile/details' : '/hotels/listings';
          const id = this.props.match.params.id;
          const search = this.getQueryString(queryString.parse(this.props.location.search));
          this.props.history.push(`${pathname}/${id}${search}`);
        }
      });
    });
  }

  requestUserInfo() {
    requester.getUserInfo()
      .then(res => res.body)
      .then(userInfo => this.setState({ userInfo }, () => {
        const rooms = this.state.rooms.slice(0);
        rooms[0].adults[0].firstName = userInfo.firstName.trim();
        rooms[0].adults[0].lastName = userInfo.lastName.trim();
        rooms[0].adults[0].title = userInfo.gender === 'female' ? 'Mrs' : 'Mr';
        this.setState({ rooms });
      }));
  }

  getRoomsFromURL(searchParams) {
    const searchRooms = JSON.parse(decodeURI(searchParams.get('rooms')));
    const result = [];
    for (let roomIndex = 0; roomIndex < searchRooms.length; roomIndex++) {
      const searchRoom = searchRooms[roomIndex];
      const adults = [];
      for (let guestIndex = 0; guestIndex < searchRoom.adults; guestIndex++) {
        const adult = {
          title: 'Mr',
          firstName: guestIndex > 0 ? 'Optional' : '',
          lastName: guestIndex > 0 ? 'Optional' : '',
        };

        adults.push(adult);
      }

      const children = searchRoom.children;
      const room = {
        adults: adults,
        children: children
      };

      result.push(room);
    }

    return result;
  }

  calculateRoomsTotalPrice(roomResults) {
    let total = 0;
    for (let i = 0; i < roomResults.length; i++) {
      total += roomResults[i].price;
    }

    return total;
  }

  calculateReservationTotalNights(searchParams) {
    const start = moment(searchParams.get('startDate'), 'DD/MM/YYYY');
    const end = moment(searchParams.get('endDate'), 'DD/MM/YYYY');
    return end.diff(start, 'days');
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    if (this.updateParamsMap) {
      this.updateParamsMap(e.target.name, e.target.value);
    }
  }

  getRequestSearchParams() {
    const params = [];
    const query = queryString.parse(this.props.location.search);
    params.push(`region=${encodeURI(query.region)}`);
    params.push(`currency=${encodeURI(query.currency)}`);
    params.push(`startDate=${encodeURI(query.startDate)}`);
    params.push(`endDate=${encodeURI(query.endDate)}`);
    params.push(`rooms=${encodeURI(query.rooms)}`);
    params.push(`quoteId=${encodeURI(query.quoteId)}`);
    return params;
  }

  getSearchParams() {
    const map = new Map();
    const pairs = this.props.location.search.substr(1).split('&');
    for (let i = 0; i < pairs.length; i++) {
      let pair = pairs[i].split('=');
      map.set(pair[0], this.parseParam(pair[1]));
    }

    return map;
  }

  parseParam(param) {
    return param.split('%20').join(' ');
  }

  handleAdultChange(event, roomIndex, adultIndex) {
    const name = event.target.name;
    const value = event.target.value;
    const regexp = /^[a-zA-Z]+(-[a-zA-Z]*)?$/;
    if (value === '' || validator.matches(value, regexp)) {
      const rooms = this.state.rooms.slice();
      rooms[roomIndex].adults[adultIndex][name] = value.trim();
      this.setState({ rooms: rooms });
    }
  }

  handleChildAgeChange(event, roomIndex, childIndex) {
    const name = event.target.name;
    const value = event.target.value;
    const rooms = this.state.rooms.slice();
    rooms[roomIndex].children[childIndex][name] = value;
    this.setState({ rooms: rooms });
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
    queryString += '&rooms=' + encodeURI(JSON.stringify(this.state.rooms));
    queryString += '&quoteId=' + encodeURI(queryStringParameters.quoteId);
    return queryString;
  }

  isValidNames() {
    const regexp = /^([A-Za-z]{2,}([-\s][A-Za-z]{2,})?)$/;
    const rooms = this.state.rooms;
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
    const rooms = this.state.rooms;
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
    const hotelName = this.state.hotel && this.state.hotel.name;
    const hotelMainAddress = this.state.hotel && this.state.hotel.additionalInfo.mainAddress;
    const hotelCityName = this.state.hotel && this.state.hotel.city;
    const rooms = this.state.rooms;
    const rates = this.state.rates;
    const currency = this.props.paymentInfo.currency;
    const hotelPicUrl = this.state.pictures && this.state.pictures.length > 0 ? this.state.pictures[0].url : '/listings/images/default.png';
    const priceInSelectedCurrency = this.state.rates && Number(CurrencyConverter.convert(this.state.rates, RoomsXMLCurrency.get(), currency, this.state.totalPrice)).toFixed(2);

    return (
      <div>
        <BookingSteps steps={['Provide Guest Information', 'Review Room Details', 'Confirm and Pay']} currentStepIndex={1} />

        {!this.state.hotel ?
          <div className="loader"></div> :
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
                    {this.state.roomResults && this.state.roomResults.map((room, index) => {
                      if (!this.props.userInfo.isLogged) {
                        return (
                          <h6 key={index}>
                            {room.name}, {this.state.nights} nights: <LocPrice fiat={room.price} />
                          </h6>
                        );
                      } else {
                        return (
                          <h6 key={index}>
                            {room.name}, {this.state.nights} nights: {this.props.paymentInfo.currencySign}{rates && (CurrencyConverter.convert(this.state.rates, RoomsXMLCurrency.get(), currency, room.price)).toFixed(2)} <LocPrice fiat={room.price} />
                          </h6>
                        );
                      }
                    })}
                    <hr />
                    {this.props.userInfo.isLogged ?
                      <h6 className="total-price">
                        Total: {this.props.paymentInfo.currencySign}{priceInSelectedCurrency} {this.state.totalPrice && <LocPrice fiat={this.state.totalPrice} />}
                      </h6> :
                      <h6 className="total-price">
                        Total: {this.state.totalPrice && <LocPrice fiat={this.state.totalPrice} />}
                      </h6>
                    }
                    <div className="clearfix"></div>
                  </div>
                </div>
                <div className="col-md-7" style={{ 'padding': '0', 'margin': '20px 0' }}>
                  {rooms && rooms.map((room, roomIndex) => {
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
                                value={this.state.rooms[roomIndex].adults[adultIndex].title}
                                onChange={(e) => { this.handleAdultChange(e, roomIndex, adultIndex); }}
                              >
                                <option value="Mr">Mr</option>
                                <option value="Mrs">Mrs</option>
                              </select>

                              <input className="guest-name"
                                type="text"
                                placeholder="First Name"
                                name="firstName"
                                value={this.state.rooms[roomIndex].adults[adultIndex].firstName || ''}
                                onChange={(e) => { this.handleAdultChange(e, roomIndex, adultIndex); }}
                              />
                              <input
                                className="guest-name"
                                type="text"
                                placeholder="Last Name"
                                value={this.state.rooms[roomIndex].adults[adultIndex].lastName || ''}
                                name="lastName" onChange={(e) => { this.handleAdultChange(e, roomIndex, adultIndex); }}
                              />
                            </div>
                          );
                        })}

                        {room && room.children.map((child, childIndex) => {
                          return (
                            <div className="form-row" key={childIndex}>
                              <label htmlFor="age">Child (age)</label>
                              <input className="child-age" type="number" value={this.state.rooms[roomIndex].children[childIndex].age} placeholder="Age" name="age" onChange={(e) => { this.handleChildAgeChange(e, roomIndex, childIndex); }} />
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
        }
      </div>
    );
  }
}

HotelsBookingPage.propTypes = {
  countries: PropTypes.array,
  match: PropTypes.object,

  // start Router props
  history: PropTypes.object,
  location: PropTypes.object,

  // start Redux props
  dispatch: PropTypes.func,
  userInfo: PropTypes.object,
  paymentInfo: PropTypes.object
};

function mapStateToProps(state) {
  const { userInfo, paymentInfo } = state;
  return {
    userInfo,
    paymentInfo
  };
}

export default withRouter(connect(mapStateToProps)(HotelsBookingPage));
