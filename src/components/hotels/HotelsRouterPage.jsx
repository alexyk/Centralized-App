import { Route, Switch } from 'react-router-dom';

import PropTypes from 'prop-types';
import React from 'react';
import HomePage from '../home/HomePage';
import HotelDetailsPage from './details/HotelDetailsPage';
import HotelBookingPage from './book/HotelBookingPage';
import HotelBookingConfirmPage from './book/HotelBookingConfirmPage';
import StaticHotelsSearchPage from './search/StaticHotelsSearchPage';

class HotelsRouterPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      countries: undefined
    };
  }

  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/hotels" render={() => <HomePage homePage="hotels" />} />
          <Route exact path="/hotels/listings" render={() => <StaticHotelsSearchPage />} />
          <Route exact path="/hotels/listings/:id" render={() => <HotelDetailsPage />} />
          <Route exact path="/hotels/listings/book/:id" render={() => <HotelBookingPage />} />
          <Route exact path="/hotels/listings/book/confirm/:id" render={() => <HotelBookingConfirmPage />} />
        </Switch>
      </div>
    );
  }
}

HotelsRouterPage.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
};

export default HotelsRouterPage;
