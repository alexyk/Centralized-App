import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import PropTypes from 'prop-types';
import ethers from 'ethers';
import requester from '../../../requester';
import moment from 'moment';
import RecoverWalletByMnemonicWordsModal from '../modals/RecoverWalletByMnemonicWordsModal';
import ChangeWalletPasswordModal from '../modals/ChangeWalletPasswordModal';
import { RECOVER_WALLET, CHANGE_WALLET_PASSWORD, PASSWORD_PROMPT } from '../../../constants/modals.js';
import { closeModal, openModal } from '../../../actions/modalsInfo.js';
import { LONG } from '../../../constants/notificationDisplayTimes.js';
import { PASSWORD_SUCCESSFULLY_CHANGED } from '../../../constants/successMessages';

class RecoverWallerPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mnemonicWords: '',
      walletPassword: '',
      repeatWalletPassword: '',
      userInfo: null,
      wallet: null,
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onChange = this.onChange.bind(this);
    this.recoverPassword = this.recoverPassword.bind(this);
    this.updateWalletJson = this.updateWalletJson.bind(this);
  }

  componentDidMount() {
    requester.getUserInfo().then(res => {
      res.body.then(data => {
        if (data.birthday !== null) {
          let birthday = moment(data.birthday).utc();
          const day = birthday.add(1, 'days').format('D');
          const month = birthday.format('MM');
          const year = birthday.format('YYYY');
          data.birthday = `${day}/${month}/${year}`;
        }
        if (data.country) {
          data.country = data.country.id;
        }
        if (data.preferredCurrency) {
          data.preferredCurrency = data.preferredCurrency.id;
        }
        this.setState({
          userInfo: data
        });
      });
    });
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

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  recoverPassword() {
    let wallet;
    try {
      wallet = ethers.Wallet.fromMnemonic(this.state.mnemonicWords);

      if (!wallet || wallet.address !== this.state.userInfo.locAddress) {
        NotificationManager.warning('Wrong mnemonic words', '', LONG);
      } else {
        this.setState({
          wallet
        });
        this.closeModal(RECOVER_WALLET);
        this.openModal(CHANGE_WALLET_PASSWORD);
      }
    }
    catch (err) {
      NotificationManager.warning('Wrong mnemonic words', '', LONG);
    }
  }

  updateWalletJson() {
    if (this.state.wallet) {
      this.state.wallet.encrypt(this.state.walletPassword)
        .then(json => {
          let { userInfo } = this.state;
          userInfo.jsonFile = json;
          requester.updateUserInfo(userInfo)
            .then((res) => {
              if (res.success) {
                res.body
                  .then(() => {
                    NotificationManager.success(PASSWORD_SUCCESSFULLY_CHANGED, '', LONG);
                    this.closeModal(CHANGE_WALLET_PASSWORD);
                    this.openModal(PASSWORD_PROMPT);
                  });
              } else {
                res.errors
                  .then((err) => {
                    this.closeModal(CHANGE_WALLET_PASSWORD);
                    NotificationManager.warning(err.message, '', LONG);
                  });
              }
            });
        });
    }
  }

  render() {
    return (
      <Fragment>
        <RecoverWalletByMnemonicWordsModal
          isActive={this.props.modalsInfo.isActive[RECOVER_WALLET]}
          openModal={this.openModal}
          closeModal={this.closeModal}
          onChange={this.onChange}
          mnemonicWords={this.state.mnemonicWords}
          recoverPassword={this.recoverPassword}
        />
        <ChangeWalletPasswordModal
          isActive={this.props.modalsInfo.isActive[CHANGE_WALLET_PASSWORD]}
          openModal={this.openModal}
          closeModal={this.closeModal}
          onChange={this.onChange}
          walletPassword={this.state.walletPassword}
          repeatWalletPassword={this.state.repeatWalletPassword}
          updateWalletJson={this.updateWalletJson}
        />
      </Fragment>
    );
  }
}

RecoverWallerPassword.propTypes = {
  // start Redux props
  dispatch: PropTypes.func,
  modalsInfo: PropTypes.object,
};

function mapStateToProps(state) {
  const { modalsInfo } = state;
  return {
    modalsInfo
  };
}

export default connect(mapStateToProps)(RecoverWallerPassword);