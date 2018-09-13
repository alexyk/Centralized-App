import { Route, Switch } from 'react-router-dom';

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import HomePage from '../home/HomePage';
import HotelDetailsPage from './details/HotelDetailsPage';
import HotelsBookingRouterPage from './book/HotelsBookingRouterPage';
import StaticHotelsSearchPage from './search/StaticHotelsSearchPage';

function HotelsRouterPage(props) {
  return (
    <Fragment>
      <Switch>
        <Route exact path="/hotels" render={() => <HomePage homePage="hotels" listings={props.listings} hotels={props.hotels} />} />
        <Route exact path="/hotels/listings" render={() => <StaticHotelsSearchPage />} />
        <Route exact path="/hotels/listings/:id" render={() => <HotelDetailsPage />} />
        <Route path="/hotels/listings/book/:id" render={() => <HotelsBookingRouterPage />} />
      </Switch>
    </Fragment>
  );
}

HotelsRouterPage.propTypes = {
  listings: PropTypes.array,
  hotels: PropTypes.array
};

export default HotelsRouterPage;
