import '../../../styles/css/components/profile/airdrop-page.css';

import {
  AIRDROP_LOGIN,
  AIRDROP_REGISTER,
  LOGIN
} from '../../../constants/modals.js';
import { COPIED_TO_CLIPBOARD, VERIFICATION_EMAIL_SENT, WITHDRAW_REQUEST_SUCCESSFUL } from '../../../constants/infoMessages.js';
import { EMAIL_VERIFIED, PROFILE_SUCCESSFULLY_UPDATED, VOTE_URL_SUCCESSFULLY_SAVED } from '../../../constants/successMessages.js';
import { INVALID_URL, SOCIAL_PROFILE_EMPTY } from '../../../constants/errorMessages.js';
import React, { Component } from 'react';
import { airdropModals, openModal } from '../../../actions/modalsInfo';

import { Config } from '../../../config';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { INVALID_SECURITY_CODE } from '../../../constants/warningMessages.js';
import { LONG } from '../../../constants/notificationDisplayTimes.js';
import NavProfile from '../NavProfile';
import NoEntriesMessage from '../common/NoEntriesMessage';
import { NotificationManager } from 'react-notifications';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import requester from '../../../initDependencies';
import { setAirdropInfo } from '../../../actions/airdropInfo';
import { setIsLogged } from '../../../actions/userInfo';
import validator from 'validator';
import { withRouter } from 'react-router-dom';

class AirdropPage extends Component {
  constructor(props) {
    super(props);

    this.transactionHashPollingInterval = null;

    this.state = {
      isUserLogged: false,
      isAirdropUser: false,
      isVoteUrlEdited: false,
      didPostUserInfo: false,
      loginEmail: '',
      loginPassword: '',
      token: '',
      voteUrl: '',
      userParticipates: false,
      loading: true,
      withdrawTransactionHash: null
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.isUserLogged = this.isUserLogged.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);
    this.handleSaveVoteUrl = this.handleSaveVoteUrl.bind(this);
    this.onChange = this.onChange.bind(this);
    this.getBalanceContainer = this.getBalanceContainer.bind(this);
    this.requestWithdraw = this.requestWithdraw.bind(this);
    this.requestCheckIfUserIsVerified = this.requestCheckIfUserIsVerified.bind(this);
    this.requestCheckIfUserHasIssuedWithdraw = this.requestCheckIfUserHasIssuedWithdraw.bind(this);
    this.startTransactionHashPolling = this.startTransactionHashPolling.bind(this);
    this.requestTransactionHash = this.requestTransactionHash.bind(this);
    this._getVerifiedStatus = this._getVerifiedStatus.bind(this);
    this._getVerifiedWithIncompleteReferrals = this._getVerifiedWithIncompleteReferrals.bind(this);
    this._getTooLateVerifiedStatus = this._getTooLateVerifiedStatus.bind(this);
    this._getUnverifiedStatus = this._getUnverifiedStatus.bind(this);
    this._getFailedStatus = this._getFailedStatus.bind(this);
    this._getIncompleteStatus = this._getIncompleteStatus.bind(this);
  }

  componentWillMount() {
    this.requestCheckIfUserIsVerified();
    this.requestCheckIfUserHasIssuedWithdraw();
    if (this.props.location.search && this.props.location.search.indexOf('emailtoken') !== -1) {
      requester.verifyUserEmail(this.props.location.search).then(() => {
        // console.log('verifying user email');
        NotificationManager.success(EMAIL_VERIFIED, '', LONG);
        if (this.isUserLogged()) {
          requester.getUserAirdropInfo().then(res => {
            res.body.then(data => {
              // console.log('dispatching user info');
              this.dispatchAirdropInfo(data);
            });
          });
        }
      });
    } else if (this.props.location.search && this.props.location.search.indexOf('airdroptoken') !== -1) {
      const token = this.props.location.search.split('=')[1];
      this.handleAirdropUser(token);
    } else if (this.isUserLogged()) {
      requester.getUserAirdropInfo().then(res => {
        res.body.then(data => {
          this.dispatchAirdropInfo(data);
        });
      });
    } else {
      this.setState({ loading: false });
    }
  }

