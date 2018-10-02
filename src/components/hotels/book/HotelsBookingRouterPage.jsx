import { withRouter, Route, Switch } from 'react-router-dom';

import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import HotelsBookingPage from './HotelsBookingPage';
import HotelsBookingConfirmPage from './HotelsBookingConfirmPage';
import ConfirmProfilePage from './ConfirmProfilePage';
import queryString from 'query-string';
import { NotificationManager } from 'react-notifications';
import { ROOM_NO_LONGER_AVAILABLE } from '../../../constants/warningMessages';
import { LONG } from '../../../constants/notificationDisplayTimes.js';
import requester from '../../../requester';
import _ from 'lodash';
import validator from 'validator';

const QUOTE_ID_POLLING_INTERVAL_TIME = 10000;

class HotelsBookingRouterPage extends React.Component {
  constructor(props) {
    super(props);

    this.quoteIdPollingInterval = null;

    this.state = {
      hotelId: props.match.params.id,
      quoteId: queryString.parse(props.location.search).quoteId,
      guests: [],
      reservation: null,
    };

    this.requestHotel = this.requestHotel.bind(this);
    this.requestUserInfo = this.requestUserInfo.bind(this);
    this.requestCurrencyExchangeRates = this.requestCurrencyExchangeRates.bind(this);
    this.requestCreateReservation = this.requestCreateReservation.bind(this);

    this.setQuoteIdPollingInterval = this.setQuoteIdPollingInterval.bind(this);
    this.clearQuoteIdPollingInterval = this.clearQuoteIdPollingInterval.bind(this);
    this.requestUpdateOnQuoteId = this.requestUpdateOnQuoteId.bind(this);
    this.requestLockOnQuoteId = this.requestLockOnQuoteId.bind(this);
    this.redirectToHotelDetailsPage = this.redirectToHotelDetailsPage.bind(this);
    this.getCleanQueryString = this.getCleanQueryString.bind(this);
    this.handleAdultChange = this.handleAdultChange.bind(this);
    this.handleChildAgeChange = this.handleChildAgeChange.bind(this);
  }

  componentDidMount() {
    this.requestHotel();
    this.requestHotelRooms();
    this.setQuoteIdPollingInterval();
    this.requestUpdateOnQuoteId();
    this.requestCurrencyExchangeRates();
    this.getGuestsFromSearchString().then(() => {
      this.requestUserInfo();
    });
  }

  componentWillUnmount() {
    this.clearQuoteIdPollingInterval();
  }

  requestUserInfo() {
    requester.getUserInfo()
      .then(res => res.body)
      .then(userInfo => this.setState({ userInfo }, () => {
        const guests = this.state.guests.slice(0);
        guests[0].adults[0].firstName = userInfo.firstName.trim();
        guests[0].adults[0].lastName = userInfo.lastName.trim();
        guests[0].adults[0].title = userInfo.gender === 'female' ? 'Mrs' : 'Mr';
        this.setState({ guests });
      }));
  }

  requestHotel() {
    const id = this.props.match.params.id;
    const searchParams = this.getRequestSearchParams();

    requester.getHotelById(id, searchParams).then(res => {
      res.body.then(hotel => {
        this.setState({ hotel });
      });
    });
  }

  requestHotelRooms() {
    const id = this.props.match.params.id;
    const quoteId = queryString.parse(this.props.location.search).quoteId;
    const searchParams = this.getRequestSearchParams();

    return requester.getHotelRooms(id, searchParams)
      .then(res => res.body)
      .then(data => {
        const rooms = data.filter(r => r.quoteId === quoteId)[0];
        if (rooms) {
          this.setState({ rooms: rooms.roomsResults });
        } else {
          this.redirectToHotelDetailsPage();
        }
      });
  }

