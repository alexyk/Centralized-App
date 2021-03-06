import { withRouter, Route, Switch } from 'react-router-dom';

import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import HotelsBookingPage from './HotelsBookingPage';
import HotelsBookingConfirmPage from './HotelsBookingConfirmPage';
import ConfirmProfilePage from './ConfirmProfilePage';
import queryStringUitl from 'query-string';
import { NotificationManager } from 'react-notifications';
import { ROOM_NO_LONGER_AVAILABLE } from '../../../constants/warningMessages';
import { LONG } from '../../../constants/notificationDisplayTimes.js';
import requester from '../../../requester';
import _ from 'lodash';
import { getCurrency } from '../../../selectors/paymentInfo';
import xregexp from "xregexp";
import { mobileCache } from '../../../services/utilities/mobileWebViewUtils';
import { setQuoteIdIsValidPollingEnabled } from '../../../actions/paymentInfo';
const QUOTE_ID_POLLING_INTERVAL_TIME = 10000;
const ROOM_PRICE_DEVIATION = 1;

class HotelsBookingRouterPage extends React.Component {
  constructor(props) {
    super(props);

    this.quoteIdPollingInterval = null;

    let quoteId;
    if (mobileCache.isBooking) {
      quoteId = mobileCache.bookingParams.quoteId;
    } else {
      quoteId = queryStringUitl.parse(props.location.search).quoteId;
    }

    this.state = {
      hotelId: props.match.params.id,
      quoteId,
      guests: [],
      reservation: null,
      hotelsRooms: [],
      roomSearchQuote: [],
      isQuoteLocValid: false
    };

    this.requestHotel = this.requestHotel.bind(this);
    this.requestUserInfo = this.requestUserInfo.bind(this);
    this.requestCreateReservation = this.requestCreateReservation.bind(this);

    this.quoteIdIsValidCheck = this.checkIsQuoteIdValid.bind(this);
    this.startQuoteIdIsValidPolling = this.startQuoteIdIsValidPolling.bind(this);
    this.stopQuoteIdIsValidPolling = this.stopQuoteIdIsValidPolling.bind(this);

    this.requestUpdateOnQuoteId = this.requestUpdateOnQuoteId.bind(this);
    this.requestLockOnQuoteId = this.requestLockOnQuoteId.bind(this);
    this.redirectToHotelDetailsPage = this.redirectToHotelDetailsPage.bind(this);
    this.getCleanQueryString = this.getCleanQueryString.bind(this);
    this.handleAdultChange = this.handleAdultChange.bind(this);
    this.handleChildAgeChange = this.handleChildAgeChange.bind(this);
    this.invalidateQuoteLoc = this.invalidateQuoteLoc.bind(this);
  }

  componentDidMount() {
    this.requestHotel();
    this.requestHotelRooms().then((hasAvailableRooms) => {
      this.findAndSetUserRequestedRoomsByQuoteId(hasAvailableRooms);
    });
    this.startQuoteIdIsValidPolling();
    this.requestUpdateOnQuoteId();
    this.getGuestsFromSearchString().then(() => {
      this.requestUserInfo();
    });
  }

  componentWillUnmount() {
    this.stopQuoteIdIsValidPolling();
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

    requester.getHotelById(id).then(res => {
      res.body.then(hotel => {
        this.setState({ hotel });
      });
    });
  }

  findAndSetUserRequestedRoomsByQuoteId(hasAvailableRooms) {
    if (hasAvailableRooms) {
      const urlParams = (
        mobileCache.isBooking
        ? mobileCache.bookingParams
        : queryStringUitl.parse(this.props.location.search)
      );
      const quoteId = urlParams.quoteId;
      const rooms = this.state.hotelRooms.filter(r => r.quoteId === quoteId)[0];
      if (rooms) {
        this.setState({ rooms: rooms.roomsResults });
      } else {
        this.redirectToHotelDetailsPage();
      }
    }
  }

  requestHotelRooms() {
    const id = this.props.match.params.id;
    const searchParams = this.getRequestSearchParams();

    return requester.getHotelRooms(id, searchParams)
      .then(res => res.body)
      .then(data => {
        return new Promise((resolve, reject) => {
          if (data) {
            this.setState({ hotelRooms: data }, () => {
              resolve(true);
            });
          } else {
            reject();
          }
        });
      });
  }

