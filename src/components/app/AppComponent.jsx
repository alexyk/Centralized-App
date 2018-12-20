import '../../styles/css/main.css';
import '../../styles/css/components/captcha/captcha-container.css';
import { Redirect, Route, Switch } from 'react-router-dom';
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

type Props = {
  persistReferralId: (search?: string)=>void,
  initCalendar: Function,
  isAuthenticated: ()=>boolean,
  requestExchangeRates: Function,
  requestLocEurRate: Function,
  requestCountries: Function,
}

export default class App extends React.Component<Props> {
  constructor(props) {
    super(props);
    props.initCalendar();
  }

  componentDidMount() {
    this.requestExchangeRates();
    this.requestLocEurRate();
    this.requestCountries();
  }


  isAuthenticated() {
   return this.props.isAuthenticated();
  }

  requestExchangeRates() {
    this.props.requestExchangeRates();
  }

  requestLocEurRate() {
    this.props.requestLocEurRate();
  }

  requestCountries() {
    this.props.requestCountries();
  }

  render() {
    this.props.persistReferralId(this.props.location.search);
    const isWebView = this.props.location.pathname.indexOf('/mobile') !== -1;

    return (
      <div data-testid="app">
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
          <Route exact path="/" render={(props) =><HomeRouterPage />}/>
          <Route exact path="/profile/listings/edit/:step/:id" render={() => !this.isAuthenticated() ? <Redirect to="/" /> : <EditListingPage />} />
          <Route exact path="/users/resetPassword/:confirm" render={() => <HomeRouterPage />} />
          <Route path="/homes" render={() => <HomeRouterPage />} />
          <Route path="/hotels" render={() => <HomeRouterPage />} />
          <Route path="/mobile" render={() => <HomeRouterPage />} />
          <Route path="/profile/listings/create" render={() => !this.isAuthenticated() ? <Redirect to="/" /> : <CreateListingPage />} />
          <Route path="/profile/" render={() => !this.isAuthenticated() ? <Redirect to="/" /> : <ProfilePage location={this.props.location} />} />
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
