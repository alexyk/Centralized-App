import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AdminReservationsTable from './AdminReservationsTable';
import AdminReservationsEditForm from './AdminReservationsEditForm';
import AdminReservationsFlightsEditForm from './AdminReservationsFlightsEditForm';
import AdminHSReservationsEditForm from './AdminHSReservationsEditForm';


function AdminReservationsRouter() {
  return (
    <Switch>
      <Route exact path="/profile/admin/reservation/booking/all" render={() => <AdminReservationsTable />} />
      <Route exact path="/profile/admin/reservation/booking/:id" render={() => <AdminReservationsEditForm />} />
      <Route exact path="/profile/admin/reservation/booking/hs/:id" render={() => <AdminHSReservationsEditForm />} />
      <Route exact path="/profile/admin/reservation/booking/:id/flights" render={() => <AdminReservationsFlightsEditForm/>} />
    </Switch>
  );
}

export default AdminReservationsRouter;
