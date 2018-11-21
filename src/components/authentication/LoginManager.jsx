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
import { VERIFICATION_EMAIL_SENT } from '../../constants/infoMessages.js';
import UpdateCountryModal from './modals/UpdateCountryModal';
import { setAirdropInfo } from '../../actions/airdropInfo';
import EmailVerificationModal from './modals/EmailVerificationModal';
import EnterEmailVerificationTokenModal from './modals/EnterEmailVerificationTokenModal';
import {
  EMAIL_VERIFICATION,
} from '../../constants/modals.js';
import {
  INVALID_SECURITY_CODE, MISSING_AIRDROP_INFO
} from '../../constants/warningMessages';
import {
  ENTER_EMAIL_VERIFICATION_SECURITY_TOKEN,
} from '../../constants/modals.js';

import {
  LOGIN,
  UPDATE_COUNTRY
} from '../../constants/modals.js';

class LoginManager extends React.Component {
  constructor(props) {
    super(props);

    this.captcha = null;
    this.updateCountryCaptcha = null;

    this.state = {
      loginEmail: '',
      loginPassword: '',
      country: '',
      countryState: ''
    };

    this.onChange = this.onChange.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleChangeCountry = this.handleChangeCountry.bind(this);
    this.handleUpdateCountry = this.handleUpdateCountry.bind(this);
    this.requestCountries = this.requestCountries.bind(this);
    this.requestStates = this.requestStates.bind(this);
  }

  requestCountries() {
    requester.getCountries()
      .then(response => response.body)
      .then(data => this.setState({ countries: data }));
  }

  requestStates(id) {
    requester.getStates(id)
      .then(response => response.body)
      .then(data => this.setState({ states: data }));
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleChangeCountry(e) {
    if (!e.target.value) {
      this.setState({ country: '' });
    } else {
      const countryHasMandatoryState = ['Canada', 'India', 'United States of America'].includes(JSON.parse(e.target.value).name);
      this.setState({ country: JSON.parse(e.target.value) });
      if (countryHasMandatoryState) {
        this.requestStates(JSON.parse(e.target.value).id);
      }
    }
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
          this.setUserInfo(user, data);
          this.closeModal(LOGIN);
          this.setState({ loginEmail: '', loginPassword: '' });
          if (this.props.location.pathname.indexOf('/airdrop') !== -1) {
            this.handleAirdropUser();
          }
        });
      } else {
        this.handleLoginErrors(res);
      }
    });
  }

  handleLoginErrors(res) {
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

        this.setState({ loginEmail: '', loginPassword: '' });
      }
    }).catch(errors => {
      for (var e in errors) {
        NotificationManager.warning(errors[e].message, '', LONG);
      }
      
      this.setState({ loginEmail: '', loginPassword: '' });
    });
  }

  handleAirdropUser() {
    requester.getUserAirdropInfo().then(res => {
      res.body.then(data => {
        if (data.participates) {
          this.dispatchAirdropInfo(data);
        } else {
          // console.log('user not yet moved from temp to main');
          const token = this.props.location.search.split('=')[1];
          requester.checkIfAirdropUserExists(token).then(res => {
            res.body.then(user => {
              const currentEmail = localStorage[Config.getValue('domainPrefix') + '.auth.username'];
              if (user.email === currentEmail && user.exists) {
                // console.log('users match');
                requester.verifyUserAirdropInfo(token).then(() => {
                  // console.log('user moved from temp to main');
                  NotificationManager.info(VERIFICATION_EMAIL_SENT, '', LONG);
                  requester.getUserAirdropInfo().then(res => {
                    res.body.then(data => {
                      this.dispatchAirdropInfo(data);
                    });
                  });
                });
              } else {
                // console.log('users dont match', user.email, currentEmail);
              }
            });
          });
        }
      }).catch(() => {
        NotificationManager.warning(MISSING_AIRDROP_INFO, '', LONG);
        this.props.history.push('/airdrop');
      });
    });
  }

  dispatchAirdropInfo(info) {
    const email = info.user;
    const facebookProfile = info.facebookProfile;
    const telegramProfile = info.telegramProfile;
    const twitterProfile = info.twitterProfile;
    const redditProfile = info.redditProfile;
    const refLink = info.refLink;
    const participates = info.participates;
    const isVerifyEmail = info.isVerifyEmail;
    const referralCount = info.referralCount;
    const isCampaignSuccessfullyCompleted = info.isCampaignSuccessfullyCompleted;
    const voteUrl = info.voteUrl ? info.voteUrl : '';
    const finalizedStatus = info.finalizedStatus;
    this.props.dispatch(setAirdropInfo(email, facebookProfile, telegramProfile, twitterProfile, redditProfile, refLink, participates, isVerifyEmail, referralCount, isCampaignSuccessfullyCompleted, voteUrl, finalizedStatus));
    this.setState({ voteUrl: voteUrl, loading: false });
  }

  handleUpdateCountry() {
    if (this.state.country) {
      if (['Canada', 'India', 'United States of America'].includes(this.state.country.name) && !this.state.countryState) {
        NotificationManager.error('Please select a valid state.', '', LONG);
      } else {
        this.closeModal(UPDATE_COUNTRY);
        this.captcha.execute();
      }
    } else {
      NotificationManager.error('Please select a valid country.', '', LONG);
    }
  }

  setUserInfo(user, data) {
    localStorage[Config.getValue('domainPrefix') + '.auth.locktrip'] = data.Authorization;
    localStorage[Config.getValue('domainPrefix') + '.auth.username'] = user.email;

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

  requestVerificationEmail() {
    const emailVerificationRedirectURL = this.props.location.pathname + this.props.location.search;
    requester.sendVerificationEmail({ emailVerificationRedirectURL })
      .then(res => res.body)
      .then(data => {
        if (data.isVerificationEmailSent) {
          NotificationManager.success(VERIFICATION_EMAIL_SENT, '', LONG);
        } else {
          NotificationManager.error(INVALID_SECURITY_CODE, '', LONG);
        }
      });

    this.closeModal(EMAIL_VERIFICATION);
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
        <UpdateCountryModal 
          isActive={this.props.modalsInfo.isActive[UPDATE_COUNTRY]} 
          openModal={this.openModal} 
          closeModal={this.closeModal} 
          onChange={this.onChange} 
          country={this.state.country} 
          countries={this.state.countries} 
          states={this.state.states} 
          countryState={this.state.countryState} 
          handleUpdateCountry={this.handleUpdateCountry} 
          handleChangeCountry={this.handleChangeCountry} 
        />
        <EmailVerificationModal 
          isActive={this.props.modalsInfo.isActive[EMAIL_VERIFICATION]} 
          openModal={this.openModal} 
          closeModal={this.closeModal} 
          onChange={this.onChange} 
          requestVerificationEmail={this.requestVerificationEmail} 
        />
        <EnterEmailVerificationTokenModal 
          isActive={this.props.modalsInfo.isActive[ENTER_EMAIL_VERIFICATION_SECURITY_TOKEN]} 
          openModal={this.openModal} 
          closeModal={this.closeModal} 
          onChange={this.onChange} 
          handleLogin={() => this.executeReCaptcha('login')} 
          emailVerificationToken={this.state.emailVerificationToken} 
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