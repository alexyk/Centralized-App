import { Route, Switch } from 'react-router-dom';

import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import HotelsBookingPage from './HotelsBookingPage';
import HotelsBookingConfirmPage from './HotelsBookingConfirmPage';
import ConfirmProfilePage from './ConfirmProfilePage';

const SEARCH_EXPIRATION_TIME = 10000;

class HotelsBookingRouterPage extends React.Component {
  constructor(props) {
    super(props);

    this.searchRenewalTimeout = null;
    this.setSearchRenewalTimeout();

    this.state = {};

    this.setSearchRenewalTimeout = this.setSearchRenewalTimeout.bind(this);
    this.clearSearchRenewalTimeout = this.clearSearchRenewalTimeout.bind(this);
  }

  componentWillUnmount() {
    this.clearSearchRenewalTimeout();
  }

  setSearchRenewalTimeout() {
    const isTimeoutSet = !!this.searchRenewalTimeout;
    if (!isTimeoutSet) {
      this.searchRenewalTimeout = setTimeout(() => {
        console.log('modal opened');
      }, SEARCH_EXPIRATION_TIME);
      console.log('timeout set');
    }
  }

  clearSearchRenewalTimeout() {
    clearTimeout(this.searchRenewalTimeout);
    console.log('timeout cleared');
  }

  render() {
    return (
      <Fragment>
        <Switch>
          <Route exact path="/hotels/listings/book/profile" render={() => <ConfirmProfilePage />} />
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
