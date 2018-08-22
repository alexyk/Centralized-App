import { Redirect, Route, Switch } from 'react-router-dom';

import PropTypes from 'prop-types';
import PublishedList from './listings/PublishedList';
import React from 'react';
import UnpublishedList from './listings/UnpublishedList';
import UnverifiedList from './users/UnverifiedList';
import VerifiedList from './users/VerifiedList';

function AdminPage() {
  return (
    <div className="container">
      <Switch>
        <Redirect exact path="/profile/admin/listings" to="/profile/admin/listings/published" />
        <Redirect exact path="/profile/admin/users" to="/profile/admin/users/verified" />

        <Route exact path="/profile/admin/listings/published" render={() => <PublishedList />} />
        <Route exact path="/profile/admin/listings/unpublished" render={() => <UnpublishedList />} />
        <Route exact path="/profile/admin/users/verified" render={() => <VerifiedList />} />
        <Route exact path="/profile/admin/users/unverified" render={() => <UnverifiedList />} />
      </Switch>
    </div>
  );
}

AdminPage.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
};

export default AdminPage;
