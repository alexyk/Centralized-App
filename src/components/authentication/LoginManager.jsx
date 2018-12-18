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
import { setIsLogged, setUserInfo } from '../../actions/userInfo';
import { isActive } from '../../selectors/modalsInfo';
import { Wallet } from '../../services/blockchain/wallet.js';
import { VERIFICATION_EMAIL_SENT } from '../../constants/infoMessages.js';
import UpdateCountryModal from './modals/UpdateCountryModal';
import EmailVerificationModal from './modals/EmailVerificationModal';
import EnterEmailVerificationTokenModal from './modals/EnterEmailVerificationTokenModal';
import { executeWithToken } from '../../services/grecaptcha/grecaptcha';
import queryString from 'query-string';
import {
  EMAIL_VERIFICATION,
  ENTER_RECOVERY_TOKEN,
} from '../../constants/modals.js';
import {
  INVALID_SECURITY_CODE
} from '../../constants/warningMessages';
import {
  ENTER_EMAIL_VERIFICATION_SECURITY_TOKEN,
} from '../../constants/modals.js';
import {
  EMAIL_VERIFIED
} from '../../constants/successMessages.js';
import {
  LOGIN,
  UPDATE_COUNTRY
} from '../../constants/modals.js';

class LoginManager extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loginEmail: '',
      loginPassword: '',
      country: null,
      states: [],
      countryState: '',
      recoveryToken: '',
      isUpdatingCountry: false,
      isLogging: false
    };

    this.onChange = this.onChange.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.login = this.login.bind(this);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleChangeCountry = this.handleChangeCountry.bind(this);
    this.handleUpdateCountry = this.handleUpdateCountry.bind(this);
    this.requestStates = this.requestStates.bind(this);
  }

  componentDidMount() {
    if (
      localStorage[Config.getValue('domainPrefix') + '.auth.locktrip'] &&
      localStorage[Config.getValue('domainPrefix') + '.auth.username']
    ) {
      this.setUserInfo();
    }

    const queryParams = queryString.parse(this.props.location.search);
    if (queryParams.token) {
      this.setState({ recoveryToken: queryParams.token });
      this.openModal(ENTER_RECOVERY_TOKEN);
    }

    if (queryParams.emailVerificationSecurityCode) {
      const { emailVerificationSecurityCode } = queryParams;
      requester.verifyEmailSecurityCode({ emailVerificationSecurityCode })
        .then(res => res.body)
        .then(data => {
          if (data.isEmailVerified) {
            NotificationManager.success(EMAIL_VERIFIED, '', LONG);
            this.setUserInfo();
          }
        });

      this.removeVerificationCodeFromURL();
    }
  }

  removeVerificationCodeFromURL() {
    const path = this.props.location.pathname;
    const search = this.props.location.search;
    const indexOfSecurityCode = search.indexOf('&emailVerificationSecurityCode=');
    const pushURL = path + search.substring(0, indexOfSecurityCode);
    this.props.history.push(pushURL);
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
      this.setState({ country: null });
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



  handleLoginClick() {
    this.setState({ isLogging: true }, () => {
      executeWithToken(this.login);
    });
  }

  login(captchaToken) {
    
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
      this.setState({ isUpdatingCountry: false, country: null, countryState: '' });
    }

    requester.login(user, captchaToken).then(res => {
      if (res.success) {
        res.body.then(data => {
          localStorage[Config.getValue('domainPrefix') + '.auth.locktrip'] = data.Authorization;
          localStorage[Config.getValue('domainPrefix') + '.auth.username'] = user.email;
          this.setUserInfo();
          this.closeModal(LOGIN);
          this.setState({ loginEmail: '', loginPassword: '', isLogging: false });
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
        this.setState({ isUpdatingCountry: true, isLogging: false }, () => {
          this.closeModal(LOGIN);
          this.openModal(UPDATE_COUNTRY);
        });
      } else {
        for (let key in errors) {
          if (typeof errors[key] !== 'function') {
            NotificationManager.warning(errors[key].message, '', LONG);
          }
        }

        this.setState({ loginEmail: '', loginPassword: '', isLogging: false });
      }
    }).catch(errors => {
      for (var e in errors) {
        NotificationManager.warning(errors[e].message, '', LONG);
      }
      
      this.setState({ loginEmail: '', loginPassword: '' });
    });
  }

  handleUpdateCountry() {
    if (this.state.country) {
      if (['Canada', 'India', 'United States of America'].includes(this.state.country.name) && !this.state.countryState) {
        NotificationManager.error('Please select a valid state.', '', LONG);
      } else {
        this.setState({ isLogging: true }, () => {
          executeWithToken(this.login);
        });
      }
    } else {
      NotificationManager.error('Please select a valid country.', '', LONG);
    }
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
          isActive={this.props.isActive[LOGIN]}
          openModal={this.openModal}
          closeModal={this.closeModal}
          loginEmail={this.state.loginEmail}
          loginPassword={this.state.loginPassword}
          onChange={this.onChange}
          handleLogin={this.handleLoginClick}
          isLogging={this.state.isLogging}
        />
        <UpdateCountryModal 
          isActive={this.props.isActive[UPDATE_COUNTRY]} 
          openModal={this.openModal} 
          closeModal={this.closeModal} 
          onChange={this.onChange} 
          country={this.state.country}
          states={this.state.states} 
          countryState={this.state.countryState} 
          handleUpdateCountry={this.handleUpdateCountry} 
          handleChangeCountry={this.handleChangeCountry} 
          isLogging={this.state.isLogging}
        />
        <EmailVerificationModal 
          isActive={this.props.isActive[EMAIL_VERIFICATION]} 
          openModal={this.openModal} 
          closeModal={this.closeModal} 
          onChange={this.onChange} 
          requestVerificationEmail={this.requestVerificationEmail} 
        />
        <EnterEmailVerificationTokenModal 
          isActive={this.props.isActive[ENTER_EMAIL_VERIFICATION_SECURITY_TOKEN]} 
          openModal={this.openModal} 
          closeModal={this.closeModal} 
          onChange={this.onChange} 
          handleLogin={() => executeWithToken(this.login)} 
          emailVerificationToken={this.state.emailVerificationToken} 
        />
        {/* <AirdropLoginModal isActive={this.props.isActive[AIRDROP_LOGIN]} openModal={this.openModal} closeModal={this.closeModal} loginEmail={this.state.loginEmail} loginPassword={this.state.loginPassword} onChange={this.onChange} handleLogin={this.handleAirdropLogin} /> */}
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
  isActive: PropTypes.object,
};

function mapStateToProps(state) {
  const { modalsInfo } = state;
  return {
    isActive: isActive(modalsInfo)
  };
}

export default withRouter(connect(mapStateToProps)(LoginManager));