import '../../styles/css/main.css';

import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { setIsLogged, setUserInfo } from '../../actions/userInfo';
import { setCurrencyExchangeRates, setLocEurRate } from '../../actions/exchangeRatesInfo';

import Balance from '../external/Balance';
import BigCalendar from 'react-big-calendar';
import { Config } from '../../config';
import CreateListingPage from '../listingCRUD/CreateListingPage';
import EditListingPage from '../listingCRUD/EditListingPage';
import Footer from '../footer/Footer';
import HomeRouterPage from '../home/HomeRouterPage';
import HotelsBookingConfirmPage from '../hotels/book/HotelsBookingConfirmPage';
import HotelsBookingPage from '../hotels/book/HotelsBookingPage';
import HotelDetailsPage from '../hotels/details/HotelDetailsPage';
import MainNav from '../mainNav/MainNav';
import LocalizationNav from '../profile/LocalizationNav';
import { NotificationContainer } from 'react-notifications';
import ProfilePage from '../profile/ProfilePage';
import PropTypes from 'prop-types';
import React from 'react';
import StaticHotelsSearchPage from '../hotels/search/StaticHotelsSearchPage';
import { Wallet } from '../../services/blockchain/wallet.js';
import WorldKuCoinCampaign from '../external/WorldKuCoinCampaign';
import { connect } from 'react-redux';
import moment from 'moment';
import queryString from 'query-string';
import requester from '../../requester';
import GooglePlaces from '../common/GooglePlaces';
import HelpPage from '../static/HelpPage';
import AboutUsPage from '../static/AboutUsPage';

// if (process.env.NODE_ENV === 'development') {
//   console.log(process.env.NODE_ENV);
//   const { whyDidYouUpdate } = require('why-did-you-update');
//   whyDidYouUpdate(React);
// }

class App extends React.Component {
  constructor(props) {
    super(props);
    BigCalendar.setLocalizer(
      BigCalendar.momentLocalizer(moment)
    );
  }

  componentDidMount() {
    this.handleInternalAuthorization();
    this.handleExternalAuthorization();

    this.requestExchangeRates();
    this.requestLocEurRate();
  }

  isAuthenticated() {
    let token = localStorage.getItem(Config.getValue('domainPrefix') + '.auth.locktrip');
    if (token) {
      return true;
    }
    return false;
  }

  setUserInfo() {
    this.props.dispatch(setIsLogged(true));
    requester.getUserInfo().then(res => {
      res.body.then(data => {
        if (data.locAddress) {
          Wallet.getBalance(data.locAddress).then(eth => {
            const ethBalance = eth / (Math.pow(10, 18));
            Wallet.getTokenBalance(data.locAddress).then(loc => {
              const locBalance = loc / (Math.pow(10, 18));
              const { firstName, lastName, phoneNumber, email, locAddress, gender, isEmailVerified } = data;
              const isAdmin = data.roles.findIndex((r) => r.name === 'ADMIN') !== -1;
              this.props.dispatch(setUserInfo(firstName, lastName, phoneNumber, email, locAddress, ethBalance, locBalance, gender, isEmailVerified, isAdmin));
            });
          });
        } else {
          const ethBalance = 0;
          const locBalance = 0;
          const { firstName, lastName, phoneNumber, email, locAddress, gender, isEmailVerified } = data;
          const isAdmin = data.roles.findIndex((r) => r.name === 'ADMIN') !== -1;
          this.props.dispatch(setUserInfo(firstName, lastName, phoneNumber, email, locAddress, ethBalance, locBalance, gender, isEmailVerified, isAdmin));
        }
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
      this.props.history.push(url + search);
    }
  }

  requestExchangeRates() {
    requester.getCurrencyRates().then(res => {
      res.body.then(currencyExchangeRates => {
        this.props.dispatch(setCurrencyExchangeRates(currencyExchangeRates));
      });
    });
  }

  requestLocEurRate() {
    const baseCurrency = 'EUR';
    requester.getLocRateByCurrency(baseCurrency).then(res => {
      res.body.then(data => {
        this.props.dispatch(setLocEurRate(Number(data[0][`price_${(baseCurrency).toLowerCase()}`])));
      });
    });
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
          <LocalizationNav />
        }

        <NotificationContainer />

        <Switch>
          <Route exact path="/" render={() => <HomeRouterPage />} />
          <Route exact path="/profile/listings/edit/:step/:id" render={() => !this.isAuthenticated() ? <Redirect to="/" /> : <EditListingPage />} />
          {/* <Route exact path="/profile/listings/calendar/:id" render={() => !this.isAuthenticated() ? <Redirect to="/" /> : <CalendarPage />} /> */}
          <Route exact path="/users/resetPassword/:confirm" render={() => <HomeRouterPage />} />
          <Route path="/homes" render={() => <HomeRouterPage />} />
          <Route path="/hotels" render={() => <HomeRouterPage />} />
          <Route path="/profile/listings/create" render={() => !this.isAuthenticated() ? <Redirect to="/" /> : <CreateListingPage />} />
          <Route path="/profile/" render={() => !this.isAuthenticated() ? <Redirect to="/" /> : <ProfilePage location={this.props.location} />} />
          <Route path="/airdrop" render={() => <ProfilePage />} />
          <Route path="/buyloc" render={() => <ProfilePage />} />
          <Route path="/softuni" render={() => <WorldKuCoinCampaign />} />
          <Route path="/vote" render={() => <WorldKuCoinCampaign />} />
          <Route path="/campaigns/balance/check" render={() => <Balance />} />
          <Route path="/google" render={() => <GooglePlaces />} />
          <Route path="/help" render={() => <HelpPage />} />
          <Route path="/about" render={() => <AboutUsPage />} />

          {/* MOBILE ONLY START */}
          <Route path="/mobile/search" render={() => <StaticHotelsSearchPage />} />
          <Route path="/mobile/details/:id" render={() => <HotelDetailsPage />} />
          <Route path="/mobile/book/confirm/:id" render={() => <HotelsBookingConfirmPage />} />
          <Route path="/mobile/book/:id" render={() => <HotelsBookingPage />} />
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
  history: PropTypes.object,

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
