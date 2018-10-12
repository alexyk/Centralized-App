import 'react-notifications/lib/notifications.css';
import '../../../styles/css/components/profile/wallet/wallet-index-page.css';
import { CREATE_WALLET } from '../../../constants/modals.js';
import { Config } from '../../../config';
import { LONG } from '../../../constants/notificationDisplayTimes.js';
import { NotificationManager } from 'react-notifications';
import { PROCESSING_TRANSACTION } from '../../../constants/infoMessages.js';
import PropTypes from 'prop-types';
import React from 'react';
import { TRANSACTION_SUCCESSFUL } from '../../../constants/successMessages.js';
import { TokenTransactions } from '../../../services/blockchain/tokenTransactions';
import { connect } from 'react-redux';
import { closeModal, openModal } from '../../../actions/modalsInfo';
import NoEntriesMessage from '../../common/messages/NoEntriesMessage';
import requester from '../../../initDependencies';

class WalletIndexPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canProceed: false,
      recipientAddress: '',
      locAmount: 0,
      password: ''
    };

    this.onChange = this.onChange.bind(this);
    this.sendTokens = this.sendTokens.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value }, () => {
      this.setState({ canProceed: this.props.userInfo.locAddress !== null && this.state.password !== '' && this.state.recipientAddress !== '' && this.state.locAmount > 0 });
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

  tokensToWei(tokens) {
    let index = tokens.indexOf('.');
    let trailingZeroes = 0;
    let wei = '';
    if (index === -1) {
      trailingZeroes = 18;
    } else {
      trailingZeroes = 18 - (tokens.length - 1 - index);
    }

    wei = tokens.replace(/[.,]/g, '');
    if (trailingZeroes >= 0) {
      wei = wei + '0'.repeat(trailingZeroes);
    } else {
      wei = wei.substring(0, index + 18);
    }

    return wei;
  }

  sendTokens() {
    // console.log('amount : ' + this.state.locAmount * Math.pow(10, 18));
    this.setState({ loading: true });
    NotificationManager.info(PROCESSING_TRANSACTION, 'Transactions', LONG);
    const wei = (this.tokensToWei(this.state.locAmount.toString()));
    requester.getMyJsonFile().then(res => res.body).then(data => {
      const { jsonFile } = data;
      TokenTransactions.sendTokens(
        jsonFile,
        this.state.password,
        this.state.recipientAddress,
        wei.toString()
      ).then(() => {
        NotificationManager.success(TRANSACTION_SUCCESSFUL, 'Send Tokens', LONG);
        this.setState({
          recipientAddress: '',
          locAmount: 0,
          password: '',
          loading: false
        });
      }).catch(error => {
        if (error.hasOwnProperty('message')) {
          NotificationManager.warning(error.message, 'Send Tokens', LONG);
        } else if (error.hasOwnProperty('err') && error.err.hasOwnProperty('message')) {
          NotificationManager.warning(error.err.message, 'Send Tokens', LONG);
        } else if (typeof error === 'string') {
          NotificationManager.warning(error, 'Send Tokens', LONG);
        } else {
          // console.log(error);
        }

        this.setState({ loading: false });
      });
    });
  }

  render() {
    const { email, locAddress, locBalance, ethBalance } = this.props.userInfo;
    if (!email) {
      return null;
    } else if (!locAddress) {
      return (
        <div className='container'>
          <NoEntriesMessage text='You need to create a wallet first'>
            <a href="" className="btn" onClick={(e) => this.openModal(CREATE_WALLET, e)} style={{ minWidth: '200px' }}>Create Wallet</a>
          </NoEntriesMessage>
        </div>
      );
    }

    const etherscanUrl = `https://etherscan.io/address/${locAddress}#tokentxns`;

    return (
      <div>
        <section id="wallet-index">
          <div className="container">
            <div className="after-header" />
            <div id="profile-edit-form">
              <h2>Your Wallet</h2>
              <div className="loc-address">
                <label htmlFor="loc-address">Your ETH/LOC address <img src={Config.getValue('basePath') + 'images/icon-lock.png'} className="lock" alt="lock-o" /></label>
                <input className="disable-input" id="loc-address" name="locAddress" value={locAddress} type="text" readOnly />
              </div>
              <div className="loc-balance">
                <label htmlFor="loc-balance">LOC Balance</label>
                <input className="disable-input" id="loc-balance" name="locBalance" value={locBalance} type="text" readOnly />
              </div>
              <div className="eth-balance">
                <label htmlFor="eth-balance">ETH Balance</label>
                <input className="disable-input" id="eth-balance" name="ethBalance" value={ethBalance} type="text" readOnly />
              </div>
              <h2>Send Tokens</h2>
              <form onSubmit={(e) => { e.preventDefault(); this.sendTokens(); }}>
                <div className="loc-address">
                  <label htmlFor="recipient-loc-address">Recipient ETH/LOC address</label>
                  <input id="recipient-loc-address" name="recipientAddress" onChange={this.onChange} value={this.state.recipientAddress} type="text" placeholder="Valid ERC-20 compliant wallet address" />
                </div>
                <div className="name">
                  <label htmlFor="loc-amount">Send LOC Amount</label>
                  <input id="loc-amount" name="locAmount" onChange={this.onChange} type="number" value={this.state.locAmount} placeholder="0.000" />
                </div>
                <div className="name">
                  <label htmlFor="password">Your wallet password</label>
                  <input id="password" name="password" onChange={this.onChange} type="password" value={this.state.password} placeholder="The password is needed to unlock your wallet for a single transaction" />
                </div>
                <div>
                  {this.state.canProceed ? <button className="btn btn-primary" type="submit">Send Tokens</button> : <button className="btn btn-primary" disabled="disabled">Send Tokens</button>}
                  &nbsp; &nbsp;
                    <div className="button-wallet-link"><a href={etherscanUrl} target="_blank" className="wallet-link">Check your transactions</a></div>
                </div>
              </form>
            </div>
          </div>
          <div className="before-footer clear-both" />
        </section>
      </div>
    );
  }
}

WalletIndexPage.propTypes = {
  // Redux props
  dispatch: PropTypes.func,
  userInfo: PropTypes.object
};

const mapStateToProps = (state) => ({
  userInfo: state.userInfo
});

export default connect(mapStateToProps)(WalletIndexPage);
