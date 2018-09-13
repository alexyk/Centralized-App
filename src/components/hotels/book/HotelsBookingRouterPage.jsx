import { Route, Switch } from 'react-router-dom';

import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import HotelsBookingPage from './HotelsBookingPage';
import HotelsBookingConfirmPage from './HotelsBookingConfirmPage';
import ConfirmProfilePage from './ConfirmProfilePage';

const QUOTE_ID_POLLING_INTERVAL_TIME = 1000;
// const SEARCH_EXPIRATION_TIME = 10000;

class HotelsBookingRouterPage extends React.Component {
  constructor(props) {
    super(props);

    this.quoteIdPollingInterval = null;
    this.setQuoteIdPollingInterval();

    // this.searchRenewalTimeout = null;
    // this.setSearchRenewalTimeout();

    this.state = {};

    this.setQuoteIdPollingInterval = this.setQuoteIdPollingInterval.bind(this);
    this.clearQuoteIdPollingInterval = this.clearQuoteIdPollingInterval.bind(this);

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
        console.log('check quote id');
      }, QUOTE_ID_POLLING_INTERVAL_TIME);
    }
  }

  clearQuoteIdPollingInterval() {
    clearInterval(this.quoteIdPollingInterval);
    console.log('stopped checking for quote id expiration');
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

export default HotelsBookingRouterPage;
