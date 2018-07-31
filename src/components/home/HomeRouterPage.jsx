import { Route, Switch, Redirect } from 'react-router-dom';

import React from 'react';
import HomePage from './HomePage';

function HomeRouterPage() {
  return (
    <div>
      <Switch>
        <Route exact path="/homes" render={() => <HomePage />} />
        <Route exact path="/hotels" render={() => <HomePage />} />
        <Route exact path="/users/resetPassword/:confirm" render={() => <HomePage />} />
        <Redirect from="/" to="/hotels" />
      </Switch>
    </div>
  );
}

export default HomeRouterPage;