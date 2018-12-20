import React from 'react';
import requester from '../../requester';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import { LONG } from '../../constants/notificationDisplayTimes.js';
import { closeModal, openModal } from '../../actions/modalsInfo';
import { isActive } from '../../selectors/modalsInfo';
import { setUserInfo } from '../../actions/userInfo';
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
import { executeWithToken } from '../../services/grecaptcha/grecaptcha';

class WalletCreationManager extends React.Component {
  constructor(props) {
    super(props);

    this.createWalletCaptcha = React.createRef();

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
    requester.getUserInfo().then(res => {
      res.body.then(data => {
        if (data.locAddress) {
          Wallet.getBalance(data.locAddress).then(eth => {
            const ethBalance = eth / (Math.pow(10, 18));
            Wallet.getTokenBalance(data.locAddress).then(loc => {
              const locBalance = loc / (Math.pow(10, 18));
              const { locAddress } = data;
              this.props.dispatch(setUserInfo({ethBalance, locBalance, locAddress}));
            });
          });
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
        <CreateWalletModal 
          setUserInfo={this.setUserInfo} 
          userToken={this.state.userToken} 
          userName={this.state.userName} 
          walletPassword={this.state.walletPassword} 
          repeatWalletPassword={this.state.repeatWalletPassword} 
          isActive={this.props.isActive[CREATE_WALLET]}
          openModal={this.openModal} 
          closeModal={this.closeModal} 
          onChange={this.onChange} 
        />
        <SaveWalletModal 
          setUserInfo={this.setUserInfo} 
          userToken={this.state.userToken} 
          userName={this.state.userName} 
          isActive={this.props.isActive[SAVE_WALLET]}
          openModal={this.openModal} 
          closeModal={this.closeModal} 
          onChange={this.onChange} 
        />
        <ConfirmWalletModal 
          isActive={this.props.isActive[CONFIRM_WALLET]}
          openModal={this.openModal} 
          closeModal={this.closeModal} 
          handleMnemonicWordsChange={this.handleMnemonicWordsChange} 
          mnemonicWords={this.state.mnemonicWords} 
          handleCreateWallet={() => executeWithToken(this.handleCreateWallet)} 
          confirmedRegistration={this.state.confirmedRegistration} 
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
  isActive: PropTypes.object,
};

function mapStateToProps(state) {
  const { modalsInfo } = state;
  return {
    isActive: isActive(modalsInfo)
  };
}

export default withRouter(connect(mapStateToProps)(WalletCreationManager));
