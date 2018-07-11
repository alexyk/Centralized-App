import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Config } from '../../config';
import queryString from 'query-string';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Wallet } from '../../services/blockchain/wallet.js';
import { setIsLogged, setUserInfo } from '../../actions/userInfo';
import { NotificationContainer } from 'react-notifications';

import App from './App';
import StaticMobileHotelsSearchPage from '../hotels/search/StaticMobileHotelsSearchPage';
import MobileHotelDetailsPage from '../hotels/details/MobileHotelDetailsPage';
import MobileHotelBookingPage from '../hotels/book/mobile/MobileHotelBookingPage';
import MobileHotelBookingConfirmPage from '../hotels/book/mobile/MobileHotelBookingConfirmPage';

import {
  getUserInfo
} from '../../requester';

export class AppRouter extends React.Component {
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
    return (
      <div>
        <NotificationContainer />
        <Switch>
          <Route path="/mobile/search" render={() => <StaticMobileHotelsSearchPage />} />
          <Route path="/mobile/details/:id" render={() => <MobileHotelDetailsPage />} />
          <Route path="/mobile/book/confirm/:id" render={() => <MobileHotelBookingConfirmPage />} />
          <Route path="/mobile/book/:id" render={() => <MobileHotelBookingPage />} />
          <Route path="/" render={() => <App />} />
        </Switch>
      </div>
    );
  }
}

AppRouter.propTypes = {
  // start Router props
  location: PropTypes.object,
  history: PropTypes.object,

  // start Redux props
  dispatch: PropTypes.func,
};

function mapStateToProps(state) {
  const { paymentInfo } = state;
  return {
    paymentInfo
  };
}

export default withRouter(connect(mapStateToProps)(AppRouter));

