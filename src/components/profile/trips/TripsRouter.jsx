import { Route, Redirect, Switch } from 'react-router-dom';

import React from 'react';
import TripsNav from './TripsNav';
import HotelTripsPage from './HotelTripsPage';
import HomeTripsPage from './HomeTripsPage';
import HotelTripDetails from './HotelTripDetails';

export default function TripsRouter() {

  const getHeader = () => {
    return (
      <div>
        <TripsNav />
        <hr />
      </div>
    );
  };

  return (
    <div className="my-reservations">
      <section id="profile-my-reservations">
        <div className="container">
          <Switch>
            <Route exact path="/profile/trips/hotels" render={() => {
              return (
                <div>
                  {getHeader()}
                  <HotelTripsPage />
                </div>
              );
            }} />
            <Route exact path="/profile/trips/homes" render={() => {
              return (
                <div>
                  {getHeader()}
                  <HomeTripsPage />
                </div>
              );
            }} />
            <Route exact path="/profile/trips/hotels/:id" render={() => <HotelTripDetails />} />
            <Redirect from="/profile/trips" to="/profile/trips/hotels" />
          </Switch>
        </div>
      </section>
    </div>
  );
}