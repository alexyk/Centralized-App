import { Route, Redirect, Switch } from 'react-router-dom';

import React from 'react';
import HotelTripsPage from './HotelTripsPage';
import HomeTripsPage from './HomeTripsPage';
import HotelTripDetails from './HotelTripDetails';
import withNav from './withNav';

export default function TripsRouter() {
  return (
    <div className="my-reservations">
      <section id="profile-my-reservations">
        <div className="container">
          <Switch>
            <Route exact path="/profile/trips/hotels" render={() => withNav(HotelTripsPage)} />
            <Route exact path="/profile/trips/homes" render={() =>  withNav(HomeTripsPage)} />
            <Route exact path="/profile/trips/hotels/:id" render={() => <HotelTripDetails />} />
            <Redirect from="/profile/trips" to="/profile/trips/hotels" />
          </Switch>
        </div>
      </section>
    </div>
  );
}