import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';

import PublishedList from './listings/PublishedList';
import UnpublishedList from './listings/UnpublishedList';
import UnverifiedList from './users/UnverifiedList';
import VerifiedList from './users/VerifiedList';
import AdminSafecharge from './safecharge/AdminSafecharge';
import AdminReservationsRouter from './reservations/AdminReservationsRouter';
import requester from '../../../requester';

class AdminPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      configVars: ''
    };

    this.onChangeConfigVars = this.onChangeConfigVars.bind(this);
  }

  componentDidMount() {
    this.requestConfigVars();
  }

  requestConfigVars() {
    requester.getConfigVars()
      .then((res) => {
        if (res.success) {
          res.body.then((data) => {
            const configVars = {};
            data.forEach((configVar) => {
              configVars[configVar.name] = configVar.value;
            });

            this.setState({
              configVars
            });
          });
        } else {
          res.errors.then((err) => {
            console.log(err);
          });
        }
      });
  }

  onChangeConfigVars(changedKey, configVars) {
    const vars = Object.assign({}, this.state.configVars);
    vars[changedKey] = configVars[changedKey];
    this.setState({
      configVars: vars
    });
  }

  render() {
    const { configVars } = this.state;

    return (
      <Switch>
        <Redirect exact path="/profile/admin/listings" to="/profile/admin/listings/published" />
        <Redirect exact path="/profile/admin/users" to="/profile/admin/users/verified" />

        <Route exact path="/profile/admin/listings/published" render={() => <PublishedList />} />
        <Route exact path="/profile/admin/listings/unpublished" render={() => <UnpublishedList />} />
        <Route exact path="/profile/admin/users/verified" render={() => <VerifiedList />} />
        <Route exact path="/profile/admin/users/unverified" render={() => <UnverifiedList />} />
        <Route exact path="/profile/admin/safecharge" render={() => <AdminSafecharge configVars={configVars} onChangeConfigVars={this.onChangeConfigVars} />} />
        <Route path="/profile/admin/reservation/booking" render={() => <AdminReservationsRouter />} />
      </Switch>
    );
  }
}

AdminPage.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
};

export default AdminPage;
