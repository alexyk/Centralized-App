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
// const SEARCH_EXPIRATION_TIME = 10000;

class HotelsBookingRouterPage extends React.Component {
  constructor(props) {
    super(props);

    this.quoteIdPollingInterval = null;
    // this.setQuoteIdPollingInterval();
    // this.requestUpdateOnQuoteId();

    // this.searchRenewalTimeout = null;
    // this.setSearchRenewalTimeout();

    this.state = {
      hotelId: props.match.params.id,
      quoteId: queryString.parse(props.location.search).quoteId
    };

    this.setQuoteIdPollingInterval = this.setQuoteIdPollingInterval.bind(this);
    this.clearQuoteIdPollingInterval = this.clearQuoteIdPollingInterval.bind(this);
    this.requestUpdateOnQuoteId = this.requestUpdateOnQuoteId.bind(this);

    // this.setSearchRenewalTimeout = this.setSearchRenewalTimeout.bind(this);
    // this.clearSearchRenewalTimeout = this.clearSearchRenewalTimeout.bind(this);
  }

  componentWillUnmount() {
    this.clearQuoteIdPollingInterval();
    // this.clearSearchRenewalTimeout();
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
    console.log('checking quote id');
    fetch(Config.getValue('apiHost') + 'api/hotels/rooms/18783393-21/valid', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage['locktrip.auth']
      }
    }).then(res => res.json()).then(data => {
      if (!data.is_quote_valid) {
        NotificationManager.warning('Room is no longer available.', '', LONG);
        const pathname = this.props.location.pathname.indexOf('/mobile') !== -1 ? '/mobile/details' : '/hotels/listings';
        const id = this.props.match.params.id;
        const search = this.getQueryString(queryString.parse(this.props.location.search));
        // this.props.history.push(`${pathname}/${id}${search}`);
        console.log(this.state.hotelId);
        console.log(this.state.quoteId);
      }
    });
  }

  getQueryString(queryStringParameters) {
    let queryString = '?';
    queryString += 'region=' + encodeURI(queryStringParameters.region);
    queryString += '&currency=' + encodeURI(queryStringParameters.currency);
    queryString += '&startDate=' + encodeURI(queryStringParameters.startDate);
    queryString += '&endDate=' + encodeURI(queryStringParameters.endDate);
    queryString += '&rooms=' + encodeURI(queryStringParameters.rooms);
    return queryString;
  }

  // setSearchRenewalTimeout() {
  //   const isTimeoutSet = !!this.searchRenewalTimeout;
  //   if (!isTimeoutSet) {
  //     this.searchRenewalTimeout = setTimeout(() => {
  //       console.log('modal opened');
  //     }, SEARCH_EXPIRATION_TIME);
  //     console.log('timeout set');
  //   }
  // }

  // clearSearchRenewalTimeout() {
  //   clearTimeout(this.searchRenewalTimeout);
  //   console.log('timeout cleared');
  // }

  // setRedirectSearchString(search) {
  //   this.setState({ search });
  // }

  render() {
    return (
      <Fragment>
        <Switch>
          <Route exact path="/hotels/listings/book/profile/:id" render={() => <ConfirmProfilePage />} />
          <Route exact path="/hotels/listings/book/confirm/:id" render={() => <HotelsBookingConfirmPage />} />
          <Route exact path="/hotels/listings/book/:id" render={() => <HotelsBookingPage />} />
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