  requestCreateReservation() {
    const query = queryStringUitl.parse(this.props.location.search);
    const booking = this.getBooking(query);
    return requester.createReservation(booking).then(res => {
      return new Promise((resolve, reject) => {
        if (res.success) {
          res.body.then(reservation => {
            const quoteBookingCandidate = { bookingId: reservation.preparedBookingId };
            requester.quoteBooking(quoteBookingCandidate)
              .then((res) => {
                res.body.then(success => {
                  if (success.is_successful_quoted) {
                    this.setState({ reservation, isQuoteLocValid: success.is_successful_quoted }, () => {
                      resolve(true);
                    });
                  } else {
                    this.redirectToHotelDetailsPage();
                  }
                });
              });
          });
        } else {
          this.redirectToHotelDetailsPage();
        }
      });
    });
  }

  invalidateQuoteLoc() {
    this.setState({
      isQuoteLocValid: false
    });
  }

  findQuoteIdByRoomSearchQuote(roomSearchQuote, availableHotelRooms) {
    let searchRoomPrice = 0.0;
    const searchRoom = roomSearchQuote.map(room => {
      searchRoomPrice = searchRoomPrice + room.price;
      return `${room.name} ${room.mealType}`;
    }).sort();

    for (let index = 0; index < availableHotelRooms.length; index++) {
      let currentRoomPrice = 0.0;
      const quote = availableHotelRooms[index];
      const currentRoom = quote.roomsResults.map(room => {
        currentRoomPrice = currentRoomPrice + room.price;
        return `${room.name} ${room.mealType}`;
      }).sort();

      if (_.isEqual(searchRoom, currentRoom) && Math.abs(currentRoomPrice - searchRoomPrice)<= ROOM_PRICE_DEVIATION ) {
        return quote.quoteId;
      }
    }

    return null;
  }

  checkIsQuoteIdValid() {
    if (this.props.quoteIdIsValidPollingEnabled) {
      this.requestUpdateOnQuoteId();
    } else {
      console.warn(`[IsValid] Stopping quote-id is-valid polling`);
      this.stopQuoteIdIsValidPolling();
    }
  }

  startQuoteIdIsValidPolling() {
    // stop checking if quote-id is valid
    this.props.setQuoteIdIsValidPollingEnabled(true);

    const isQuoteIdPollingIntervalSet = (this.quoteIdPollingInterval != null);
    if (!isQuoteIdPollingIntervalSet) {
      this.quoteIdPollingInterval = setInterval(() => this.checkIsQuoteIdValid(), QUOTE_ID_POLLING_INTERVAL_TIME);
    }
  }

  stopQuoteIdIsValidPolling() {
    if (this.quoteIdPollingInterval != null) {
      clearInterval(this.quoteIdPollingInterval);
      this.quoteIdPollingInterval = null;
      this.props.setQuoteIdIsValidPollingEnabled(false);
    } else {
      console.warn(`[IsValid] Failure to stop quote-id check - INVALID TIMER`);
    }
  }

  requestUpdateOnQuoteId() {
    if (this.state) {
      requester.getQuoteIdExpirationFlag(this.state.quoteId).then(res => res.body).then(data => {
        if (!data.is_quote_valid) {
          this.requestHotelRooms()
            .then((success) => {
              if (success) {
                const newQuoteId = this.findQuoteIdByRoomSearchQuote(this.state.rooms, this.state.hotelRooms);
                if (newQuoteId) {
                  if (this.props.location.pathname === `/hotels/listings/book/${this.state.hotelId}`) {
                    const queryString = `${this.getCleanQueryString()}&quoteId=${newQuoteId}`;
                    this.props.history.replace(`${this.props.location.pathname}${queryString}`);

                    let newGuests = this.state.guests.map(r => {
                      const adt = r.adults.map(a => {
                          return {title: a.title, firstName: (a.firstName === "" ? null : a.firstName), lastName: (a.lastName === "" ? null : a.lastName)}
                      });

                      const chd = r.children.map(c => {
                          return {age: c.age, firstName: (c.firstName === "" ? null : c.firstName), lastName: ( c.lastName === "" ? null : c.lastName) };
                      });
                      return {adults: adt, children: chd}
                    });

                    const booking = {
                      rooms: newGuests,
                      currency: this.props.currency,
                      quoteId: newQuoteId
                    };

                    requester.createReservation(booking).then(res => {
                      if (res.success) {
                        res.body.then(() => {
                          this.setState({
                            quoteId: newQuoteId
                          });
                        });
                      } else {
                        this.requestUpdateOnQuoteId();
                      }
                    }).catch(() => {
                      this.requestUpdateOnQuoteId();
                    });
                  } else if (this.props.location.pathname === `/hotels/listings/book/${this.state.hotelId}/confirm`) {
                    const queryString = `${this.getQueryString()}&quoteId=${newQuoteId}`;
                    this.props.history.replace(`${this.props.location.pathname}${queryString}`);

                    this.requestCreateReservation()
                      .then(() => {
                        this.setState({
                          quoteId: newQuoteId
                        });
                      });
                  } else if (this.props.location.pathname === `/hotels/listings/book/${this.state.hotelId}/profile`) {
                    this.props.history.goBack();
                    NotificationManager.warning('Quote expire', '', LONG);
                  }
                } else {
                  this.redirectToHotelDetailsPage();
                }
              }
            });
        }
      });
    }
  }

