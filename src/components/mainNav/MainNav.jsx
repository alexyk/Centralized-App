import '../../styles/css/components/captcha/captcha-container.css';

import {
  AIRDROP_LOGIN,
  AIRDROP_REGISTER,
  CHANGE_PASSWORD,
  CONFIRM_WALLET,
  CREATE_WALLET,
  EMAIL_VERIFICATION,
  ENTER_EMAIL_VERIFICATION_SECURITY_TOKEN,
  ENTER_RECOVERY_TOKEN,
  LOGIN,
  REGISTER,
  SAVE_WALLET,
  SEND_RECOVERY_EMAIL,
  UPDATE_COUNTRY
} from '../../constants/modals.js';
import {
  INVALID_EMAIL,
  INVALID_PASSWORD,
  INVALID_SECURITY_CODE,
  PASSWORDS_DONT_MATCH,
  PROFILE_PASSWORD_REQUIREMENTS
} from '../../constants/warningMessages';
import { 
  PASSWORD_SUCCESSFULLY_CHANGED, 
  PROFILE_SUCCESSFULLY_CREATED, 
  EMAIL_VERIFIED 
} from '../../constants/successMessages.js';
import { Link, withRouter } from 'react-router-dom';
import { MenuItem, Nav, NavDropdown, NavItem, Navbar } from 'react-bootstrap/lib';
import { NOT_FOUND } from '../../constants/errorMessages';
import { closeModal, openModal } from '../../actions/modalsInfo';
import { setIsLogged, setUserInfo } from '../../actions/userInfo';

import AirdropLoginModal from '../profile/airdrop/AirdropLoginModal';
import AirdropRegisterModal from '../profile/airdrop/AirdropRegisterModal';
import ChangePasswordModal from './modals/ChangePasswordModal';
import { Config } from '../../config';
import ConfirmWalletModal from './modals/ConfirmWalletModal';
import CreateWalletModal from './modals/CreateWalletModal';
import EmailVerificationModal from './modals/EmailVerificationModal';
import EnterEmailVerificationTokenModal from './modals/EnterEmailVerificationTokenModal';
import EnterRecoveryTokenModal from './modals/EnterRecoveryTokenModal';
import { LONG } from '../../constants/notificationDisplayTimes.js';
import LoginModal from './modals/LoginModal';
import { MISSING_AIRDROP_INFO } from '../../constants/warningMessages.js';
import { NotificationManager } from 'react-notifications';
import PropTypes from 'prop-types';
import ReCAPTCHA from 'react-google-recaptcha';
import React from 'react';
import RegisterModal from './modals/RegisterModal';
import SaveWalletModal from './modals/SaveWalletModal';
import SendRecoveryEmailModal from './modals/SendRecoveryEmailModal';
import UpdateCountryModal from './modals/UpdateCountryModal';
import { VERIFICATION_EMAIL_SENT } from '../../constants/infoMessages.js';
import { Wallet } from '../../services/blockchain/wallet.js';
import { connect } from 'react-redux';
import queryString from 'query-string';
import requester from '../../requester';
import { setAirdropInfo } from '../../actions/airdropInfo';

