import '../../styles/css/components/main_nav/main_nav.css';

import {
  AIRDROP_LOGIN,
  AIRDROP_REGISTER,
  ENTER_RECOVERY_TOKEN,
  LOGIN,
  REGISTER,
} from '../../constants/modals.js';
import {
  PROFILE_SUCCESSFULLY_CREATED,
  EMAIL_VERIFIED
} from '../../constants/successMessages.js';
import { Link, withRouter } from 'react-router-dom';
import { closeModal, openModal } from '../../actions/modalsInfo';
import { setIsLogged, setUserInfo } from '../../actions/userInfo';

import AirdropLoginModal from '../profile/airdrop/AirdropLoginModal';
import AirdropRegisterModal from '../profile/airdrop/AirdropRegisterModal';
import { Config } from '../../config';
import { LONG } from '../../constants/notificationDisplayTimes.js';
import { NotificationManager } from 'react-notifications';
import PropTypes from 'prop-types';
import ReCAPTCHA from 'react-google-recaptcha';
import React from 'react';
import { Wallet } from '../../services/blockchain/wallet.js';
import { connect } from 'react-redux';
import queryString from 'query-string';
import requester from '../../requester';
import BurgerMenu from './burger-menu';
import DropdownMenu from './dropdown-menu';
import ListMenu from './list-menu';
import { setShowMenu } from '../../actions/burgerMenuInfo.js';
import LoginManager from '../authentication/LoginManager';
import RegisterManager from '../authentication/RegisterManager';
import WalletCreationManager from '../authentication/WalletCreationManager';
import PasswordRecoveryManager from '../authentication/PasswordRecoveryManager';

