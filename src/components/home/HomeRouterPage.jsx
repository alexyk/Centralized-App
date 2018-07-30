import { Route, Switch } from 'react-router-dom';

import React from 'react';
import HotelsHomePage from '../hotels/HotelsHomePage';
import HomesHomePage from '../homes/HomesHomePage';
import HomePage from './HomePage';

function HomeRouterPage() {
  return (
    <div>
      <Switch>
        <Route exact path="/homes" render={() => <HomesHomePage />} />
        <Route exact path="/hotels" render={() => <HotelsHomePage />} />
        <Route exact path="/users/resetPassword/:confirm" render={() => <HotelsHomePage />} />
        <Route exact path="/" render={() => <HomePage />} />
      </Switch>
    </div>
  );
}

export default HomeRouterPage;