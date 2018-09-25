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

const QUOTE_ID_POLLING_INTERVAL_TIME = 10000;

class HotelsBookingRouterPage extends React.Component {
  constructor(props) {
    super(props);

    this.quoteIdPollingInterval = null;

    this.state = {
      hotelId: props.match.params.id,
      quoteId: queryString.parse(props.location.search).quoteId
    };

    this.setQuoteIdPollingInterval = this.setQuoteIdPollingInterval.bind(this);
    this.clearQuoteIdPollingInterval = this.clearQuoteIdPollingInterval.bind(this);
    this.requestUpdateOnQuoteId = this.requestUpdateOnQuoteId.bind(this);
    this.requestLockOnQuoteId = this.requestLockOnQuoteId.bind(this);
    this.redirectToHotelDetailsPage = this.redirectToHotelDetailsPage.bind(this);
  }

  componentDidMount() {
    this.setQuoteIdPollingInterval();
    this.requestUpdateOnQuoteId();
  }

  componentWillUnmount() {
    this.clearQuoteIdPollingInterval();
  }

  requestHotel() {
    const id = this.props.match.params.id;
    const searchParams = this.getRequestSearchParams();

    requester.getHotelById(id, searchParams).then(res => {
      res.body.then(data => {
        this.setState({ hotel: data, loading: false });
      });
    });
  }

  requestHotelRooms() {
    const id = this.props.match.params.id;
    const searchParams = this.getRequestSearchParams();
    
    requester.getHotelRooms(id, searchParams).then(res => {
      res.body.then(data => {
        this.setState({ hotelRooms: data, loadingRooms: false }, () => {
          const roomSearchQuote = this.state.hotelRooms[6].roomsResults;
          const availableHotelRooms = data;
          console.log(availableHotelRooms);
          const quoteId = this.findQuoteIdByRoomSearchQuote(roomSearchQuote, availableHotelRooms);
          console.log(quoteId);
        });
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
        console.log(searchRoom, currentRoom);
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
          const searchParams = this.getRequestSearchParams(this.getQueryString(this.props.location.search));
          requester.getHotelRooms(id, searchParams).then(res => {
            res.body.then(data => {
              this.setState({ hotelRooms: data, loadingRooms: false });
            });
          });

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
    const search = this.getQueryString(queryString.parse(this.props.location.search));
    this.props.history.push(`${pathname}/${id}${search}`);
  }

  getQueryString(queryStringParameters) {
    let queryString = '?';
    queryString += 'region=' + encodeURI(queryStringParameters.region);
    queryString += '&currency=' + encodeURI(queryStringParameters.currency);
    queryString += '&startDate=' + encodeURI(queryStringParameters.startDate);
    queryString += '&endDate=' + encodeURI(queryStringParameters.endDate);
    queryString += '&rooms=' + encodeURI(this.stringifyRoomsExcludingGuestNames(queryStringParameters.rooms));
    return queryString;
  }

  getRequestSearchParams(search) {
    const params = [];
    const query = queryString.parse(search);
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

  render() {
    return (
      <Fragment>
        <Switch>
          <Route exact path="/hotels/listings/book/:id/profile" render={() => <ConfirmProfilePage requestLockOnQuoteId={this.requestLockOnQuoteId} /> } />
          <Route exact path="/hotels/listings/book/:id/confirm" render={() => <HotelsBookingConfirmPage requestLockOnQuoteId={this.requestLockOnQuoteId} />} />
          <Route exact path="/hotels/listings/book/:id" render={() => <HotelsBookingPage quoteId={this.state.quoteId} />} />
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