class MainNav extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      signUpEmail: '',
      signUpFirstName: '',
      signUpLastName: '',
      signUpPassword: '',
      signUpLocAddress: '',
      emailVerificationToken: '',
      newPassword: '',
      confirmNewPassword: '',
      enterRecoveryToken: false,
      recoveryToken: '',
      recoveryEmail: '',
      unreadMessages: '',
      confirmedRegistration: false,
      currentReCaptcha: '',
    };

    this.onChange = this.onChange.bind(this);
    this.logout = this.logout.bind(this);
    this.setUserInfo = this.setUserInfo.bind(this);
    this.handleAirdropLogin = this.handleAirdropLogin.bind(this);
    this.handleAirdropRegister = this.handleAirdropRegister.bind(this);

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.setMessageListenerPollingInterval = this.setMessageListenerPollingInterval.bind(this);
    this.getCountOfMessages = this.getCountOfMessages.bind(this);
    this.showMenu = this.showMenu.bind(this);

    this.executeReCaptcha = this.executeReCaptcha.bind(this);
    this.getReCaptchaFunction = this.getReCaptchaFunction.bind(this);
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

    this.setMessageListenerPollingInterval();
  }

  removeVerificationCodeFromURL() {
    const path = this.props.location.pathname;
    const search = this.props.location.search;
    const indexOfSecurityCode = search.indexOf('&emailVerificationSecurityCode=');
    const pushURL = path + search.substring(0, indexOfSecurityCode);
    this.props.history.push(pushURL);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleAirdropRegister(captchaToken) {
    let user = {
      email: this.state.signUpEmail,
      firstName: this.state.signUpFirstName,
      lastName: this.state.signUpLastName,
      password: this.state.signUpPassword,
      locAddress: localStorage.walletAddress,
      jsonFile: localStorage.walletJson,
      image: Config.getValue('basePath') + 'images/default.png'
    };

    this.clearLocalStorage();
    requester.register(user, captchaToken).then(res => {
      if (res.success) {
        this.openModal(AIRDROP_LOGIN);
        NotificationManager.success(PROFILE_SUCCESSFULLY_CREATED, '', LONG);
      } else {
        res.errors.then(res => {
          const errors = res;
          for (let key in errors) {
            if (typeof errors[key] !== 'function') {
              NotificationManager.warning(errors[key].message, 'Field: ' + key.toUpperCase(), LONG);
            }
          }
        });
      }
    });
  }

  handleAirdropLogin(captchaToken) {
    let user = {
      email: this.state.loginEmail,
      password: this.state.loginPassword
    };

    requester.login(user, captchaToken).then(res => {
      if (res.success) {
        res.body.then(data => {
          localStorage[Config.getValue('domainPrefix') + '.auth.locktrip'] = data.Authorization;
          localStorage[Config.getValue('domainPrefix') + '.auth.username'] = user.email;

          this.setUserInfo();
          this.closeModal(AIRDROP_LOGIN);

          if (this.props.location.pathname.indexOf('/airdrop') !== -1) {
            this.handleAirdropUser();
          }
        });
      } else {
        res.errors.then(res => {
          const errors = res;
          for (let key in errors) {
            if (typeof errors[key] !== 'function') {
              NotificationManager.warning(errors[key].message, '', LONG);
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

  logout(e) {
    if (e) {
      e.preventDefault();
    }

    localStorage.removeItem(Config.getValue('domainPrefix') + '.auth.locktrip');
    localStorage.removeItem(Config.getValue('domainPrefix') + '.auth.username');

    this.props.dispatch(setIsLogged(false));
    this.setState({
      userName: '',
      loginEmail: '',
      loginPassword: '',
    });

    this.props.history.push('/');
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

  setMessageListenerPollingInterval() {
    this.getCountOfMessages();
    setInterval(() => {
      this.getCountOfMessages();
    }, 120000);
  }

  getCountOfMessages() {
    if (
      localStorage[Config.getValue('domainPrefix') + '.auth.locktrip']
      && localStorage[Config.getValue('domainPrefix') + '.auth.username']) {
      requester.getCountOfMyUnreadMessages().then(res => {
        res.body.then(data => {
          this.setState({ unreadMessages: data.count });
        });
      });
    }
  }

  executeReCaptcha(currentReCaptcha) {
    this.setState({ currentReCaptcha }, () => this.captcha.execute());
  }

  getReCaptchaFunction(currentReCaptcha) {
    switch (currentReCaptcha) {
      case 'recoveryEmail':
        return this.handleSubmitRecoveryEmail;
      case 'changePassword':
        return this.handlePasswordChange;
      case 'createWallet':
        return this.handleCreateWallet;
      default:
        return null;
    }
  }

  showMenu() {
    this.props.dispatch(setShowMenu(true));
  }

  render() {
    const { unreadMessages, currentReCaptcha } = this.state;
    return (
      <nav id="main-nav" className="navbar">
        <div className="captcha-container">
          {
            currentReCaptcha && (
              <ReCAPTCHA
                ref={el => this.captcha = el}
                size="invisible"
                sitekey={Config.getValue('recaptchaKey')}
                onChange={(token) => {
                  const reCaptchaFunc = this.getReCaptchaFunction(currentReCaptcha);
                  reCaptchaFunc(token);
                  this.captcha.reset();
                  this.setState({
                    currentReCaptcha: ''
                  });
                }}
              />
            )
          }
        </div>
        
        <AirdropLoginModal isActive={this.props.modalsInfo.isActive[AIRDROP_LOGIN]} openModal={this.openModal} closeModal={this.closeModal} loginEmail={this.state.loginEmail} loginPassword={this.state.loginPassword} onChange={this.onChange} handleLogin={this.handleAirdropLogin} />
        <AirdropRegisterModal isActive={this.props.modalsInfo.isActive[AIRDROP_REGISTER]} openModal={this.openModal} closeModal={this.closeModal} signUpEmail={this.state.signUpEmail} signUpFirstName={this.state.signUpFirstName} signUpLastName={this.state.signUpLastName} signUpPassword={this.state.signUpPassword} onChange={this.onChange} />

        <LoginManager />
        <RegisterManager />
        <WalletCreationManager />
        <PasswordRecoveryManager />

        <div className="container">
          <div className="nav-container">

            <Link className="navbar-logo" to="/">
              <img src={Config.getValue('basePath') + 'images/locktrip_logo.svg'} alt='logo' />
            </Link>
            
            {localStorage[Config.getValue('domainPrefix') + '.auth.locktrip']
              ? <ListMenu>
                <Link className="list-menu-item" to="/profile/reservations">Hosting</Link>
                <Link className="list-menu-item" to="/profile/trips">Traveling</Link>
                <Link className="list-menu-item" to="/profile/wallet">Wallet</Link>
                <Link className="list-menu-item" to="/profile/messages">
                  <div className="messages">
                    <span className="fa fa-envelope-o mailbox"></span>
                    {unreadMessages > 0 && <span className="fa fa-circle count-background"></span>}
                    {unreadMessages > 0 && <span className="count">{unreadMessages > 9 ? 9 : unreadMessages}</span>}
                  </div>
                </Link>
                <DropdownMenu buttonText={localStorage[Config.getValue('domainPrefix') + '.auth.username']}>
                  <Link className="dropdown-menu-item" to="/profile/dashboard">Dashboard</Link>
                  <Link className="dropdown-menu-item" to="/profile/listings">My Listings</Link>
                  <Link className="dropdown-menu-item" to="/profile/trips">My Trips</Link>
                  <Link className="dropdown-menu-item" to="/profile/reservations">My Guests</Link>
                  <Link className="dropdown-menu-item" to="/profile/me/edit">Profile</Link>
                  <Link className="dropdown-menu-item" to="/airdrop">Airdrop</Link>
                  <Link className="dropdown-menu-item" to="/" onClick={this.logout}>Logout</Link>
                </DropdownMenu>
              </ListMenu>
              : <ListMenu>
                <div className="list-menu-item" onClick={() => { this.openModal(LOGIN); }}>Login</div>
                <div className="list-menu-item" onClick={() => { this.openModal(REGISTER); }}>Register</div>
              </ListMenu>
            }

            {localStorage[Config.getValue('domainPrefix') + '.auth.locktrip']
              ? <BurgerMenu>
                <Link className="menu-item" to="/profile/dashboard">Dashboard</Link>
                <Link className="menu-item" to="/profile/reservations">My Guests</Link>
                <Link className="menu-item" to="/profile/trips">My Trips</Link>
                <Link className="menu-item" to="/profile/listings">My Listings</Link>
                <Link className="menu-item" to="/profile/wallet">Wallet</Link>
                <Link className="menu-item" to="/profile/messages">Messages</Link>
                <Link className="menu-item" to="/profile/me/edit">Profile</Link>
                <Link className="menu-item" to="/airdrop">Airdrop</Link>
                <Link className="menu-item" to="/" onClick={this.logout}>Logout</Link>
              </BurgerMenu>
              : <BurgerMenu>
                <div className="menu-item" onClick={() => { this.openModal(LOGIN); }}>Login</div>
                <div className="menu-item" onClick={() => { this.openModal(REGISTER); }}>Register</div>
              </BurgerMenu>
            }
          </div>
          <button className="slider-menu-toggle-button mb-only" onClick={this.showMenu}><span className="fa fa-bars"></span></button>
        </div>
      </nav>
    );
  }
}

MainNav.propTypes = {
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

export default withRouter(connect(mapStateToProps)(MainNav));
