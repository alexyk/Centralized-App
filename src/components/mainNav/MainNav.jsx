import '../../styles/css/components/captcha/captcha-container.css';

import {
  AIRDROP_LOGIN,
  AIRDROP_REGISTER,
  CHANGE_PASSWORD,
  CONFIRM_WALLET,
  CREATE_WALLET,
  ENTER_RECOVERY_TOKEN,
  LOGIN,
  REGISTER,
  SAVE_WALLET,
  SEND_RECOVERY_EMAIL
} from '../../constants/modals.js';
import {
  INVALID_EMAIL,
  INVALID_PASSWORD,
  INVALID_TOKEN,
  PASSWORDS_DONT_MATCH,
  PROFILE_PASSWORD_REQUIREMENTS
} from '../../constants/warningMessages';
import { Link, withRouter } from 'react-router-dom';
import { MenuItem, Nav, NavDropdown, NavItem, Navbar } from 'react-bootstrap/lib';
import { PASSWORD_SUCCESSFULLY_CHANGED, PROFILE_SUCCESSFULLY_CREATED } from '../../constants/successMessages.js';
import { closeModal, openModal } from '../../actions/modalsInfo';
import { setIsLogged, setUserInfo } from '../../actions/userInfo';

import AirdropLoginModal from '../profile/airdrop/AirdropLoginModal';
import AirdropRegisterModal from '../profile/airdrop/AirdropRegisterModal';
import ChangePasswordModal from './modals/ChangePasswordModal';
import { Config } from '../../config';
import ConfirmWalletModal from './modals/ConfirmWalletModal';
import CreateWalletModal from './modals/CreateWalletModal';
import EnterRecoveryTokenModal from './modals/EnterRecoveryTokenModal';
import LoginModal from './modals/LoginModal';
import { NOT_FOUND } from '../../constants/errorMessages';
import { NotificationManager } from 'react-notifications';
import PropTypes from 'prop-types';
import ReCAPTCHA from 'react-google-recaptcha';
import React from 'react';
import RegisterModal from './modals/RegisterModal';
import SaveWalletModal from './modals/SaveWalletModal';
import SendRecoveryEmailModal from './modals/SendRecoveryEmailModal';
import { Wallet } from '../../services/blockchain/wallet.js';
import { connect } from 'react-redux';
import requester from '../../initDependencies';
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
      walletPassword: '',
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

    this.messageListener = this.messageListener.bind(this);
    this.getCountOfMessages = this.getCountOfMessages.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleMnemonicWordsChange = this.handleMnemonicWordsChange.bind(this);
    this.handleSubmitRecoveryToken = this.handleSubmitRecoveryToken.bind(this);
    this.handleSubmitRecoveryEmail = this.handleSubmitRecoveryEmail.bind(this);
    this.handleConfirmWallet = this.handleConfirmWallet.bind(this);

    this.executeReCaptcha = this.executeReCaptcha.bind(this);
    // this.executeLoginCaptcha = this.executeLoginCaptcha.bind(this);
    // this.executeChangePasswordCaptcha = this.executeChangePasswordCaptcha.bind(this);
    // this.executeSendRecoveryEmailCaptcha = this.executeSendRecoveryEmailCaptcha.bind(this);
    // this.executeConfirmWalletCaptcha = this.executeConfirmWalletCaptcha.bind(this);
    this.getReCaptchaFunction = this.getReCaptchaFunction.bind(this);
  }

  componentDidMount() {
    // if localStorage data shows that user is logged in, then setIsLogged(true) in Redux
    if (
      localStorage[Config.getValue('domainPrefix') + '.auth.locktrip'] &&
      localStorage[Config.getValue('domainPrefix') + '.auth.username']
    ) {
      this.setUserInfo();
    }

    const search = this.props.location.search;
    const searchParams = search.split('=');
    if (searchParams[0] === '?token') {
      this.openModal(ENTER_RECOVERY_TOKEN);
      // this.setState({
      //   recoveryToken: searchParams[1],
      //   enterRecoveryToken: true,
      // });
    }


    this.messageListener();
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
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
      locAddress: localStorage.walletAddress,
      jsonFile: localStorage.walletJson,
      image: Config.getValue('basePath') + 'images/default.png'
    };

    this.clearLocalStorage();

    requester.register(user, captchaToken).then(res => {
      if (res.success) {
        this.closeModal(CONFIRM_WALLET);
        this.setState({
          confirmedRegistration: false,
        });
        this.openModal(LOGIN);
        NotificationManager.success(PROFILE_SUCCESSFULLY_CREATED);
        // this.captcha.reset();
      }
      else {
        res.errors.then(res => {
          const errors = res;
          for (let key in errors) {
            if (typeof errors[key] !== 'function') {
              NotificationManager.warning(errors[key].message, 'Field: ' + key.toUpperCase());
            }
          }
          // this.captcha.reset();
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
        NotificationManager.success(PROFILE_SUCCESSFULLY_CREATED);
      }
      else {
        res.errors.then(res => {
          const errors = res;
          for (let key in errors) {
            if (typeof errors[key] !== 'function') {
              NotificationManager.warning(errors[key].message, 'Field: ' + key.toUpperCase());
            }
          }
        });
      }
    });
  }

  handleLogin(captchaToken) {
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
          this.closeModal(LOGIN);

          if (this.props.location.pathname.indexOf('/airdrop') !== -1) {
            this.handleAirdropUser();
          }
          // this.captcha.reset();
        });
      } else {
        res.errors.then(res => {
          const errors = res;
          console.log(errors);
          if (errors.hasOwnProperty('JsonFileNull')) {
            NotificationManager.warning(errors['JsonFileNull'].message);
            this.setState({ isUpdatingWallet: true }, () => {
              this.closeModal(LOGIN);
              this.openModal(CREATE_WALLET);
            });
          } else {
            for (let key in errors) {
              if (typeof errors[key] !== 'function') {
                console.log(key);
                console.log(errors[key]);
                NotificationManager.warning(errors[key].message);
              }
            }
          }
          // this.captcha.reset();
        }).catch(errors => {
          for (var e in errors) {
            NotificationManager.warning(errors[e].message);
          }
          // this.captcha.reset();
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
          console.log(errors);
          if (errors.hasOwnProperty('JsonFileNull')) {
            NotificationManager.warning(errors['JsonFileNull'].message);
            this.setState({ isUpdatingWallet: true }, () => {
              this.closeModal(AIRDROP_LOGIN);
              this.openModal(CREATE_WALLET);
            });
          } else {
            for (let key in errors) {
              if (typeof errors[key] !== 'function') {
                NotificationManager.warning(errors[key].message);
              }
            }
          }
        }).catch(errors => {
          for (var e in errors) {
            NotificationManager.warning(errors[e].message);
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
          console.log('user not yet moved from temp to main');
          const token = this.props.location.search.split('=')[1];
          requester.checkIfAirdropUserExists(token).then(res => {
            res.body.then(user => {
              const currentEmail = localStorage[Config.getValue('domainPrefix') + '.auth.username'];
              if (user.email === currentEmail && user.exists) {
                console.log('users match');
                requester.verifyUserAirdropInfo(token).then(() => {
                  console.log('user moved from temp to main');
                  NotificationManager.info('Verification email has been sent. Please follow the link to confirm your email.');
                  requester.getUserAirdropInfo().then(res => {
                    res.body.then(data => {
                      this.dispatchAirdropInfo(data);
                    });
                  });
                });
              } else {
                console.log('users dont match', user.email, currentEmail);
              }
            });
          });
        }
      }).catch(() => {
        NotificationManager.warning('No airdrop information about this profile');
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
    console.log('user info dispatched');
  }

  clearLocalStorage() {
    localStorage['walletAddress'] = '';
    localStorage['walletMnemonic'] = '';
    localStorage['walletJson'] = '';
  }

  setUserInfo() {
    requester.getUserInfo().then(res => {
      res.body.then(data => {
        Wallet.getBalance(data.locAddress).then(eth => {
          const ethBalance = eth / (Math.pow(10, 18));
          Wallet.getTokenBalance(data.locAddress).then(loc => {
            const locBalance = loc / (Math.pow(10, 18));
            const { firstName, lastName, phoneNumber, email, locAddress } = data;
            this.props.dispatch(setIsLogged(true));
            this.props.dispatch(setUserInfo(firstName, lastName, phoneNumber, email, locAddress, ethBalance, locBalance));
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

    this.props.dispatch(closeModal(modal));
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
      NotificationManager.warning(PASSWORDS_DONT_MATCH);
      return;
    }

    if (password.length < 6 || password.length > 30) {
      NotificationManager.warning(INVALID_PASSWORD);
      return;
    }

    if (!password.match('^([^\\s]*[a-zA-Z]+.*?[0-9]+[^\\s]*|[^\\s]*[0-9]+.*?[a-zA-Z]+[^\\s]*)$')) {
      NotificationManager.warning(PROFILE_PASSWORD_REQUIREMENTS);
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
        NotificationManager.success(PASSWORD_SUCCESSFULLY_CHANGED);
      }
      else {
        NotificationManager.error(NOT_FOUND);
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
        NotificationManager.warning(INVALID_TOKEN);
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
        NotificationManager.warning(INVALID_EMAIL);
      }
      // this.captcha.reset();
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

  executeReCaptcha(currentReCaptcha) {
    this.setState({
      currentReCaptcha
    }, () => this.captcha.execute());
  }

  // executeChangePasswordCaptcha() {
  //   this.changePasswordCaptcha.execute();
  // }

  // executeSendRecoveryEmailCaptcha() {
  //   this.sendRecoveryEmailCaptcha.execute();
  // }

  // executeConfirmWalletCaptcha() {
  //   this.confirmWalletCaptcha.execute();
  // }

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
            {/* <ReCAPTCHA
              ref={el => this.loginCaptcha = el}
              size="invisible"
              sitekey={Config.getValue('recaptchaKey')}
              onChange={(token) => { this.handleLogin(token); this.loginCaptcha.reset(); }}
            />
            <ReCAPTCHA
              ref={el => this.changePasswordCaptcha = el}
              size="invisible"
              sitekey={Config.getValue('recaptchaKey')}
              onChange={(token) => { this.handlePasswordChange(token); this.changePasswordCaptcha.reset(); }}
            />
            <ReCAPTCHA
              ref={el => this.sendRecoveryEmailCaptcha = el}
              size="invisible"
              sitekey={Config.getValue('recaptchaKey')}
              onChange={token => { this.handleSubmitRecoveryEmail(token); this.sendRecoveryEmailCaptcha.reset(); }}
            />
            <ReCAPTCHA
              ref={el => this.confirmWalletCaptcha = el}
              size="invisible"
              sitekey={Config.getValue('recaptchaKey')}
              onChange={(token) => { this.handleConfirmWallet(token); this.confirmWalletCaptcha.reset(); }}
            /> */}
          </div>
          <CreateWalletModal setUserInfo={this.setUserInfo} userToken={this.state.userToken} userName={this.state.userName} walletPassword={this.state.walletPassword} isActive={this.props.modalsInfo.modals.get(CREATE_WALLET)} openModal={this.openModal} closeModal={this.closeModal} onChange={this.onChange} />
          <SaveWalletModal setUserInfo={this.setUserInfo} userToken={this.state.userToken} userName={this.state.userName} isActive={this.props.modalsInfo.modals.get(SAVE_WALLET)} openModal={this.openModal} closeModal={this.closeModal} onChange={this.onChange} />
          <ConfirmWalletModal isActive={this.props.modalsInfo.modals.get(CONFIRM_WALLET)} openModal={this.openModal} closeModal={this.closeModal} handleMnemonicWordsChange={this.handleMnemonicWordsChange} mnemonicWords={this.state.mnemonicWords} handleConfirmWallet={() => this.executeReCaptcha('confirmWallet')} confirmedRegistration={this.state.confirmedRegistration} />
          <SendRecoveryEmailModal isActive={this.props.modalsInfo.modals.get(SEND_RECOVERY_EMAIL)} openModal={this.openModal} closeModal={this.closeModal} recoveryEmail={this.state.recoveryEmail} handleSubmitRecoveryEmail={() => this.executeReCaptcha('recoveryEmail')} onChange={this.onChange} />
          <EnterRecoveryTokenModal isActive={this.props.modalsInfo.modals.get(ENTER_RECOVERY_TOKEN)} openModal={this.openModal} closeModal={this.closeModal} onChange={this.onChange} recoveryToken={this.state.recoveryToken} handleSubmitRecoveryToken={this.handleSubmitRecoveryToken} />
          <ChangePasswordModal isActive={this.props.modalsInfo.modals.get(CHANGE_PASSWORD)} openModal={this.openModal} closeModal={this.closeModal} newPassword={this.state.newPassword} confirmNewPassword={this.state.confirmNewPassword} onChange={this.onChange} handlePasswordChange={() => this.executeReCaptcha('changePassword')} />
          <LoginModal isActive={this.props.modalsInfo.modals.get(LOGIN)} openModal={this.openModal} closeModal={this.closeModal} loginEmail={this.state.loginEmail} loginPassword={this.state.loginPassword} onChange={this.onChange} handleLogin={() => this.executeReCaptcha('login')} />
          <AirdropLoginModal isActive={this.props.modalsInfo.modals.get(AIRDROP_LOGIN)} openModal={this.openModal} closeModal={this.closeModal} loginEmail={this.state.loginEmail} loginPassword={this.state.loginPassword} onChange={this.onChange} handleLogin={this.handleAirdropLogin} />
          <RegisterModal isActive={this.props.modalsInfo.modals.get(REGISTER)} openModal={this.openModal} closeModal={this.closeModal} signUpEmail={this.state.signUpEmail} signUpFirstName={this.state.signUpFirstName} signUpLastName={this.state.signUpLastName} signUpPassword={this.state.signUpPassword} onChange={this.onChange} />
          <AirdropRegisterModal isActive={this.props.modalsInfo.modals.get(AIRDROP_REGISTER)} openModal={this.openModal} closeModal={this.closeModal} signUpEmail={this.state.signUpEmail} signUpFirstName={this.state.signUpFirstName} signUpLastName={this.state.signUpLastName} signUpPassword={this.state.signUpPassword} onChange={this.onChange} />

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
                  <NavItem componentClass={Link} to="/signup" onClick={() => this.openModal(REGISTER)}>Register</NavItem>
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