import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

import AccountNotificationsPage from '../profile/account/AccountNotificationsPage';
import BigCalendar from 'react-big-calendar';
import CalendarPage from '../profile/calendar/CalendarPage';
import { Config } from '../../config';
import CreateListingPage from '../listingCRUD/CreateListingPage';
import EditListingPage from '../listingCRUD/EditListingPage';
import HomeRouterPage from '../home/HomeRouterPage';
import HomesRouterPage from '../homes/HomesRouterPage';
import HotelsRouterPage from '../hotels/HotelsRouterPage';
import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import MainNav from '../mainNav/MainNav';
import Footer from '../footer/Footer';
import NavLocalization from '../profile/NavLocalization';
import StompTest from '../common/StompTest';
import queryString from 'query-string';

import ProfilePage from '../profile/ProfilePage';
import PropTypes from 'prop-types';

import '../../styles/css/main.css';
import AirdropPage from '../profile/airdrop/AirdropPage';

class App extends React.Component {
  constructor(props) {
    super(props);
    BigCalendar.setLocalizer(
      BigCalendar.momentLocalizer(moment)
    );
  }

  componentWillMount() {
    this.handleExternalAuthorization();
  }

  isAuthenticated() {
    let token = localStorage.getItem(Config.getValue('domainPrefix') + '.auth.locktrip');
    if (token) {
      return true;
    }
    return false;
  }
  
  handleExternalAuthorization() {
    const queryStringParameters = queryString.parse(this.props.location.search);
    const { authEmail, authToken } = queryStringParameters;
    if (authEmail && authToken) {
      localStorage[Config.getValue('domainPrefix') + '.auth.username'] = authEmail;
      localStorage[Config.getValue('domainPrefix') + '.auth.locktrip'] = authToken;
      const url = this.props.location.pathname;
      this.props.history.push(url);
    }
  }

  render() {
    return (
      <div>
        <MainNav />
        <NavLocalization />
        <Switch>
          <Route exact path="/" render={() => <HomeRouterPage />} />
          <Route exact path="/profile/listings/edit/:step/:id" render={() => !this.isAuthenticated() ? <Redirect to="/" /> : <EditListingPage />} />
          <Route exact path="/profile/listings/calendar/:id" render={() => !this.isAuthenticated() ? <Redirect to="/" /> : <CalendarPage />} />
          <Route exact path="/profile/account/notifications" render={() => !this.isAuthenticated() ? <Redirect to="/" /> : <AccountNotificationsPage />} />
          <Route exact path="/users/resetPassword/:confirm" render={() => <HomeRouterPage />} />
          <Route path="/homes" render={() => <HomesRouterPage />} />
          <Route path="/hotels" render={() => <HotelsRouterPage />} />
          <Route path="/profile/listings/create" render={() => !this.isAuthenticated() ? <Redirect to="/" /> : <CreateListingPage />} />
          <Route path="/profile/" render={() => !this.isAuthenticated() ? <Redirect to="/" /> : <ProfilePage location={this.props.location} />} />
          <Route path="/airdrop" render={() => <AirdropPage />} />
          <Route path="/test" render={() => <StompTest />} />
          <Route render={() => <HomeRouterPage />} />
        </Switch>
        <Footer />
      </div>
    );
  }
}

App.propTypes = {
  // start Router props
  location: PropTypes.object,

  // start Redux props
  dispatch: PropTypes.func,
  paymentInfo: PropTypes.object
};

function mapStateToProps(state) {
  const { paymentInfo } = state;
  return {
    paymentInfo
  };
}

export default withRouter(connect(mapStateToProps)(App));