  componentWillReceiveProps(props) {
    if (props.airdropInfo.participates) {
      this.setState({ userParticipates: true });
    }
  }

  componentWillUnmount() {
    clearInterval(this.transactionHashPollingInterval);
  }

  requestCheckIfUserIsVerified() {
    requester.checkIfAirdropUserIsVerified().then(res => res.body).then(res => {
      this.setState({ userIsVerified: res.isVerified });
    });
  }

  requestCheckIfUserHasIssuedWithdraw() {
    requester.checkIfAirdropWithdrawHasStarted().then(res => res.body).then(res => {
      this.setState({ isWithdrawStarted: res.isWithdrawStarted });
      if (res.isWithdrawStarted && !res.tx) {
        this.startTransactionHashPolling();
      }
    });
  }

  startTransactionHashPolling() {
    this.transactionHashPollingInterval = setInterval(this.requestTransactionHash, 10000);
  }

  requestTransactionHash() {
    requester.checkIfAirdropWithdrawHasStarted().then(res => res.body).then(res => {
      if (res.tx) {
        this.setState({ withdrawTransactionHash: res.tx });
        clearInterval(this.transactionHashPollingInterval);
      }
    });
  }

  requestWithdraw() {
    requester.withdrawTokensFromAirdrop().then(res => res.body).then(res => {
      NotificationManager.info(WITHDRAW_REQUEST_SUCCESSFUL, '', LONG);
      this.requestCheckIfUserHasIssuedWithdraw();
    });
  }

  // componentDidUpdate(prevState) {
  //   const { isUserLogged, didPostUserInfo } = this.state;
  //   if (!prevState.isUserLogged && isUserLogged) {
  //     getUserAirdropInfo().then(json => {
  //       this.setState({ userAirdropInfo: json });
  //     });
  //   }
  // }

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

