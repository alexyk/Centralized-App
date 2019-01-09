import '../../styles/css/main.css';
import '../../styles/css/components/captcha/captcha-container.css';
import {Redirect, Route, Switch} from 'react-router-dom';
import React from 'react';
import {Config} from '../../config';

import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import referralIdPersister from '../profile/affiliates/service/persist-referral-id';
import appImports from "./app-defaults";

const {
  MainNav,
  LocalizationNav,
  LoginManager,
  RegisterManager,
  WalletCreationManager,
  PasswordRecoveryManager,
  NotificationContainer,
  HomeRouterPage,
  AffiliateTerms,
  EditListingPage,
  CreateListingPage,
  ProfilePage,
  WorldKuCoinCampaign,
  Balance,
  GooglePlaces,
  HelpPage,
  AboutUsPage,
  Footer
}  = appImports;

export default class defApp extends React.Component{
  static defaultProps = {
    initCalendar: ()=>{
      BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment.utc()));
    },
    persistReferralId: referralIdPersister.tryToSetFromSearch,
  }

  constructor(props) {
    super(props);
    this.isAuthenticated = this.isAuthenticated.bind(this)
  }

  componentDidMount() {
    this.props.initCalendar();
    this.props.persistReferralId(this.props.location.search);
    this.props.requestExchangeRates();
    this.props.requestLocEurRate();
    this.props.requestCountries();
  }


  isAuthenticated() {
    let token = localStorage.getItem(Config.getValue('domainPrefix') + '.auth.locktrip');
    if (token) {
      return true;
    }
    return false;
  }

  render(){
    const isWebView = this.props.location.pathname.indexOf('/mobile') !== -1;
    return  <div data-testid="app">
      {!isWebView && <MainNav />}
      {!isWebView && this.props.location.pathname !== "/affiliate-terms" && <LocalizationNav />}
      <Switch>
        <Route exact path="/recover" render={(props) =><LoginManager openRecoveryOnMount={true}  />}/>
        <Route render={(props) =><LoginManager openRecoveryOnMount={false}/>}/>
      </Switch>
      <RegisterManager />
      <WalletCreationManager />
      <PasswordRecoveryManager />
      <NotificationContainer />
      <Switch>
        <Route exact path="/" render={(props) =><HomeRouterPage />}/>
        <Route exact path="/affiliate-terms" render={(props) =><AffiliateTerms/>}/>
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
      {!isWebView && <Footer />}
    </div>
  }
}
