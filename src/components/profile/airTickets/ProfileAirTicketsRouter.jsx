import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AirTicketsPage from './AirTicketsPage';
import AirTicketsVoucher from './AirTicketsVoucher';
import AirTicketsResponseHandle from './AirTicketsResponseHandle';

function ProfileAirTicketsRouter() {
  return (
    <div className="container">
      <Switch>
        <Route exact path="/profile/flights" render={() => <AirTicketsPage />} />
        <Route exact path="/profile/flights/:id" render={() => <AirTicketsVoucher />} />
        <Route path="/profile/flights/:name" render={() => <AirTicketsResponseHandle />} />
      </Switch>
    </div>
  );
}

export default ProfileAirTicketsRouter;