  requestCreateReservation() {
    const booking = this.getBooking(queryString.parse(this.props.location.search));
    return requester.createReservation(booking).then(res => {
      return new Promise((resolve, reject) => {
        if (res.success) {
          res.body.then(reservation => {
            this.setState({ reservation }, () => {
              resolve(true);
            });
          });
        } else {
          res.errors.then((res) => {
            const errors = res.errors;
            if (errors.hasOwnProperty('RoomsXmlResponse')) {
              if (errors['RoomsXmlResponse'].message.indexOf('QuoteNotAvailable:') !== -1) {
                this.redirectToHotelDetailsPage();
              }
            } else {
              for (let key in errors) {
                if (typeof errors[key] !== 'function') {
                  NotificationManager.warning(errors[key].message, '', LONG);
                }
              }
            }

            reject(false);
          });
        }
      });
    });
  }

  requestCurrencyExchangeRates() {
    requester.getCurrencyRates().then(res => {
      res.body.then(exchangeRates => {
        this.setState({ exchangeRates });
      });
    });
  }

  findQuoteIdByRoomSearchQuote(roomSearchQuote, availableHotelRooms) {
    const searchRoom = roomSearchQuote.map(room => {
      return `${room.name} ${room.mealType} ${room.price.toFixed()}`;
    }).sort();

    for (let index = 0; index < availableHotelRooms.length; index++) {
      const quote = availableHotelRooms[index];
      const currentRoom = quote.roomsResults.map(room => {
        return `${room.name} ${room.mealType} ${room.price.toFixed()}`;
      }).sort();

      if (_.isEqual(searchRoom, currentRoom)) {
        return quote.quoteId;
      }
    }

    return null;
  }

  setQuoteIdPollingInterval() {
    const isQuoteIdPollingIntervalSet = !!this.quoteIdPollingInterval;
    if (!isQuoteIdPollingIntervalSet) {
      this.quoteIdPollingInterval = setInterval(() => {
        this.requestUpdateOnQuoteId();
      }, QUOTE_ID_POLLING_INTERVAL_TIME);
    }
  }

  clearQuoteIdPollingInterval() {
    clearInterval(this.quoteIdPollingInterval);
  }

  requestUpdateOnQuoteId() {
    if (this.state) {
      requester.getQuoteIdExpirationFlag(this.state.quoteId).then(res => res.body).then(data => {
        if (!data.is_quote_valid) {
          const id = this.props.match.params.id;
          const searchParams = this.getRequestSearchParams();
          requester.getHotelRooms(id, searchParams).then(res => {
            res.body.then(data => {
              this.setState({ hotelRooms: data, loadingRooms: false });
            });
          });

          // get new rooms

          // find quote id

          // request booking

          // request create reservation

          this.redirectToHotelDetailsPage();
        }
      });
    }
  }

  requestLockOnQuoteId() {
    if (this.state) {
      const quoteId = this.state.quoteId;
      const body = { quoteId: quoteId };
      return requester.markQuoteIdAsLocked(quoteId, body).then(res => res.body).then(res => {
        return new Promise((resolve, reject) => {
          if (res.success) {
            resolve(true);
          } else {
            this.redirectToHotelDetailsPage();
            reject(false);
          }
        });
      });
    }
  }

  redirectToHotelDetailsPage() {
    NotificationManager.warning(ROOM_NO_LONGER_AVAILABLE, '', LONG);
    const id = this.props.match.params.id;
    const pathname = this.props.location.pathname.indexOf('/mobile') !== -1 ? '/mobile/details' : '/hotels/listings';
    const search = this.getCleanQueryString(queryString.parse(this.props.location.search));
    this.props.history.push(`${pathname}/${id}${search}`);
  }

  getCleanQueryString() {
    const queryStringParameters = queryString.parse(this.props.location.search);

    let result = '?';
    result += 'region=' + encodeURI(queryStringParameters.region);
    result += '&currency=' + encodeURI(queryStringParameters.currency);
    result += '&startDate=' + encodeURI(queryStringParameters.startDate);
    result += '&endDate=' + encodeURI(queryStringParameters.endDate);
    result += '&rooms=' + encodeURI(this.stringifyRoomsExcludingGuestNames(queryStringParameters.rooms));

    return result;
  }

