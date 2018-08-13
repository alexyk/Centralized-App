import React from 'react';
import PropTypes from 'prop-types';

import 'react-notifications/lib/notifications.css';

import { NotificationManager } from 'react-notifications';
import requester from '../../../initDependencies';
import { connect } from 'react-redux';

import { Config } from '../../../config';
import { TokenTransactions } from '../../../services/blockchain/tokenTransactions';

import '../../../styles/css/components/profile/wallet/wallet-index-page.css';

import { PROCESSING_TRANSACTION } from '../../../constants/infoMessages.js';
import { TRANSACTION_SUCCESSFUL } from '../../../constants/successMessages.js';
import { LONG } from '../../../constants/notificationDisplayTimes.js';

class WalletIndexPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jsonFile: null,
      locAddress: null,
      canProceed: false,
      recipientAddress: '',
      locAmount: 0,
      password: ''
    };
    this.onChange = this.onChange.bind(this);
    this.sendTokens = this.sendTokens.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value }, () => {
      this.setState({ canProceed: this.state.locAddress !== null && this.state.password !== '' && this.state.recipientAddress !== '' && this.state.locAmount > 0 });
    });
  }

  sendTokens() {
    // console.log('amount : ' + this.state.locAmount * Math.pow(10, 18));
    NotificationManager.info(PROCESSING_TRANSACTION, 'Transactions', LONG);
    setTimeout(() => {
      TokenTransactions.sendTokens(
        this.state.jsonFile,
        this.state.password,
        this.state.recipientAddress,
        (this.state.locAmount * Math.pow(10, 18)).toString()
      ).then(() => {
        NotificationManager.success(TRANSACTION_SUCCESSFUL, 'Send Tokens', LONG);
        this.setState({
          recipientAddress: '',
          locAmount: 0,
          password: ''
        });
        // console.log(x);
      }).catch(x => {
        if (x.hasOwnProperty('message')) {
          NotificationManager.warning(x.message, 'Send Tokens');
        } else if (x.hasOwnProperty('err') && x.err.hasOwnProperty('message')) {
          NotificationManager.warning(x.err.message, 'Send Tokens');
        } else if (typeof x === 'string') {
          NotificationManager.warning(x, 'Send Tokens');
        } else {
          console.log(x);
        }
      });
    }, 1000);
  }

  componentDidMount() {
    requester.getUserInfo().then(res => {
      res.body.then(data => {
        this.setState({ locAddress: data.locAddress }, () => {
          requester.getMyJsonFile().then(res => {
            res.body.then(data => {
              this.setState({ jsonFile: data.jsonFile });
            });
          });
        });
      });
    });
  }

  render() {
    if (!this.state.locAddress) {
      return <div className="loader"></div>;
    }
    const etherscanUrl = `https://etherscan.io/address/${this.state.locAddress}#tokentxns`;
    return (
      <div>
        <section id="wallet-index">
          <div className="container">
            <div className="after-header" />
            <div id="profile-edit-form">
              <h2>Your Wallet</h2>
              <div className="loc-address">
                <label htmlFor="loc-address">Your ETH/LOC address <img src={Config.getValue('basePath') + 'images/icon-lock.png'} className="lock" alt="lock-o" /></label>
                <input className="disable-input" id="loc-address" name="locAddress" value={this.state.locAddress} type="text" disabled="disabled" />
              </div>
              <div className="loc-balance">
                <label htmlFor="loc-balance">LOC Balance</label>
                <input className="disable-input" id="loc-balance" name="locBalance" value={this.props.userInfo.locBalance} type="text" disabled="disabled" />
              </div>
              <div className="eth-balance">
                <label htmlFor="eth-balance">ETH Balance</label>
                <input className="disable-input" id="eth-balance" name="ethBalance" value={this.props.userInfo.ethBalance} type="text" disabled="disabled" />
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
  userInfo: PropTypes.object
};

const mapStateToProps = (state) => ({
  userInfo: state.userInfo
});

export default connect(mapStateToProps)(WalletIndexPage);