  requestLockOnQuoteId(paymentMethod) {
    if (this.state) {
      const quoteId = this.state.quoteId;
      const body = { quoteId, paymentMethod };
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
    const pathname = this.props.location.pathname.indexOf('/mobile') !== -1 ? '/mobile/hotels/listings' : '/hotels/listings';
    const search = this.getCleanQueryString(queryStringUitl.parse(this.props.location.search));
    this.props.history.push(`${pathname}/${id}${search}`);
  }

  getQueryString() {
    const queryStringParameters = queryStringUitl.parse(this.props.location.search);

    let result = '?';
    result += 'region=' + encodeURI(queryStringParameters.region);
    result += '&currency=' + encodeURI(queryStringParameters.currency);
    result += '&startDate=' + encodeURI(queryStringParameters.startDate);
    result += '&endDate=' + encodeURI(queryStringParameters.endDate);
    result += '&rooms=' + encodeURI(queryStringParameters.rooms);
    result += '&nat=' + encodeURI(queryStringParameters.nat);

    return result;
  }

  getCleanQueryString() {
    const queryStringParameters = queryStringUitl.parse(this.props.location.search);

    let result = '?';
    result += 'region=' + encodeURI(queryStringParameters.region);
    result += '&currency=' + encodeURI(queryStringParameters.currency);
    result += '&startDate=' + encodeURI(queryStringParameters.startDate);
    result += '&endDate=' + encodeURI(queryStringParameters.endDate);
    result += '&rooms=' + encodeURI(this.stringifyRoomsExcludingGuestNames(queryStringParameters.rooms));
    result += '&nat=' + encodeURI(queryStringParameters.nat);

    return result;
  }

  getRequestSearchParams() {
    const query = (
      mobileCache.isBooking
        ? mobileCache.bookingParams
        : queryStringUitl.parse(this.getCleanQueryString())
    );

    const params = [];
    params.push(`region=${encodeURI(query.region)}`);
    params.push(`currency=${encodeURI(query.currency)}`);
    params.push(`startDate=${encodeURI(query.startDate)}`);
    params.push(`endDate=${encodeURI(query.endDate)}`);
    params.push(`rooms=${encodeURI(query.rooms)}`);
    params.push(`nat=${encodeURI(query.nat)}`);

    return params;
  }

  stringifyRoomsExcludingGuestNames(rooms) {
    rooms = JSON.parse(rooms);
    rooms.forEach((room) => {
      room.adults = room.adults.length ? room.adults.length : room.adults;
      room.children = room.children.length ? room.children.map( c => { return {"age" : c.age}; }) : room.children;
    });

    return JSON.stringify(rooms);
  }

  async getGuestsFromSearchString() {
    const searchRooms = JSON.parse(queryStringUitl.parse(this.props.location.search).rooms);
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
          // firstName: firstName ? firstName : (guestIndex > 0 ? 'Optional' : ''),
          // lastName: lastName ? lastName : (guestIndex > 0 ? 'Optional' : ''),
          firstName: firstName ? firstName : '',
          lastName: lastName ? lastName : '',
        };

        adults.push(adult);
      }
      const children = [];
      const childrenCount = searchRoom.children.length ? searchRoom.children.length : searchRoom.children;
      for (let guestIndex = 0; guestIndex < childrenCount; guestIndex++) {
        const firstName = searchRoom.children.length ? searchRooms[roomIndex].children[guestIndex].firstName : '';
        const lastName = searchRoom.children.length ? searchRooms[roomIndex].children[guestIndex].lastName : '';
        const child = {
        //   firstName: firstName ? firstName : (guestIndex > 0 ? 'Optional' : ''),
        //   lastName: lastName ? lastName : (guestIndex > 0 ? 'Optional' : ''),
          firstName: firstName ? firstName : '',
          lastName: lastName ? lastName : '',
          age: searchRooms[roomIndex].children[guestIndex].age
        };
        children.push(child);
      }

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
    // const regexp = /^[a-zA-Z]+(-[a-zA-Z]*)?$/;
    const regexp = xregexp("^\\pL+([- ']?\\pL*)?([- ']?\\pL*)$");
    if (value === '' || regexp.test(value)) {
      const guests = this.state.guests.slice();
      guests[roomIndex].adults[adultIndex][name] = value;
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
      quoteId: queryParams.quoteId,
      nat: queryParams.nat
    };
  }

  render() {
    const { hotel, rooms, guests, quoteId, userInfo, reservation } = this.state;

    return (
      <Fragment>
        <Switch>
          <Route exact path="/hotels/listings/book/:id/profile" render={() => <ConfirmProfilePage requestLockOnQuoteId={this.requestLockOnQuoteId} preparedBookingId={this.state.reservation && this.state.reservation.preparedBookingId} />} />
          <Route exact path="/hotels/listings/book/:id/confirm" render={() => <HotelsBookingConfirmPage reservation={reservation} userInfo={userInfo} isQuoteLocValid={this.state.isQuoteLocValid} requestLockOnQuoteId={this.requestLockOnQuoteId} requestCreateReservation={this.requestCreateReservation} invalidateQuoteLoc={this.invalidateQuoteLoc} redirectToHotelDetailsPage={this.redirectToHotelDetailsPage} />} />
          <Route exact path="/hotels/listings/book/:id" render={() => <HotelsBookingPage hotel={hotel} rooms={rooms} quoteId={quoteId} guests={guests} handleAdultChange={this.handleAdultChange} handleChildAgeChange={this.handleChildAgeChange} />} />

          {/* MOBILE ONLY START */}
          <Route exact path="/mobile/hotels/listings/book/:id/profile" render={() => <ConfirmProfilePage requestLockOnQuoteId={this.requestLockOnQuoteId} preparedBookingId={this.state.reservation && this.state.reservation.preparedBookingId} />} />
          <Route exact path="/mobile/hotels/listings/book/:id/confirm" render={() => <HotelsBookingConfirmPage reservation={reservation} userInfo={userInfo} isQuoteLocValid={this.state.isQuoteLocValid} requestLockOnQuoteId={this.requestLockOnQuoteId} requestCreateReservation={this.requestCreateReservation} invalidateQuoteLoc={this.invalidateQuoteLoc} redirectToHotelDetailsPage={this.redirectToHotelDetailsPage} />} />
          <Route path="/mobile/hotels/listings/book/:id" render={() => <HotelsBookingPage hotel={hotel} rooms={rooms} quoteId={quoteId} guests={guests} handleAdultChange={this.handleAdultChange} handleChildAgeChange={this.handleChildAgeChange} />} />
          {/* MOBILE ONLY END */}
        </Switch>
      </Fragment>
    );
  }
}

HotelsBookingRouterPage.propTypes = {
  match: PropTypes.object,

  // Router props
  location: PropTypes.object,
  history: PropTypes.object,

  // Redux props
  currency: PropTypes.string
};

function mapDispatchToProps(dispatch) {
  return {
    setQuoteIdIsValidPollingEnabled: (value) => dispatch(setQuoteIdIsValidPollingEnabled(value))
  };
}

const mapStateToProps = (state) => {
  const { paymentInfo } = state;

  return {
    currency: getCurrency(paymentInfo),
    quoteIdIsValidPollingEnabled: paymentInfo.quoteIdIsValidPollingEnabled
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HotelsBookingRouterPage));
