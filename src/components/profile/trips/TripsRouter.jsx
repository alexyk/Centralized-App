import { Route, Redirect, Switch } from 'react-router-dom';

import React from 'react';
import HotelTripsPage from './HotelTripsPage';
import HomeTripsPage from './HomeTripsPage';
import HotelTripDetails from './HotelTripDetails';
import withNav from './withNav';

export default function TripsRouter() {
  const HotelsTripsPageWithNav = withNav(HotelTripsPage);
  const HomesTripsPageWithNav = withNav(HomeTripsPage);

  return (
    <div className="my-reservations">
      <section id="profile-my-reservations">
        <div className="container">
          <Switch>
            <Route exact path="/profile/trips/hotels" render={() => <HotelsTripsPageWithNav />} />
            <Route exact path="/profile/trips/homes" render={() => <HomesTripsPageWithNav />} />
            <Route exact path="/profile/trips/hotels/:id" render={() => <HotelTripDetails />} />
            <Redirect from="/profile/trips" to="/profile/trips/hotels" />
          </Switch>
        </div>
      </section>
    </div>
  );
}