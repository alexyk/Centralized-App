import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AirTicketsPage from './AirTicketsPage';
import AirTicketsVoucher from './AirTicketsVoucher';

function ProfileAirTicketsRouter() {
  return (
    <div className="container">
      <Switch>
        <Route exact path="/profile/tickets" render={() => <AirTicketsPage />} />
        <Route exact path="/profile/tickets/:id" render={() => <AirTicketsVoucher />} />
      </Switch>
    </div>
  );
}

export default ProfileAirTicketsRouter;