import '../../styles/css/main.css';
import '../../styles/css/components/captcha/captcha-container.css';
import {Redirect, Route, Switch, withRouter} from 'react-router-dom';
import Balance from '../external/Balance';
import CreateListingPage from '../listingCRUD/CreateListingPage';
import EditListingPage from '../listingCRUD/EditListingPage';
import Footer from '../footer/Footer';
import HomeRouterPage from '../home/HomeRouterPage';
import MainNav from '../mainNav/MainNav';
import LocalizationNav from '../profile/LocalizationNav';
import { NotificationContainer } from 'react-notifications';
import ProfilePage from '../profile/ProfilePage';
import React from 'react';
import WorldKuCoinCampaign from '../external/WorldKuCoinCampaign';
import GooglePlaces from '../common/GooglePlaces';
import HelpPage from '../static/HelpPage';
import AboutUsPage from '../static/AboutUsPage';
import LoginManager from '../authentication/LoginManager';
import RegisterManager from '../authentication/RegisterManager';
import WalletCreationManager from '../authentication/WalletCreationManager';
import PasswordRecoveryManager from '../authentication/PasswordRecoveryManager';
import AppFunctionality from "./AppFunctionality.REF"
import {connect} from 'react-redux';
import {fetchCountries} from '../../actions/countriesInfo';
import {fetchCurrencyRates, fetchLocEurRate} from '../../actions/exchangeRatesInfo';
import AffiliateTerms from '../static/AffiliateTerms';

export default class App extends AppFunctionality<Props> {
  render() {

    const isWebView = this.props.location.pathname.indexOf('/mobile') !== -1;
    return (
      <div data-testid="app">
        {!isWebView &&
          <MainNav />
        }

        {!isWebView && this.props.location.pathname !== "/affiliate-terms" &&
          <LocalizationNav />
        }

        <Switch>
          <Route exact path="/recover" render={(props) =><LoginManager openRecoveryOnMount={true}/>}/>
          <Route render={(props) =><LoginManager />}/>
        </Switch>
        {/*<RegisterManager />*/}
        {/*<WalletCreationManager />*/}
        {/*<PasswordRecoveryManager />*/}
        {/*<NotificationContainer />*/}

        <Switch>
          {/*<Route exact path="/" render={(props) =><HomeRouterPage />}/>*/}
          <Route exact path="/affiliate-terms" render={(props) =><AffiliateTerms/>}/>
          {/*<Route exact path="/profile/listings/edit/:step/:id" render={() => !this.props.isAuthenticated() ? <Redirect to="/" /> : <EditListingPage />} />*/}
          {/*<Route exact path="/users/resetPassword/:confirm" render={() => <HomeRouterPage />} />*/}
          {/*<Route path="/homes" render={() => <HomeRouterPage />} />*/}
          {/*<Route path="/hotels" render={() => <HomeRouterPage />} />*/}
          {/*<Route path="/mobile" render={() => <HomeRouterPage />} />*/}
          {/*<Route path="/profile/listings/create" render={() => !this.props.isAuthenticated() ? <Redirect to="/" /> : <CreateListingPage />} />*/}
          {/*<Route path="/profile/" render={() => !this.props.isAuthenticated() ? <Redirect to="/" /> : <ProfilePage location={this.props.location} />} />*/}
          {/*<Route path="/buyloc" render={() => <ProfilePage />} />*/}
          {/*<Route path="/softuni" render={() => <WorldKuCoinCampaign />} />*/}
          {/*<Route path="/vote" render={() => <WorldKuCoinCampaign />} />*/}
          {/*<Route path="/campaigns/balance/check" render={() => <Balance />} />*/}
          {/*<Route path="/google" render={() => <GooglePlaces />} />*/}
          {/*<Route path="/help" render={() => <HelpPage />} />*/}
          {/*<Route path="/about" render={() => <AboutUsPage />} />*/}

          {/*<Route render={() => <HomeRouterPage />} />*/}
        </Switch>

        {!isWebView &&
          <Footer />
        }
      </div>
    );
  }
}

// function mapDispatchToProps(dispatch){
//   return {
//     requestExchangeRates() {
//       dispatch(fetchCurrencyRates())
//     },
//     requestLocEurRate() {
//       dispatch(fetchLocEurRate())
//     },
//     requestCountries() {
//       dispatch(fetchCountries());
//     }
//   }
// }
// export default withRouter(connect(null, mapDispatchToProps)(App));
