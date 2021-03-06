import 'react-notifications/lib/notifications.css';
import '../../../styles/css/components/profile/wallet/wallet-index-page.css';
import { CREATE_WALLET, RECOVER_WALLET } from '../../../constants/modals.js';
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
import requester from '../../../requester';
import RecoverWallerPassword from '../../common/utility/RecoverWallerPassword';
import { getLocAddress, getEthBalance, getLocBalance, getEmail } from '../../../selectors/userInfo';

class WalletIndexPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canProceed: false,
      recipientAddress: '',
      locAmount: 0,
      password: '',
      latestTxHash: ''
    };

    this.onChange = this.onChange.bind(this);
    this.sendTokens = this.sendTokens.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value }, () => {
      this.setState({ canProceed: this.props.userLocAddress !== null && this.state.password !== '' && this.state.recipientAddress !== '' && this.state.locAmount > 0 });
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
      ).then((transaction) => {
        NotificationManager.success(TRANSACTION_SUCCESSFUL, 'Send Tokens', LONG);
        this.setState({
          recipientAddress: '',
          locAmount: 0,
          password: '',
          loading: false,
          canProceed: false,
          latestTxHash: transaction.hash
        });
      }).catch(error => {
        if (error.hasOwnProperty('message')) {
          NotificationManager.warning(error.message, 'Send Tokens', LONG);
        } else if (error.hasOwnProperty('err') && error.err.hasOwnProperty('message')) {
          NotificationManager.warning(error.err.message, 'Send Tokens', LONG);
        } else if (typeof error === 'string') {
          NotificationManager.warning(error, 'Send Tokens', LONG);
        } else {
        }

        this.setState({ loading: false });
      });
    });
  }

  render() {
    const { userEmail, userLocAddress, userLocBalance, userEthBalance } = this.props;

    if (!userEmail) {
      return null;
    } else if (!userLocAddress) {
      return (
        <div className='container'>
          <NoEntriesMessage text='You need to create a wallet first'>
            <a href="" className="button" onClick={(e) => this.openModal(CREATE_WALLET, e)} style={{ minWidth: '200px' }}>Create Wallet</a>
          </NoEntriesMessage>
        </div>
      );
    }

    const etherscanUrl = `https://etherscan.io/address/${userLocAddress}#tokentxns`;
    const etherscanLatestTxUrl = `${Config.getValue('ETHERS_HTTP_PROVIDER_NETWORK_BASE_URL')}/tx/${this.state.latestTxHash}`;

    return (
      <div className="container">
        <section id="wallet-index">
          <div id="profile-edit-form">
            <h2>Your Wallet</h2>
            <div onClick={() => this.openModal(RECOVER_WALLET)} className="wallet-link">Forgot your password?</div>
            <hr />
            <div className="loc-address">
              <label htmlFor="loc-address">Your ETH/LOC address <img src={Config.getValue('basePath') + 'images/icon-lock.png'} className="lock" alt="lock-o" /></label>
              <input className="disable-input" id="loc-address" name="locAddress" value={userLocAddress} type="text" readOnly />
            </div>
            <div className="loc-balance">
              <label htmlFor="loc-balance">LOC Balance</label>
              <input className="disable-input" id="loc-balance" name="locBalance" value={userLocBalance} type="text" readOnly />
            </div>
            <div className="eth-balance">
              <label htmlFor="eth-balance">ETH Balance</label>
              <input className="disable-input" id="eth-balance" name="ethBalance" value={userEthBalance} type="text" readOnly />
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
                {this.state.canProceed ? <button className="button" type="submit">Send Tokens</button> : <button className="button" disabled="disabled">Send Tokens</button>}
                <div className="button-wallet-link"><a href={etherscanUrl} target="_blank" rel="noopener noreferrer" className="wallet-link">Check your transactions</a></div>
                {this.state.latestTxHash && <div className="button-wallet-link"><a href={etherscanLatestTxUrl} target="_blank" rel="noopener noreferrer" className="wallet-link">Latest transaction status</a></div>}
              </div>
            </form>
          </div>
          <div className="before-footer clear-both" />
        </section>
        <RecoverWallerPassword/>
      </div>
    );
  }
}

WalletIndexPage.propTypes = {
  // Redux props
  dispatch: PropTypes.func,
  userLocBalance: PropTypes.number,
  userEthBalance: PropTypes.number,
  userLocAddress: PropTypes.string,
  userEmail: PropTypes.string
};

const mapStateToProps = (state) => {
  const { userInfo } = state;

  return {
    userLocBalance: getLocBalance(userInfo),
    userEthBalance: getEthBalance(userInfo),
    userLocAddress: getLocAddress(userInfo),
    userEmail: getEmail(userInfo)
  };
};

export default connect(mapStateToProps)(WalletIndexPage);
