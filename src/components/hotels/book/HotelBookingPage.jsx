import { Config } from '../../../config';
import { NotificationManager } from 'react-notifications';
import PropTypes from 'prop-types';
import { ROOMS_XML_CURRENCY } from '../../../constants/currencies.js';
import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import requester from '../../../initDependencies';
import { setCurrency } from '../../../actions/paymentInfo';
import validator from 'validator';
import { withRouter } from 'react-router-dom';

class HotelBookingPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // rooms: [{ adults: [{ title: '', firstName: '', lastName: '' }], children: [] }],
      data: null,
      loading: true,
    };

    this.timeout = null;
    this.handleAdultChange = this.handleAdultChange.bind(this);
    this.handleChildAgeChange = this.handleChildAgeChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    const searchParams = this.getNewSearchParams();
    const searchString = this.getSearchParams();

    const quoteId = searchString.get('quoteId');
    const rooms = this.getRooms(searchString);
    const nights = this.getNights(searchString);
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
        });
      });
    });

    requester.getHotelRooms(id, searchParams).then(res => {
      res.body.then(data => {
        const roomResults = data.filter(x => x.quoteId === quoteId)[0].roomsResults;
        const totalPrice = this.getTotalPrice(roomResults);
        this.setState({
          roomResults: roomResults,
          totalPrice: totalPrice,
          loading: false,
        });
      });
    });

    this.getLocRate();
    requester.getCurrencyRates().then(res => {
      res.body.then(data => {
        this.setState({ rates: data });
      });
    });

    this.timeout = setTimeout(() => {
      NotificationManager.info('Your search has expired.', '', 600000);
      this.props.history.push('/hotels');
    }, 600000);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  getLocRate() {
    requester.getLocRateByCurrency(ROOMS_XML_CURRENCY).then(res => {
      res.body.then(data => {
        this.setState({ locRate: Number(data[0][`price_${ROOMS_XML_CURRENCY.toLowerCase()}`]) });
      });
    });
  }

  getRooms(searchParams) {
    const searchRooms = JSON.parse(decodeURI(searchParams.get('rooms')));
    const result = [];
    for (let i = 0; i < searchRooms.length; i++) {
      const searchRoom = searchRooms[i];
      const adults = [];
      for (let j = 0; j < searchRoom.adults; j++) {
        const adult = {
          title: i === 0 && j === 0 && this.props.userInfo.gender === 'women' ? 'Mrs' : 'Mr',
          firstName: i === 0 && j === 0 ? this.props.userInfo.firstName : 'Optional',
          lastName: i === 0 && j === 0 ? this.props.userInfo.lastName : 'Optional',
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

  getTotalPrice(roomResults) {
    let total = 0;
    for (let i = 0; i < roomResults.length; i++) {
      total += roomResults[i].price;
    }

    return total;
  }

  getNights(searchParams) {
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

  getNewSearchParams() {
    const array = [];
    const pairs = this.props.location.search.substr(1).split('&');
    for(let i = 0; i < pairs.length; i++) {
      let pair = pairs[i];
      array.push(pair);
    }

    return array;
  }

  getSearchParams() {
    const map = new Map();
    const pairs = this.props.location.search.substr(1).split('&');
    console.log(pairs);
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
    const rooms = this.state.rooms.slice();
    rooms[roomIndex].adults[adultIndex][name] = value;
    this.setState({ rooms: rooms });
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
      NotificationManager.warning('Names should be at least 3 characters long and contain only characters');
    } else if (!this.isValidAges()) {
      NotificationManager.warning('Child age should be between 1 and 17 years');
    } else {
      const quoteId = this.state.quoteId;
      const rooms = this.state.rooms;
      const currency = this.props.paymentInfo.currency;
      const booking = {
        quoteId: quoteId,
        rooms: rooms,
        currency: currency
      };

      const encodedBooking = encodeURI(JSON.stringify(booking));
      const id = this.props.match.params.id;
      const query = `?booking=${encodedBooking}`;
      const isWebView = this.props.location.pathname.indexOf('/mobile') !== -1;
      const rootURL = !isWebView ? '/hotels/listings/book/confirm' : '/mobile/book/confirm';
      this.props.history.push(`${rootURL}/${id}${query}`);
      // window.location.href = `/hotels/listings/book/confirm/${id}${query}`;
    }
  }

  isValidNames() {
    const regexp = /^[a-zA-Z]{3,}$/;
    const rooms = this.state.rooms;
    for (let i = 0; i < rooms.length; i++) {
      const adults = rooms[i].adults;
      for (let j = 0; j < adults.length; j++) {
        const first = adults[j].firstName;
        const last = adults[j].lastName;
        // console.log(adults[j]);
        // console.log(validator.matches(first, regexp));
        // console.log(validator.matches(last, regexp));
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
    // console.log(this.state.pictures);
    const hotelPicUrl = this.state.pictures && this.state.pictures.length > 0 ? this.state.pictures[0].url : '/listings/images/default.png';
    const priceInSelectedCurrency = this.state.rates && Number(this.state.totalPrice * this.state.rates[ROOMS_XML_CURRENCY][this.props.paymentInfo.currency]).toFixed(2);

    return (
      <div>
        <div className="booking-steps">
          <div className="container">
            <p>1. Provide Guest Information</p>
            <p>2. Review Room Details</p>
            <p>3. Confirm and Pay</p>
          </div>
        </div>

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
                            {room.name}, {this.state.nights} nights: LOC {Number(room.price / this.state.locRate).toFixed(2)}
                          </h6>
                        );
                      } else {
                        return (
                          <h6 key={index}>
                            {room.name}, {this.state.nights} nights: {this.props.paymentInfo.currencySign}{this.state.rates && (room.price * this.state.rates[ROOMS_XML_CURRENCY][this.props.paymentInfo.currency]).toFixed(2)} (LOC {Number(room.price / this.state.locRate).toFixed(2)})
                          </h6>
                        );
                      }
                    })}
                    <hr />
                    {this.props.userInfo.isLogged ?
                      <h6 className="total-price">Total: {this.props.paymentInfo.currencySign}{priceInSelectedCurrency} (LOC {Number(this.state.totalPrice / this.state.locRate).toFixed(2)})</h6> :
                      <h6 className="total-price">Total: LOC {Number(this.state.totalPrice / this.state.locRate).toFixed(2)}</h6>
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
                                value={this.state.rooms[roomIndex].adults[adultIndex].firstName}
                                onChange={(e) => { this.handleAdultChange(e, roomIndex, adultIndex); }}
                              />
                              <input
                                className="guest-name"
                                type="text"
                                placeholder="Last Name"
                                value={this.state.rooms[roomIndex].adults[adultIndex].lastName}
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
                      <button className="btn btn-primary btn-book" onClick={(e) => this.props.history.goBack()}>Back</button>
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

HotelBookingPage.propTypes = {
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

export default withRouter(connect(mapStateToProps)(HotelBookingPage));