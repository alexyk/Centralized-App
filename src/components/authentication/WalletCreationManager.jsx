import React from 'react';
import requester from '../../requester';
import { Config } from '../../config';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import { LONG } from '../../constants/notificationDisplayTimes.js';
import { closeModal, openModal } from '../../actions/modalsInfo';
import ReCAPTCHA from 'react-google-recaptcha';
import { setIsLogged, setUserInfo } from '../../actions/userInfo';
import { Wallet } from '../../services/blockchain/wallet.js';
import moment from 'moment';

import {
  CONFIRM_WALLET,
  CREATE_WALLET,
  SAVE_WALLET,
} from '../../constants/modals.js';

import ConfirmWalletModal from './modals/ConfirmWalletModal';
import CreateWalletModal from './modals/CreateWalletModal';

import SaveWalletModal from './modals/SaveWalletModal';

class WalletCreationManager extends React.Component {
  constructor(props) {
    super(props);

    this.captcha = null;

    this.state = {
      userName: '',
      walletPassword: '',
      repeatWalletPassword: '',
      mnemonicWords: '',
      userToken: '',
    };

    this.onChange = this.onChange.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleCreateWallet = this.handleCreateWallet.bind(this);
    this.handleMnemonicWordsChange = this.handleMnemonicWordsChange.bind(this);
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

  handleMnemonicWordsChange(e) {
    const value = e.target.value.replace(/\n/g, '');
    this.setState({ [e.target.name]: value });
  }

  closeModal(modal, e) {
    if (e) {
      e.preventDefault();
    }

    this.props.dispatch(closeModal(modal));
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

  handleCreateWallet(captchaToken) {
    requester.getUserInfo()
      .then(res => res.body)
      .then(userInfo => {
        if (userInfo.birthday) {
          let birthday = moment.utc(userInfo.birthday);
          const day = birthday.add(1, 'days').format('D');
          const month = birthday.format('MM');
          const year = birthday.format('YYYY');
          userInfo.birthday = `${day}/${month}/${year}`;
        }

        userInfo.countryState = userInfo.countryState && userInfo.countryState.id;
        userInfo.preferredCurrency = userInfo.preferredCurrency ? userInfo.preferredCurrency.id : 1;
        userInfo.country = userInfo.country && userInfo.country.id;
        userInfo.countryState = userInfo.countryState && parseInt(userInfo.countryState, 10);
        userInfo.locAddress = localStorage.walletAddress;
        userInfo.jsonFile = localStorage.walletJson;

        this.clearLocalStorage();

        requester.updateUserInfo(userInfo, captchaToken).then(res => {
          if (res.success) {
            NotificationManager.success('Successfully created your wallet.', '', LONG);
            this.setUserInfo();
          } else {
            res.errors.then(e => {
              NotificationManager.error(e.message, '', LONG);
            });
          }

          this.closeModal(CONFIRM_WALLET);
        });
      });
  }

  clearLocalStorage() {
    localStorage['walletAddress'] = '';
    localStorage['walletMnemonic'] = '';
    localStorage['walletJson'] = '';
  }

  render() {
    return (
      <React.Fragment>
        <CreateWalletModal setUserInfo={this.setUserInfo} userToken={this.state.userToken} userName={this.state.userName} walletPassword={this.state.walletPassword} repeatWalletPassword={this.state.repeatWalletPassword} isActive={this.props.modalsInfo.isActive[CREATE_WALLET]} openModal={this.openModal} closeModal={this.closeModal} onChange={this.onChange} />
        <SaveWalletModal setUserInfo={this.setUserInfo} userToken={this.state.userToken} userName={this.state.userName} isActive={this.props.modalsInfo.isActive[SAVE_WALLET]} openModal={this.openModal} closeModal={this.closeModal} onChange={this.onChange} />
        <ConfirmWalletModal isActive={this.props.modalsInfo.isActive[CONFIRM_WALLET]} openModal={this.openModal} closeModal={this.closeModal} handleMnemonicWordsChange={this.handleMnemonicWordsChange} mnemonicWords={this.state.mnemonicWords} handleCreateWallet={() => this.captcha.execute()} confirmedRegistration={this.state.confirmedRegistration} />
        <ReCAPTCHA
          ref={el => this.captcha = el}
          size="invisible"
          sitekey={Config.getValue('recaptchaKey')}
          onChange={(token) => {
            this.handleCreateWallet(token);
            this.captcha.reset();
          }}
        />
      </React.Fragment>
    );
  }
}

WalletCreationManager.propTypes = {
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

export default withRouter(connect(mapStateToProps)(WalletCreationManager));