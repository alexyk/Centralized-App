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
import requester from '../../../initDependencies';

const QUOTE_ID_POLLING_INTERVAL_TIME = 10000;

class HotelsBookingRouterPage extends React.Component {
  constructor(props) {
    super(props);

    this.quoteIdPollingInterval = null;

    this.state = {
      hotelId: props.match.params.id,
      quoteId: queryString.parse(props.location.search).quoteId,
      queryString: props.location.search
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
    const search = this.getQueryString(queryString.parse(this.state.queryString));
    this.props.history.push(`${pathname}/${id}${search}`);
  }

  getQueryString(queryStringParameters) {
    let queryString = '?';
    queryString += 'region=' + encodeURI(queryStringParameters.region);
    queryString += '&currency=' + encodeURI(queryStringParameters.currency);
    queryString += '&startDate=' + encodeURI(queryStringParameters.startDate);
    queryString += '&endDate=' + encodeURI(queryStringParameters.endDate);
    queryString += '&rooms=' + this.getRooms(queryStringParameters);
    return queryString;
  }

  getRooms(queryParams) {
    let rooms = JSON.parse(queryParams.rooms);
    rooms.forEach((room) => {
      room.adults = room.adults.length;
    });

    return encodeURI(JSON.stringify(rooms));
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
