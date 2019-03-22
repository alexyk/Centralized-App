import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AdminReservationsTable from './AdminReservationsTable';
import AdminReservationsEditForm from './AdminReservationsEditForm';


function AdminReservationsRouter() {
  return (
    <Switch>
      <Route exact path="/profile/admin/reservation/booking/all" render={() => <AdminReservationsTable />} />
      <Route exact path="/profile/admin/reservation/booking/:id" render={() => <AdminReservationsEditForm />} />
      <Route exact path="/profile/admin/reservation/booking/:id/flights" render={() => <AdminReservationsEditForm isForFlights={true} />} />
    </Switch>
  );
}

export default AdminReservationsRouter;