class MainNav extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      signUpEmail: '',
      signUpFirstName: '',
      signUpLastName: '',
      signUpPassword: '',
      signUpLocAddress: '',
      loginEmail: '',
      loginPassword: '',
      country: '',
      emailVerificationToken: '',
      walletPassword: '',
      repeatWalletPassword: '',
      mnemonicWords: '',
      userName: '',
      userToken: '',
      newPassword: '',
      confirmNewPassword: '',
      enterRecoveryToken: false,
      recoveryToken: '',
      recoveryEmail: '',
      unreadMessages: '',
      isUpdatingWallet: false,
      confirmedRegistration: false,
      currentReCaptcha: '',
      countryState: ''
    };

    this.onChange = this.onChange.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.logout = this.logout.bind(this);
    this.setUserInfo = this.setUserInfo.bind(this);
    this.handleAirdropLogin = this.handleAirdropLogin.bind(this);
    this.handleAirdropRegister = this.handleAirdropRegister.bind(this);

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.clearStateOnCloseModal = this.clearStateOnCloseModal.bind(this);

    this.messageListener = this.messageListener.bind(this);
    this.getCountOfMessages = this.getCountOfMessages.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleMnemonicWordsChange = this.handleMnemonicWordsChange.bind(this);
    this.handleSubmitRecoveryToken = this.handleSubmitRecoveryToken.bind(this);
    this.handleSubmitRecoveryEmail = this.handleSubmitRecoveryEmail.bind(this);
    this.handleConfirmWallet = this.handleConfirmWallet.bind(this);
    this.handleUpdateCountry = this.handleUpdateCountry.bind(this);
    this.handleChangeCountry = this.handleChangeCountry.bind(this);
    this.requestVerificationEmail = this.requestVerificationEmail.bind(this);
    this.requestCountries = this.requestCountries.bind(this);
    this.requestStates = this.requestStates.bind(this);

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

    // this.requestCountries();

    const queryParams = queryString.parse(this.props.location.search);
    if (queryParams.token) {
      this.setState({ recoveryToken: queryParams.token });
      this.openModal(ENTER_RECOVERY_TOKEN);
    }

    // if (queryParams.emailVerificationToken) {
    //   this.setState({
    //     emailVerificationToken: queryParams.emailVerificationToken,
    //     isVerifyingEmail: true,
    //   });
    //   this.openModal(LOGIN);
    // }

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

    this.messageListener();
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

  handleChangeCountry(e) {
    if (!e.target.value) {
      this.setState({ country: '' });
    }
    else {
      this.requestStates(JSON.parse(e.target.value).id);
      this.setState({ country: JSON.parse(e.target.value) });
    }
  }

  handleMnemonicWordsChange(e) {
    const value = e.target.value.replace(/\n/g, '');
    this.setState({ [e.target.name]: value });
  }

  handleRegister(captchaToken) {
    let user = {
      email: this.state.signUpEmail,
      firstName: this.state.signUpFirstName,
      lastName: this.state.signUpLastName,
      password: this.state.signUpPassword,
      country: this.state.country.id,
      locAddress: localStorage.walletAddress,
      jsonFile: localStorage.walletJson,
      image: Config.getValue('basePath') + 'images/default.png'
    };

    console.log(user);

    this.clearLocalStorage();

    requester.register(user, captchaToken).then(res => {
      if (res.success) {
        this.closeModal(CONFIRM_WALLET);
        this.setState({
          confirmedRegistration: false,
        });
        this.openModal(LOGIN);
        NotificationManager.success(PROFILE_SUCCESSFULLY_CREATED, '', LONG);
      }
      else {
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
      }
      else {
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

  handleLogin() {
    let user = {
      email: this.state.loginEmail,
      password: this.state.loginPassword
    };

    if (this.state.isUpdatingWallet) {
      user.locAddress = localStorage.walletAddress;
      user.jsonFile = localStorage.walletJson;
      this.clearLocalStorage();
      this.setState({ isUpdatingWallet: false });
    }

    if (this.state.isUpdatingCountry && this.state.country) {
      user.country = this.state.country.id;
      if (this.state.countryState) {
        user.countryState = Number(this.state.countryState);
      }
      this.closeModal(UPDATE_COUNTRY);
      this.setState({ isUpdatingCountry: false, country: '', countryState: '' });
    }

    // if (this.state.isVerifyingEmail && this.state.emailVerificationToken) {
    //   user.emailVerificationToken = this.state.emailVerificationToken;
    //   this.closeModal(EMAIL_VERIFICATION);
    //   this.setState({ isVerifyingEmail: false, emailVerificationToken: '' });
    // }

    requester.login(user).then(res => {
      if (res.success) {
        res.body.then(data => {
          localStorage[Config.getValue('domainPrefix') + '.auth.locktrip'] = data.Authorization;
          localStorage[Config.getValue('domainPrefix') + '.auth.username'] = user.email;

          this.setUserInfo();
          this.closeModal(LOGIN);

          if (this.props.location.pathname.indexOf('/airdrop') !== -1) {
            this.handleAirdropUser();
          }
          // this.captcha.reset();
        });
      } else {
        res.errors.then(res => {
          const errors = res.errors;
          if (errors.hasOwnProperty('JsonFileNull')) {
            NotificationManager.warning(errors['JsonFileNull'].message, '', LONG);
            this.setState({ isUpdatingWallet: true }, () => {
              this.closeModal(LOGIN);
              this.openModal(CREATE_WALLET);
            });
          } else if (errors.hasOwnProperty('CountryNull')) {
            NotificationManager.warning(errors['CountryNull'].message, '', LONG);
            this.requestCountries();
            this.setState({ isUpdatingCountry: true }, () => {
              this.closeModal(LOGIN);
              this.openModal(UPDATE_COUNTRY);
            });
          } else if (errors.hasOwnProperty('EmailNotVerified')) {
            // NotificationManager.warning(errors['EmailNotVerified'].message, '', LONG);
            // this.setState({ isVerifyingEmail: true }, () => {
            //   this.closeModal(LOGIN);
            //   this.openModal(EMAIL_VERIFICATION);
            // });
            console.log('EmailNotVerifiedException');
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

  handleAirdropLogin(captchaToken) {
    let user = {
      email: this.state.loginEmail,
      password: this.state.loginPassword
    };

    if (this.state.isUpdatingWallet) {
      user.locAddress = localStorage.walletAddress;
      user.jsonFile = localStorage.walletJson;
      this.clearLocalStorage();
      this.setState({ isUpdatingWallet: false });
    }

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
          // console.log(errors);
          if (errors.hasOwnProperty('JsonFileNull')) {
            NotificationManager.warning(errors['JsonFileNull'].message, '', LONG);
            this.setState({ isUpdatingWallet: true }, () => {
              this.closeModal(AIRDROP_LOGIN);
              this.openModal(CREATE_WALLET);
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
    this.props.dispatch(setAirdropInfo(email, facebookProfile, telegramProfile, twitterProfile, redditProfile, refLink, participates, isVerifyEmail));
  }

  clearLocalStorage() {
    localStorage['walletAddress'] = '';
    localStorage['walletMnemonic'] = '';
    localStorage['walletJson'] = '';
  }

  setUserInfo() {
    this.props.dispatch(setIsLogged(true));
    requester.getUserInfo().then(res => {
      res.body.then(data => {
        Wallet.getBalance(data.locAddress).then(eth => {
          const ethBalance = eth / (Math.pow(10, 18));
          Wallet.getTokenBalance(data.locAddress).then(loc => {
            const locBalance = loc / (Math.pow(10, 18));
            const { firstName, lastName, phoneNumber, email, locAddress, gender, isEmailVerified } = data;
            const isAdmin = data.roles.findIndex((r) => r.name === 'ADMIN') !== -1;
            this.props.dispatch(setUserInfo(firstName, lastName, phoneNumber, email, locAddress, ethBalance, locBalance, gender, isEmailVerified, isAdmin));
          });
        });
      });
    });
  }

  logout(e) {
    e.preventDefault();

    localStorage.removeItem(Config.getValue('domainPrefix') + '.auth.locktrip');
    localStorage.removeItem(Config.getValue('domainPrefix') + '.auth.username');

    // reflect that the user is logged out, both in Redux and in the local component state
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

    this.clearStateOnCloseModal();
    this.props.dispatch(closeModal(modal));
  }

  clearStateOnCloseModal(modal) {
    if (modal === LOGIN) {
      this.setState({ loginEmail: '', loginPassword: '' });
    }
    // else if (modal === EMAIL_VERIFICATION) {
    //   this.setState({ isVerifyingEmail: false, emailVerificationToken: '' });
    // }
  }

  messageListener() {
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

  handlePasswordChange(token) {
    const password = this.state.newPassword;
    const confirm = this.state.confirmNewPassword;
    if (password !== confirm) {
      NotificationManager.warning(PASSWORDS_DONT_MATCH, '', LONG);
      return;
    }

    if (password.length < 6 || password.length > 30) {
      NotificationManager.warning(INVALID_PASSWORD, '', LONG);
      return;
    }

    if (!password.match('^([^\\s]*[a-zA-Z]+.*?[0-9]+[^\\s]*|[^\\s]*[0-9]+.*?[a-zA-Z]+[^\\s]*)$')) {
      NotificationManager.warning(PROFILE_PASSWORD_REQUIREMENTS, '', LONG);
      return;
    }

    const postObj = {
      token: this.state.recoveryToken,
      password: password,
    };

    requester.sendNewPassword(postObj, token).then(res => {
      if (res.success) {
        this.closeModal(CHANGE_PASSWORD);
        this.openModal(LOGIN);
        NotificationManager.success(PASSWORD_SUCCESSFULLY_CHANGED, '', LONG);
      }
      else {
        NotificationManager.error(NOT_FOUND, '', LONG);
      }
      // this.captcha.reset();
    });
  }

  handleSubmitRecoveryToken() {
    requester.sendRecoveryToken([`token=${this.state.recoveryToken}`]).then(res => {
      if (res.success) {
        this.closeModal(ENTER_RECOVERY_TOKEN);
        this.openModal(CHANGE_PASSWORD);
      }
      else {
        NotificationManager.warning(INVALID_SECURITY_CODE, '', LONG);
      }
    });
  }

  handleSubmitRecoveryEmail(token) {
    const email = { email: this.state.recoveryEmail };

    requester.sendRecoveryEmail(email, token).then(res => {
      if (res.success) {
        this.closeModal(SEND_RECOVERY_EMAIL);
        this.openModal(ENTER_RECOVERY_TOKEN);
      }
      else {
        NotificationManager.warning(INVALID_EMAIL, '', LONG);
      }
    });
  }

  handleConfirmWallet(token) {
    if (this.state.isUpdatingWallet) {
      this.handleLogin(token);
    } else {
      this.setState({
        confirmedRegistration: true,
      });
      this.handleRegister(token);
    }
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

  handleUpdateCountry() {
    if (this.state.country) {
      if (['Canada', 'India', 'United States of America'].includes(this.state.country.name) && !this.state.countryState) {
        NotificationManager.error('Please select a valid state.', '', LONG);
        return;
      }
      this.closeModal(UPDATE_COUNTRY);
      this.handleLogin();

    } else {
      NotificationManager.error('Please select a valid country.', '', LONG);
    }
  }

  executeReCaptcha(currentReCaptcha) {
    this.setState({
      currentReCaptcha
    }, () => this.captcha.execute());
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

  getReCaptchaFunction(currentReCaptcha) {
    switch (currentReCaptcha) {
      case 'login':
        return this.handleLogin;
      case 'recoveryEmail':
        return this.handleSubmitRecoveryEmail;
      case 'confirmWallet':
        return this.handleConfirmWallet;
      case 'changePassword':
        return this.handlePasswordChange;
      default:
        return null;
    }
  }

  render() {
    const { currentReCaptcha } = this.state;
    return (
      <nav id="main-nav" className="navbar">
        <div style={{ background: 'rgba(255,255,255, 0.8)' }}>
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
          <CreateWalletModal setUserInfo={this.setUserInfo} userToken={this.state.userToken} userName={this.state.userName} walletPassword={this.state.walletPassword} repeatWalletPassword={this.state.repeatWalletPassword} isActive={this.props.modalsInfo.isActive[CREATE_WALLET]} openModal={this.openModal} closeModal={this.closeModal} onChange={this.onChange} />
          <SaveWalletModal setUserInfo={this.setUserInfo} userToken={this.state.userToken} userName={this.state.userName} isActive={this.props.modalsInfo.isActive[SAVE_WALLET]} openModal={this.openModal} closeModal={this.closeModal} onChange={this.onChange} />
          <ConfirmWalletModal isActive={this.props.modalsInfo.isActive[CONFIRM_WALLET]} openModal={this.openModal} closeModal={this.closeModal} handleMnemonicWordsChange={this.handleMnemonicWordsChange} mnemonicWords={this.state.mnemonicWords} handleConfirmWallet={() => this.executeReCaptcha('confirmWallet')} confirmedRegistration={this.state.confirmedRegistration} />
          <SendRecoveryEmailModal isActive={this.props.modalsInfo.isActive[SEND_RECOVERY_EMAIL]} openModal={this.openModal} closeModal={this.closeModal} recoveryEmail={this.state.recoveryEmail} handleSubmitRecoveryEmail={() => this.executeReCaptcha('recoveryEmail')} onChange={this.onChange} />
          <EnterRecoveryTokenModal isActive={this.props.modalsInfo.isActive[ENTER_RECOVERY_TOKEN]} openModal={this.openModal} closeModal={this.closeModal} onChange={this.onChange} recoveryToken={this.state.recoveryToken} handleSubmitRecoveryToken={this.handleSubmitRecoveryToken} />
          <ChangePasswordModal isActive={this.props.modalsInfo.isActive[CHANGE_PASSWORD]} openModal={this.openModal} closeModal={this.closeModal} newPassword={this.state.newPassword} confirmNewPassword={this.state.confirmNewPassword} onChange={this.onChange} handlePasswordChange={() => this.executeReCaptcha('changePassword')} />
          <LoginModal isActive={this.props.modalsInfo.isActive[LOGIN]} openModal={this.openModal} closeModal={this.closeModal} loginEmail={this.state.loginEmail} loginPassword={this.state.loginPassword} onChange={this.onChange} handleLogin={this.handleLogin} />
          <AirdropLoginModal isActive={this.props.modalsInfo.isActive[AIRDROP_LOGIN]} openModal={this.openModal} closeModal={this.closeModal} loginEmail={this.state.loginEmail} loginPassword={this.state.loginPassword} onChange={this.onChange} handleLogin={this.handleAirdropLogin} />
          <RegisterModal isActive={this.props.modalsInfo.isActive[REGISTER]} openModal={this.openModal} closeModal={this.closeModal} signUpEmail={this.state.signUpEmail} signUpFirstName={this.state.signUpFirstName} signUpLastName={this.state.signUpLastName} signUpPassword={this.state.signUpPassword} countries={this.state.countries} country={this.state.country} onChange={this.onChange} handleChangeCountry={this.handleChangeCountry} />
          <AirdropRegisterModal isActive={this.props.modalsInfo.isActive[AIRDROP_REGISTER]} openModal={this.openModal} closeModal={this.closeModal} signUpEmail={this.state.signUpEmail} signUpFirstName={this.state.signUpFirstName} signUpLastName={this.state.signUpLastName} signUpPassword={this.state.signUpPassword} onChange={this.onChange} />
          <UpdateCountryModal isActive={this.props.modalsInfo.isActive[UPDATE_COUNTRY]} openModal={this.openModal} closeModal={this.closeModal} onChange={this.onChange} country={this.state.country} countries={this.state.countries} states={this.state.states} countryState={this.state.countryState} handleUpdateCountry={this.handleUpdateCountry} handleChangeCountry={this.handleChangeCountry} />
          <EmailVerificationModal isActive={this.props.modalsInfo.isActive[EMAIL_VERIFICATION]} openModal={this.openModal} closeModal={this.closeModal} onChange={this.onChange} requestVerificationEmail={this.requestVerificationEmail} />
          <EnterEmailVerificationTokenModal isActive={this.props.modalsInfo.isActive[ENTER_EMAIL_VERIFICATION_SECURITY_TOKEN]} openModal={this.openModal} closeModal={this.closeModal} onChange={this.onChange} handleLogin={this.handleLogin} emailVerificationToken={this.state.emailVerificationToken} />

          <Navbar>
            <Navbar.Header>
              <Navbar.Brand>
                <Link className="navbar-brand" to="/">
                  <img src={Config.getValue('basePath') + 'images/locktrip_logo.svg'} alt='logo' />
                </Link>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>

            <Navbar.Collapse>
              {localStorage[Config.getValue('domainPrefix') + '.auth.locktrip']
                ? <Nav>
                  <NavItem componentClass={Link} href="/profile/reservations" to="/profile/reservations">Hosting</NavItem>
                  <NavItem componentClass={Link} href="/profile/trips" to="/profile/trips">Traveling</NavItem>
                  <NavItem componentClass={Link} href="/profile/wallet" to="/profile/wallet">Wallet</NavItem>
                  <NavItem componentClass={Link} href="/profile/messages" to="/profile/messages">
                    <div className={(this.state.unreadMessages === 0 ? 'not ' : '') + 'unread-messages-box'}>
                      {this.state.unreadMessages > 0 && <span className="bold unread" style={{ right: this.state.unreadMessages.toString().split('').length === 2 ? '2px' : '4px' }}>{this.state.unreadMessages}</span>}
                    </div>
                  </NavItem>
                  <NavDropdown title={localStorage[Config.getValue('domainPrefix') + '.auth.username']} id="main-nav-dropdown">
                    <MenuItem componentClass={Link} href="/profile/dashboard" to="/profile/dashboard">Dashboard</MenuItem>
                    <MenuItem componentClass={Link} href="/profile/listings" to="/profile/listings">My Listings</MenuItem>
                    <MenuItem componentClass={Link} href="/profile/trips" to="/profile/trips">My Trips</MenuItem>
                    <MenuItem componentClass={Link} href="/profile/reservations" to="/profile/reservations">My Guests</MenuItem>
                    <MenuItem componentClass={Link} href="/profile/me/edit" to="/profile/me/edit">Profile</MenuItem>
                    <MenuItem componentClass={Link} href="/airdrop" to="/airdrop">Airdrop</MenuItem>
                    <MenuItem componentClass={Link} href="/" to="/" onClick={this.logout}>Logout</MenuItem>
                  </NavDropdown>
                </Nav>
                : <Nav pullRight={true}>
                  <NavItem componentClass={Link} to="/login" onClick={() => this.openModal(LOGIN)}>Login</NavItem>
                  <NavItem componentClass={Link} to="/signup" onClick={() => { this.openModal(REGISTER); this.requestCountries(); }}>Register</NavItem>
                </Nav>
              }
            </Navbar.Collapse>
          </Navbar>
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
