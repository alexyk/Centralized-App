import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import HomesBookingPage from './HomesBookingPage';
import HomesBookingConfirmPage from './HomesBookingConfirmPage';

function HomesBookingRouterPage() {
  return (
    <Fragment>
      <Switch>
        <Route exact path="/homes/listings/book/:id" render={() => <HomesBookingPage />} />
        <Route exact path="/homes/listings/book/confirm/:id" render={() => <HomesBookingConfirmPage />} />
      </Switch>
    </Fragment>
  );
}

export default HomesBookingRouterPage;