  getRequestSearchParams() {
    const query = queryString.parse(this.getCleanQueryString());

    const params = [];
    params.push(`region=${encodeURI(query.region)}`);
    params.push(`currency=${encodeURI(query.currency)}`);
    params.push(`startDate=${encodeURI(query.startDate)}`);
    params.push(`endDate=${encodeURI(query.endDate)}`);
    params.push(`rooms=${encodeURI(query.rooms)}`);

    return params;
  }

  stringifyRoomsExcludingGuestNames(rooms) {
    rooms = JSON.parse(rooms);
    rooms.forEach((room) => {
      room.adults = room.adults.length ? room.adults.length : room.adults;
    });

    return JSON.stringify(rooms);
  }

  async getGuestsFromSearchString() {
    const searchRooms = JSON.parse(queryString.parse(this.props.location.search).rooms);
    const guests = [];
    for (let roomIndex = 0; roomIndex < searchRooms.length; roomIndex++) {
      const searchRoom = searchRooms[roomIndex];
      const adults = [];
      const guestCount = searchRoom.adults.length ? searchRoom.adults.length : searchRoom.adults;
      for (let guestIndex = 0; guestIndex < guestCount; guestIndex++) {
        const firstName = searchRoom.adults.length ? searchRooms[roomIndex].adults[guestIndex].firstName : '';
        const lastName = searchRoom.adults.length ? searchRooms[roomIndex].adults[guestIndex].lastName : '';
        const adult = {
          title: 'Mr',
          firstName: firstName ? firstName : (guestIndex > 0 ? 'Optional' : ''),
          lastName: lastName ? lastName : (guestIndex > 0 ? 'Optional' : ''),
        };

        adults.push(adult);
      }

      const children = searchRoom.children;
      const room = {
        adults: adults,
        children: children
      };

      guests.push(room);
    }

    await this.setState({ guests });
    return new Promise((resolve) => resolve());
  }

  handleAdultChange(event, roomIndex, adultIndex) {
    const name = event.target.name;
    const value = event.target.value;
    const regexp = /^[a-zA-Z]+(-[a-zA-Z]*)?$/;
    if (value === '' || validator.matches(value, regexp)) {
      const guests = this.state.guests.slice();
      guests[roomIndex].adults[adultIndex][name] = value.trim();
      this.setState({ guests });
    }
  }

  handleChildAgeChange(event, roomIndex, childIndex) {
    const name = event.target.name;
    const value = event.target.value;
    const guests = this.state.guests.slice();
    guests[roomIndex].children[childIndex][name] = value;
    this.setState({ guests });
  }

  getBooking(queryParams) {
    return {
      currency: queryParams.currency,
      rooms: JSON.parse(queryParams.rooms),
      quoteId: queryParams.quoteId
    };
  }

  render() {
    const { hotel, rooms, guests, quoteId, userInfo, exchangeRates, reservation } = this.state;
    return (
      <Fragment>
        <Switch>
          <Route exact path="/hotels/listings/book/:id/profile" render={() => <ConfirmProfilePage requestLockOnQuoteId={this.requestLockOnQuoteId} />} />
          <Route exact path="/hotels/listings/book/:id/confirm" render={() => <HotelsBookingConfirmPage reservation={reservation} userInfo={userInfo} requestLockOnQuoteId={this.requestLockOnQuoteId} requestCreateReservation={this.requestCreateReservation} />} />
          <Route exact path="/hotels/listings/book/:id" render={() => <HotelsBookingPage hotel={hotel} rooms={rooms} quoteId={quoteId} guests={guests} exchangeRates={exchangeRates} handleAdultChange={this.handleAdultChange} handleChildAgeChange={this.handleChildAgeChange} />} />
        </Switch>
      </Fragment>
    );
  }
}

HotelsBookingRouterPage.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
  match: PropTypes.object
};

export default withRouter(HotelsBookingRouterPage);
