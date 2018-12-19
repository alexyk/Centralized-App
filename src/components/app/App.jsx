import '../../styles/css/main.css';
import '../../styles/css/components/captcha/captcha-container.css';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { setCurrencyExchangeRates, setLocEurRate } from '../../actions/exchangeRatesInfo';

import Balance from '../external/Balance';
import BigCalendar from 'react-big-calendar';
import { Config } from '../../config';
import CreateListingPage from '../listingCRUD/CreateListingPage';
import EditListingPage from '../listingCRUD/EditListingPage';
import Footer from '../footer/Footer';
import HomeRouterPage from '../home/HomeRouterPage';
import MainNav from '../mainNav/MainNav';
import LocalizationNav from '../profile/LocalizationNav';
import { NotificationContainer } from 'react-notifications';
import ProfilePage from '../profile/ProfilePage';
import PropTypes from 'prop-types';
import React from 'react';
import { Wallet } from '../../services/blockchain/wallet.js';
import WorldKuCoinCampaign from '../external/WorldKuCoinCampaign';
import { connect } from 'react-redux';
import moment from 'moment';
import queryString from 'query-string';
import requester from '../../requester';
import GooglePlaces from '../common/GooglePlaces';
import HelpPage from '../static/HelpPage';
import AboutUsPage from '../static/AboutUsPage';
import LoginManager from '../authentication/LoginManager';
import RegisterManager from '../authentication/RegisterManager';
import WalletCreationManager from '../authentication/WalletCreationManager';
import PasswordRecoveryManager from '../authentication/PasswordRecoveryManager';
import { fetchCountries } from '../../actions/countriesInfo';
import referralIdPersister from "../profile/affiliates/service/persist-referral-id";
class App extends React.Component {
  constructor(props) {
    super(props);
    
    BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment.utc()));
  }

  componentDidMount() {
    this.requestExchangeRates();
    this.requestLocEurRate();
    this.requestCountries();

  }

  isAuthenticated() {
    let token = localStorage.getItem(Config.getValue('domainPrefix') + '.auth.locktrip');
    if (token) {
      return true;
    }
    return false;
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

  requestCountries() {
    this.props.dispatch(fetchCountries());
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

        <LoginManager />
        <RegisterManager />
        <WalletCreationManager />
        <PasswordRecoveryManager />
        <NotificationContainer />

        <Switch>
          <Route exact path="/" render={(props) => {
            referralIdPersister.tryToSetFromSearch(props.location.search);
            return <HomeRouterPage />
          }}/>
          <Route exact path="/profile/listings/edit/:step/:id" render={() => !this.isAuthenticated() ? <Redirect to="/" /> : <EditListingPage />} />
          <Route exact path="/users/resetPassword/:confirm" render={() => <HomeRouterPage />} />
          <Route path="/homes" render={() => <HomeRouterPage />} />
          <Route path="/hotels" render={() => <HomeRouterPage />} />
          <Route path="/mobile" render={() => <HomeRouterPage />} />
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
};

export default withRouter(connect()(App));
