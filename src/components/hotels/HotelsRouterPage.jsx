import { Route, Switch } from 'react-router-dom';

import React, { Fragment } from 'react';
import HomePage from '../home/HomePage';
import HotelDetailsPage from './details/HotelDetailsPage';
import HotelsBookingRouterPage from './book/HotelsBookingRouterPage';
import StaticHotelsSearchPage from './search/StaticHotelsSearchPage';

function HotelsRouterPage() {
  return (
    <Fragment>
      <Switch>
        <Route exact path="/hotels" render={() => <HomePage homePage="hotels" />} />
        <Route exact path="/hotels/listings" render={() => <StaticHotelsSearchPage />} />
        <Route exact path="/hotels/listings/:id" render={() => <HotelDetailsPage />} />
        <Route path="/hotels/listings/book" render={() => <HotelsBookingRouterPage />} />
      </Switch>
    </Fragment>
  );
}

export default HotelsRouterPage;