    this.props.dispatch(airdropModals(modal));
  }

  isUserLogged() {
    const loggedInUserEmail = localStorage[Config.getValue('domainPrefix') + '.auth.username'];
    const bearerToken = localStorage[Config.getValue('domainPrefix') + '.auth.locktrip'];
    if (loggedInUserEmail && bearerToken) {
      if (!this.state.isUserLogged) {
        this.setState({ isUserLogged: true });
      }

      return true;
    }

    return false;
  }

  logout() {
    localStorage.removeItem(Config.getValue('domainPrefix') + '.auth.locktrip');
    localStorage.removeItem(Config.getValue('domainPrefix') + '.auth.username');

    // reflect that the user is logged out, both in Redux and in the local component state
    this.props.dispatch(setIsLogged(false));
  }

  handleAppUser() {
    return (
      <div>
        Content for app users
      </div>
    );
  }

  handleAirdropUser(token) {
    requester.checkIfAirdropUserExists(token).then(res => {
      res.body.then(user => {
        if (user.exists) {
          const airdropEmail = user.email;
          const loggedInUserEmail = localStorage[Config.getValue('domainPrefix') + '.auth.username'];

          if (this.isUserLogged()) {
            if (airdropEmail !== loggedInUserEmail) {
              // console.log('wrong user logged')
              this.logout();
              this.openModal(AIRDROP_LOGIN);
            } else {
              // console.log('user is logged')
              // Post confirmation to backend /airdrop/participate/:token
              requester.getUserAirdropInfo().then(res => {
                res.body.then(data => {
                  if (data.user) {
                    this.dispatchAirdropInfo(data);
                  } else {
                    requester.verifyUserAirdropInfo(token).then(() => {
                      requester.getUserAirdropInfo().then(res => {
                        res.body.then(data => {
                          this.dispatchAirdropInfo(data);
                          // console.log('user info dispatched')
                          NotificationManager.info(VERIFICATION_EMAIL_SENT, '', LONG);
                        });
                      });
                    });
                  }
                });
              });
            }
          } else {
            // console.log('no user logged')
            this.openModal(AIRDROP_LOGIN);
          }
        } else if (!user.exists) {
          // user profile doesn't exist
          // console.log('user does not exist')
          this.logout();
          this.openModal(AIRDROP_REGISTER);
        } else {
          NotificationManager.warning(INVALID_SECURITY_CODE, '', LONG);
          this.props.location.href = '/airdrop';
        }
      }).catch(e => {
        // console.log(e);
        // this.props.history.push('/airdrop');
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
    const referralCount = info.referralCount;
    const isCampaignSuccessfullyCompleted = info.isCampaignSuccessfullyCompleted;
    const voteUrl = info.voteUrl ? info.voteUrl : '';
    const finalizedStatus = info.finalizedStatus;
    this.props.dispatch(setAirdropInfo(email, facebookProfile, telegramProfile, twitterProfile, redditProfile, refLink, participates, isVerifyEmail, referralCount, isCampaignSuccessfullyCompleted, voteUrl, finalizedStatus));
    this.props.airdropInfo.referralCount = referralCount;
    this.props.airdropInfo.isCampaignSuccessfullyCompleted = isCampaignSuccessfullyCompleted;
    this.setState({ voteUrl: voteUrl, loading: false });
  }

  handleEdit(media, e) {
    e.preventDefault();
    this.setState({
      [media + 'Edit']: true,
      [media + 'Profile']: this.props.airdropInfo[media + 'Profile']
    });
  }

  handleEditSubmit(media) {
    this.setState({ [media + 'Edit']: false }, () => {
      const profileName = this.state[media + 'Profile'];
      if (profileName) {
        const profile = { social: profileName };
        requester.saveAirdropSocialProfile(media, profile).then(() => {
          requester.getUserAirdropInfo().then(res => {
            res.body.then(data => {
              this.dispatchAirdropInfo(data);
            });
          });
        });
        NotificationManager.success(PROFILE_SUCCESSFULLY_UPDATED, '', LONG);
      } else {
        NotificationManager.error(SOCIAL_PROFILE_EMPTY, '', LONG);
      }
    });
  }

  handleResendVerificationEmail(e) {
    e.preventDefault();
    requester.resendConfirmationEmail().then(() => {
      NotificationManager.info(VERIFICATION_EMAIL_SENT, '', LONG);
    });
  }

  handleSaveVoteUrl() {
    if (!validator.isURL(this.state.voteUrl)) {
      NotificationManager.error(INVALID_URL, '', LONG);
    } else {
      const { voteUrl } = this.state;
      requester.editAirdropVoteUrl({ voteUrl }).then(() => {
        this.setState({ isVoteUrlEdited: false });
        NotificationManager.info(VOTE_URL_SUCCESSFULLY_SAVED, '', LONG);
      }).catch(error => {
        // console.log(error);
      });
    }
  }

  onChange(e) {
    if (e.target.name === 'voteUrl') {
      this.setState({ isVoteUrlEdited: true });
    }

    this.setState({ [e.target.name]: e.target.value });
  }

  getBalanceContainer() {
    switch (this.props.airdropInfo.finalizedStatus) {
      case 'VERIFIED':
        return this._getVerifiedStatus();
      case 'VERIFIED_REFERRALS_INCOMPLETE':
        return this._getVerifiedWithIncompleteReferrals();
      case 'LATE_VERIFIED':
        return this._getTooLateVerifiedStatus();
      case 'FAILED':
        return this._getFailedStatus();
      case 'INCOMPLETE':
        return this._getIncompleteStatus();
      default:
        return this._getUnverifiedStatus();
    }
  }

  _getVerifiedStatus() {
    return (
      <React.Fragment>
        <div className="balance-row__label">
          {/* <span className="step-check checked" style={{ "margin-top": "-0.4em" }}></span> */}
          <span className="emphasized-text">Verified Balance</span>
        </div>
        <div className="balance-row__content">${Math.max(10, this.props.airdropInfo.referralCount * 5 + 10)}</div>
        {this.state.userIsVerified && !this.state.isWithdrawStarted && <button className="claim-button" onClick={this.requestWithdraw}>Claim</button>}
        {this.state.isWithdrawStarted && !this.state.withdrawTransactionHash && <button className="claim-button">Waiting for transaction hash</button>}
        {this.state.isWithdrawStarted && this.state.withdrawTransactionHash && <a href={`https://etherscan.io/tx/${this.state.withdrawTransactionHash}`} className='etherscan-link' target='_blank'>TxHash: {this.state.withdrawTransactionHash.substring(0, 8)}...</a>}
      </React.Fragment>
    );
  }

  _getVerifiedWithIncompleteReferrals() {
    return [
      <div className="balance-row__label">
        <span className="step-check checked" style={{ "margin-top": "3.5em" }}></span>
        <span className="emphasized-text">Your status has been verified, however your referrals might be subjected to additional verification checks which might affect your final balance.</span>
      </div>,
      <div className="balance-row__content centered-balance">${Math.max(10, this.props.airdropInfo.referralCount * 5 + 10)}</div>
    ];
  }

  _getTooLateVerifiedStatus() {
    return [
      <div className="balance-row__label">
        <span className="step-check checked" style={{ "margin-top": "3.5em" }}></span>
        <span className="emphasized-text">Your balance is verified as $0, because the airdrop has been finalized in your country prior to the moment you had joined and  because you have not referred any other people. For more info, <a href="https://medium.com/@LockChainCo/participating-in-the-loc-airdrop-from-a-country-where-the-airdrop-has-been-finalized-621fd7f7a78b" target="_blank" rel='noreferrer noopener' className="referral-url"><u>read this post</u></a>. </span>
      </div>,
      <div className="balance-row__content centered-balance">$0</div>
    ];
  }

  _getUnverifiedStatus() {
    return (
      <React.Fragment>
        <div className="balance-row__label"><span className="emphasized-text">Unverified Balance</span></div>
        <div className="balance-row__content">${this.props.airdropInfo.isCampaignSuccessfullyCompleted ? this.props.airdropInfo.referralCount * 5 + 10 : this.props.airdropInfo.referralCount * 5}</div>
      </React.Fragment>
    );
  }

  _getFailedStatus() {
    return [
      <div className="balance-row__label">
        <span className="step-check unchecked" style={{ "margin-top": "1.5em" }}></span>
        <span className="mandatory">
          Duplicate accounting/multi accounting has been detected. As a result your balance has been voided.
        </span>
      </div>,
      <div className="balance-row__content centered-balance">$0</div>
    ];
  }

  _getIncompleteStatus() {
    return [
      <div className="balance-row__label">
        <span className="step-check unchecked" style={{ "margin-top": "3.5em" }}></span>
        <span className="mandatory">
          Our checks indicate that you have not completed all social joins.
          Please make sure you have joined our telegram, followed us on Twitter and Facebook.<br />
          For more info, please <a href="https://medium.com/@LockChainCo/how-to-fix-social-joins-requirement-ea31b6e31801" target="_blank" rel='noreferrer noopener' className="referral-url"><u>read this post</u></a>.
        </span>
      </div>,
      <div className="balance-row__content centered-balance">$0</div>
    ];
  }

  render() {
    // if (this.state.loading) {
    //   return <div className="loader"></div>;
    // }

    if (!this.isUserLogged()) {
      return (
        <div className="container">
          <NoEntriesMessage text='Log in or participate in our airdrop campaign.'>
            <a href="" className="btn" onClick={(e) => this.openModal(LOGIN, e)}>Log in</a>
            <a href={'https://locktrip.com/airdrop/' + this.props.location.search} className="btn">Participate</a>
          </NoEntriesMessage>
        </div>
      );
    }

    if (!this.props.airdropInfo.participates) {
      return (
        <div>
          <NavProfile />
          <div className="container">
            <NoEntriesMessage text='Participate in our airdrop campaign.'>
              <a href={'https://locktrip.com/airdrop/' + this.props.location.search} className="btn">Participate</a>
            </NoEntriesMessage>
          </div>
        </div>
      );
    }

    return (
      <div>
        <NavProfile />
        <div className="container">
          <div id="airdrop-main">
            <h4>Personal Dashboard</h4>
            <p>You can view your current balance, as well as your unique Referral Link.</p>
            <p>Every Person who completes our airdrop via your unique referral link, will generate $5 for you! <span className="emphasized-text">Make sure you refer as much friends and family as you can!</span></p>

            <div className="balance-info">
              <div className="balance-row">
                {this.getBalanceContainer()}
              </div>

              <div className="balance-row">
                <div className="balance-row__label"><span className="emphasized-text">Your Referral URL</span></div>
                <div className="balance-row__content"><span className="referral-url">{this.props.airdropInfo.refLink.toString().replace('alpha.', '').replace('beta.', '')}</span></div>
                <CopyToClipboard
                  text={this.props.airdropInfo.refLink.toString().replace('alpha.', '').replace('beta.', '')}
                  onCopy={() => {
                    NotificationManager.info(COPIED_TO_CLIPBOARD, '', LONG);
                  }}
                >
                  <button className="referral-url-copy">Copy to Clipboard</button>
                </CopyToClipboard>
              </div>

              <div className="balance-row">
                <div className="balance-row__label"><span className="emphasized-text">Your LockTrip listing vote screenshot URL (<a href="https://medium.com/@LockChainCo/vote-for-locktrip-on-kucoin-now-f89448556aac" target="_blank" rel='noreferrer noopener' className="referral-url">read more</a>)</span></div>
                <input name="voteUrl" value={this.state.voteUrl} className="balance-row__content" onChange={this.onChange}></input>
                <span className={`step-check${this.state.voteUrl ? ' checked' : ' unchecked'}`}></span>
                {this.state.isVoteUrlEdited && this.state.voteUrl &&
                  <button className="save-vote-url" onClick={this.handleSaveVoteUrl}>Save</button>
                }
              </div>
            </div>

            <div className="airdrop-info">
              <div className="airdrop-info__header">Airdrop Program</div>
              <div className="airdrop-info__content">
                <div className="airdrop-row email">
                  <div className="description">
                    {this.props.airdropInfo.isVerifyEmail
                      ? <div><span className="step-check checked"></span><span className="airdrop-row__heading">Email Signup - Completed</span></div>
                      : <div><span className="step-check unchecked"></span><span className="airdrop-row__heading">Email Signup - Not yet verified. <a href="" onClick={this.handleResendVerificationEmail}>Resend verification email</a>.</span></div>
                    }
                  </div>
                </div>
                <hr />
                <div className="airdrop-row">
                  <div className="description">
                    {this.props.airdropInfo.telegramProfile
                      ? <div><span className="step-check checked"></span><span className="airdrop-row__heading">Telegram Join</span>&nbsp;<span className="icon-arrow-right"></span>&nbsp;<span>Social media activity for <span className="profile-name">{this.props.airdropInfo.telegramProfile}</span> is being verified. You can still <a href="" onClick={(e) => { this.handleEdit('telegram', e); }}>change</a> your profile.</span></div>
                      : <div><span className="step-check unchecked"></span><span className="airdrop-row__heading">Telegram Join</span>&nbsp;<span className="icon-arrow-right"></span>&nbsp;<span>Please click <a href="" onClick={(e) => { this.handleEdit('telegram', e); }}>here</a> to complete this step and be eligible to claim your tokens.</span></div>
                    }
                  </div>
                  {this.state.telegramEdit &&
                    <div className="airdrop-profile-edit">
                      <input type="text" placeholder="Telegram Profile" name="telegramProfile" value={this.state.telegramProfile} onChange={this.onChange} />
                      <button className="btn" onClick={() => this.handleEditSubmit('telegram')}>Save</button>
                    </div>
                  }
                </div>
                <div className="airdrop-row">
                  <div className="description">
                    {this.props.airdropInfo.twitterProfile
                      ? <div><span className="step-check checked"></span><span className="airdrop-row__heading">Twitter Follow</span>&nbsp;<span className="icon-arrow-right"></span>&nbsp;<span>Social media activity for <span className="profile-name">{this.props.airdropInfo.twitterProfile}</span> is being verified. You can still <a href="" onClick={(e) => { this.handleEdit('twitter', e); }}>change</a> your profile.</span></div>
                      : <div><span className="step-check unchecked"></span><span className="airdrop-row__heading">Twitter Follow</span>&nbsp;<span>Please click <a href="" onClick={(e) => { this.handleEdit('twitter', e); }}>here</a> to complete this step and be eligible to claim your tokens.</span></div>
                    }
                  </div>
                  {this.state.twitterEdit &&
                    <div className="airdrop-profile-edit">
                      <input type="text" placeholder="Twitter Profile" name="twitterProfile" value={this.state.twitterProfile} onChange={this.onChange} />
                      <button className="btn" onClick={() => this.handleEditSubmit('twitter')}>Save</button>
                    </div>
                  }
                </div>
                <div className="airdrop-row">
                  <div className="description">
                    {this.props.airdropInfo.twitterProfile
                      ? <div><span className="step-check checked"></span><span className="airdrop-row__heading">Twitter Share</span>&nbsp;<span className="icon-arrow-right"></span>&nbsp;<span>Social media activity for <span className="profile-name">{this.props.airdropInfo.twitterProfile}</span> is being verified. You can still <a href="" onClick={(e) => { this.handleEdit('twitter', e); }}>change</a> your profile.</span></div>
                      : <div><span className="step-check unchecked"></span><span className="airdrop-row__heading">Twitter Share</span>&nbsp;<span>Please click <a href="" onClick={(e) => { this.handleEdit('twitter', e); }}>here</a> to complete this step and be eligible to claim your tokens.</span></div>
                    }
                  </div>
                </div>
                <div className="airdrop-row">
                  <div className="description">
                    {this.props.airdropInfo.facebookProfile
                      ? <div><span className="step-check checked"></span><span className="airdrop-row__heading">Facebook Follow</span>&nbsp;<span className="icon-arrow-right"></span>&nbsp;<span>Social media activity for <span className="profile-name">{this.props.airdropInfo.facebookProfile}</span> is being verified. You can still <a href="" onClick={(e) => { this.handleEdit('facebook', e); }}>change</a> your profile.</span></div>
                      : <div><span className="step-check unchecked"></span><span className="airdrop-row__heading">Facebook Follow</span>&nbsp;<span>Please click <a href="" onClick={(e) => { this.handleEdit('facebook', e); }}>here</a> to enter your Facebook Username and be eligible to claim your tokens.</span></div>
                    }
                  </div>
                  {this.state.facebookEdit &&
                    <div className="airdrop-profile-edit">
                      <input type="text" placeholder="Facebook Profile Link" name="facebookProfile" value={this.state.facebookProfile} onChange={this.onChange} />
                      <button className="btn" onClick={() => this.handleEditSubmit('facebook')}>Save</button>
                    </div>
                  }
                </div>
                <hr />
                {/*<div className="airdrop-row final">*/}
                {/*<div className="description">*/}
                {/*<span className="step-check unchecked"></span><span className="airdrop-row__heading">Final Step</span>*/}
                {/*</div>*/}
                {/*</div>*/}
              </div>
            </div>

            {/* <div>
              Email: {this.props.airdropInfo.email}
            </div>
            <div>
              Facebook: {this.props.airdropInfo.facebookProfile}
            </div>
            <div>
              Twitter: {this.props.airdropInfo.twitterProfile}
            </div>
            <div>
              Reddit: {this.props.airdropInfo.redditProfile}
            </div>
            <div>
              telegram: {this.props.airdropInfo.telegramProfile}
            </div> */}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { userInfo, modalsInfo, airdropInfo } = state;
  return {
    userInfo,
    modalsInfo,
    airdropInfo
  };
}

AirdropPage.propTypes = {
  countries: PropTypes.array,

  // start Router props
  location: PropTypes.object,
  history: PropTypes.object,

  // start Redux props
  paymentInfo: PropTypes.object,
  userInfo: PropTypes.object,
  airdropInfo: PropTypes.object,
  dispatch: PropTypes.func,
};

export default withRouter(connect(mapStateToProps)(AirdropPage));
