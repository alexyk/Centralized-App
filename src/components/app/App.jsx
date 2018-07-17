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
import StyleTest from '../common/StyleTest';
import queryString from 'query-string';
import { Wallet } from '../../services/blockchain/wallet.js';
import { NotificationContainer } from 'react-notifications';

import ProfilePage from '../profile/ProfilePage';
import AirdropPage from '../profile/airdrop/AirdropPage';
import PropTypes from 'prop-types';
import { setIsLogged, setUserInfo } from '../../actions/userInfo';

// MOBILE ONLY START
import StaticHotelsSearchPage from '../hotels/search/StaticHotelsSearchPage';
import HotelDetailsPage from '../hotels/details/HotelDetailsPage';
import HotelBookingPage from '../hotels/book/HotelBookingPage';
import HotelBookingConfirmPage from '../hotels/book/HotelBookingConfirmPage';
// MOBILE ONLY END

import {
  getUserInfo
} from '../../requester';

import '../../styles/css/main.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    BigCalendar.setLocalizer(
      BigCalendar.momentLocalizer(moment)
    );
  }

  componentWillMount() {
    console.log(encodeURI(localStorage.getItem(Config.getValue('domainPrefix') + '.auth.locktrip')));
    this.handleInternalAuthorization();
    this.handleExternalAuthorization();
  }

  isAuthenticated() {
    let token = localStorage.getItem(Config.getValue('domainPrefix') + '.auth.locktrip');
    if (token) {
      return true;
    }
    return false;
  }

  setUserInfo() {
    getUserInfo().then(res => {
      Wallet.getBalance(res.locAddress).then(eth => {
        const ethBalance = eth / (Math.pow(10, 18));
        Wallet.getTokenBalance(res.locAddress).then(loc => {
          const locBalance = loc / (Math.pow(10, 18));
          const { firstName, lastName, phoneNumber, email, locAddress } = res;
          this.props.dispatch(setIsLogged(true));
          this.props.dispatch(setUserInfo(firstName, lastName, phoneNumber, email, locAddress, ethBalance, locBalance));
        });
      });
    });
  }

  handleInternalAuthorization() {
    if (localStorage[Config.getValue('domainPrefix') + '.auth.username']
      && localStorage[Config.getValue('domainPrefix') + '.auth.locktrip']) {
      this.setUserInfo();
    }
  }

  handleExternalAuthorization() {
    const queryStringParameters = queryString.parse(this.props.location.search);
    const { authEmail, authToken } = queryStringParameters;
    if (authEmail && authToken) {
      localStorage[Config.getValue('domainPrefix') + '.auth.username'] = authEmail;
      localStorage[Config.getValue('domainPrefix') + '.auth.locktrip'] = decodeURI(authToken);
      this.setUserInfo();
      const url = this.props.location.pathname;
      const search = this.getQueryString(queryStringParameters);
      console.log(url + search);
      this.props.history.push(url + search);
    }
  }

  getQueryString(queryStringParameters) {
    let queryString = '?';
    queryString += 'region=' + encodeURI(queryStringParameters.region);
    queryString += '&currency=' + encodeURI(queryStringParameters.currency);
    queryString += '&startDate=' + encodeURI(queryStringParameters.startDate);
    queryString += '&endDate=' + encodeURI(queryStringParameters.endDate);
    queryString += '&rooms=' + encodeURI(queryStringParameters.rooms);
    return queryString;
  }

  render() {
    const isWebView = this.props.location.pathname.indexOf('/mobile') !== -1;

    return (
      <div>
        {!isWebView &&
          <MainNav />
        }

        {!isWebView &&
          <NavLocalization />
        }

        <NotificationContainer />

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
          <Route path="/test" render={() => <StyleTest />} />

          {/* MOBILE ONLY START */}
          <Route path="/mobile/search" render={() => <StaticHotelsSearchPage />} />
          <Route path="/mobile/details/:id" render={() => <HotelDetailsPage />} />
          <Route path="/mobile/book/confirm/:id" render={() => <HotelBookingConfirmPage />} />
          <Route path="/mobile/book/:id" render={() => <HotelBookingPage />} />
          {/* MOBILE ONLY END */}

          <Route render={() => <HomeRouterPage />} />
        </Switch>
        
        {!isWebView &&
          <Footer />
        }
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