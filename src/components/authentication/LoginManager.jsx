import React from 'react';
import requester from '../../requester';
import { Config } from '../../config';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import { LONG } from '../../constants/notificationDisplayTimes.js';
import LoginModal from './modals/LoginModal';
import { closeModal, openModal } from '../../actions/modalsInfo';
import ReCAPTCHA from 'react-google-recaptcha';
import { setIsLogged, setUserInfo } from '../../actions/userInfo';
import { Wallet } from '../../services/blockchain/wallet.js';

import {
  LOGIN,
  UPDATE_COUNTRY
} from '../../constants/modals.js';

class LoginManager extends React.Component {
  constructor(props) {
    super(props);

    this.captcha = null;

    this.state = {
      loginEmail: '',
      loginPassword: '',
    };

    this.onChange = this.onChange.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.requestCountries = this.requestCountries.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  openModal(modal, e) {
    if (e) {
      e.preventDefault();
    }

    this.props.dispatch(openModal(modal));
  }

  closeModal(modal, e) {
    if (e) {
      e.preventDefault();
    }

    this.setState({ loginEmail: '', loginPassword: '' });
    this.props.dispatch(closeModal(modal));
  }

  handleLogin(captchaToken) {
    let user = {
      email: this.state.loginEmail,
      password: this.state.loginPassword
    };

    if (this.state.isUpdatingCountry && this.state.country) {
      user.country = this.state.country.id;
      if (this.state.countryState) {
        user.countryState = Number(this.state.countryState);
      }

      this.closeModal(UPDATE_COUNTRY);
      this.setState({ isUpdatingCountry: false, country: '', countryState: '' });
    }

    requester.login(user, captchaToken).then(res => {
      if (res.success) {
        res.body.then(data => {
          localStorage[Config.getValue('domainPrefix') + '.auth.locktrip'] = data.Authorization;
          localStorage[Config.getValue('domainPrefix') + '.auth.username'] = user.email;

          this.setUserInfo();
          this.closeModal(LOGIN);

          if (this.props.location.pathname.indexOf('/airdrop') !== -1) {
            this.handleAirdropUser();
          }
        });
      } else {
        res.errors.then(res => {
          const errors = res.errors;
          if (errors.hasOwnProperty('CountryNull')) {
            NotificationManager.warning(errors['CountryNull'].message, '', LONG);
            this.requestCountries();
            this.setState({ isUpdatingCountry: true }, () => {
              this.closeModal(LOGIN);
              this.openModal(UPDATE_COUNTRY);
            });
          } else {
            for (let key in errors) {
              if (typeof errors[key] !== 'function') {
                NotificationManager.warning(errors[key].message, '', LONG);
              }
            }
          }
        }).catch(errors => {
          for (var e in errors) {
            NotificationManager.warning(errors[e].message, '', LONG);
          }
        });
      }
    });
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

  requestCountries() {
    requester.getCountries()
      .then(response => response.body)
      .then(data => this.setState({ countries: data }));
  }

  render() {
    return (
      <React.Fragment>
        <LoginModal 
          isActive={this.props.modalsInfo.isActive[LOGIN]} 
          openModal={this.openModal} 
          closeModal={this.closeModal} 
          loginEmail={this.state.loginEmail} 
          loginPassword={this.state.loginPassword} 
          onChange={this.onChange} 
          handleLogin={() => this.captcha.execute()} 
          requestCountries={this.requestCountries} 
        />
        <ReCAPTCHA
          ref={el => this.captcha = el}
          size="invisible"
          sitekey={Config.getValue('recaptchaKey')}
          onChange={(token) => {
            this.handleLogin(token);
            this.captcha.reset();
          }}
        />
      </React.Fragment>
    );
  }
}

LoginManager.propTypes = {
  // start Router props
  location: PropTypes.object,
  history: PropTypes.object,

  // start Redux props
  dispatch: PropTypes.func,
  userInfo: PropTypes.object,
  modalsInfo: PropTypes.object,
};

function mapStateToProps(state) {
  const { userInfo, modalsInfo, airdropInfo } = state;
  return {
    userInfo,
    modalsInfo,
    airdropInfo
  };
}

export default withRouter(connect(mapStateToProps)(LoginManager));