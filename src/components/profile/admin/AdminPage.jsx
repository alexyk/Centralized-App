import { Route, Redirect, Switch } from 'react-router-dom';

import PropTypes from 'prop-types';
import React from 'react';
import ListingsAdminNav from './ListingsAdminNav';
import PublishedListings from './PublishedListings';
import UnpublishedListings from './UnpublishedList';

class AdminPage extends React.Component {
  render() {
    return (
      <div className="container">
        <ListingsAdminNav />
        <Switch>
          <Redirect exact path="/profile/admin/listings" to="/profile/admin/listings/published" />
          <Route exact path="/profile/admin/listings/published" render={() => <PublishedListings />} />
          <Route exact path="/profile/admin/listings/unpublished" render={() => <UnpublishedListings />} />
        </Switch>
      </div>
    );
  }
}

AdminPage.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
};

export default AdminPage;