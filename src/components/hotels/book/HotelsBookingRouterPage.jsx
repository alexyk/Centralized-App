import { withRouter, Route, Switch } from 'react-router-dom';

import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import HotelsBookingPage from './HotelsBookingPage';
import HotelsBookingConfirmPage from './HotelsBookingConfirmPage';
import ConfirmProfilePage from './ConfirmProfilePage';
import queryString from 'query-string';
import { NotificationManager } from 'react-notifications';
import { Config } from '../../../config';
import { LONG } from '../../../constants/notificationDisplayTimes.js';

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
      console.log('started checking for quote id expiration');
      this.quoteIdPollingInterval = setInterval(() => {
        this.requestUpdateOnQuoteId();
      }, QUOTE_ID_POLLING_INTERVAL_TIME);
    }
  }

  clearQuoteIdPollingInterval() {
    clearInterval(this.quoteIdPollingInterval);
    console.log('stopped checking for quote id expiration');
  }

  requestUpdateOnQuoteId() {
    if (this.state) {
      console.log('checking quote id');
      const token = localStorage[Config.getValue('domainPrefix') + '.auth.locktrip'];
      fetch(`${Config.getValue('apiHost')}api/hotels/rooms/${this.state.quoteId}/valid`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      }).then(res => res.json()).then(data => {
        if (!data.is_quote_valid) {
          NotificationManager.warning('Room is no longer available.', '', LONG);
          const pathname = this.props.location.pathname.indexOf('/mobile') !== -1 ? '/mobile/details' : '/hotels/listings';
          const id = this.props.match.params.id;
          const search = this.getQueryString(queryString.parse(this.state.queryString));
          this.props.history.push(`${pathname}/${id}${search}`);
          console.log(this.state.hotelId, this.state.quoteId);
        }
      });
    }
  }

  requestLockOnQuoteId() {
    if (this.state) {
      console.log('locking quote id');
      const body = { quoteId: this.state.quoteId };
      const token = localStorage[Config.getValue('domainPrefix') + '.auth.locktrip'];
      return fetch(`${Config.getValue('apiHost')}api/hotels/rooms/${this.state.quoteId}/mark`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      }).then(res => res.json()).then(res => {
        return new Promise((resolve, reject) => {
          console.log(res.success);
          if (res.success) {
            resolve(true);
          } else {
            reject(false);
          }
        });
      });

      // NotificationManager.warning('Room is no longer available.', '', LONG);
      // const pathname = this.props.location.pathname.indexOf('/mobile') !== -1 ? '/mobile/details' : '/hotels/listings';
      // const id = this.props.match.params.id;
      // const search = this.getQueryString(queryString.parse(this.props.location.search));
      // this.props.history.push(`${pathname}/${id}${search}`);
      // console.log(this.state.hotelId, this.state.quoteId);
    }
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
};

export default withRouter(HotelsBookingRouterPage);
