import { Route, Redirect, Switch } from 'react-router-dom';

import PropTypes from 'prop-types';
import React from 'react';
import AdminNav from './AdminNav';
import PublishedList from './PublishedList';
import UnpublishedList from './UnpublishedList';

function AdminPage() {
  return (
    <div className="container">
      <AdminNav />
      <Switch>
        <Redirect exact path="/profile/admin/listings" to="/profile/admin/listings/published" />
        <Route exact path="/profile/admin/listings/published" render={() => <PublishedList />} />
        <Route exact path="/profile/admin/listings/unpublished" render={() => <UnpublishedList />} />
      </Switch>
    </div>
  );
}

AdminPage.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
};

export default AdminPage;