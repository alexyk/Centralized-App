import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { connect } from 'react-redux';
import { setIsLogged } from '../../../actions/userInfo';
import { openModal, closeModal, airdropModals } from '../../../actions/modalsInfo';
import { Config } from '../../../config';
import { setAirdropInfo, setAirdropModalTrue } from '../../../actions/airdropInfo';
import { NotificationManager } from 'react-notifications';
import NavProfile from '../NavProfile';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import NoEntriesMessage from '../common/NoEntriesMessage';
import requester from '../../../initDependencies';

import '../../../styles/css/components/profile/airdrop-page.css';

import {
  LOGIN,
  AIRDROP_LOGIN,
  AIRDROP_REGISTER
} from '../../../constants/modals.js';

class AirdropPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isUserLogged: false,
      isAirdropUser: false,
      didPostUserInfo: false,
      loginEmail: '',
      loginPassword: '',
      token: null,
      userParticipates: false,
      loading: true,
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.isUserLogged = this.isUserLogged.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    if (this.props.location.search && this.props.location.search.indexOf('emailtoken') !== -1) {

      requester.verifyUserEmail(this.props.location.search).then(() => {
        NotificationManager.info('Email verified.');
        if (this.isUserLogged()) {
          requester.getUserAirdropInfo().then(res => {
            res.body.then(data => {
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
              console.log('wrong user logged')
              this.logout();
              this.openModal(AIRDROP_LOGIN);
            } else {
              console.log('user is logged')
              // Post confirmation to backend /airdrop/participate/:token
              requester.getUserAirdropInfo().then(res => {
                res.body.then(data => {
                  if (data.user) {
                    console.log('user already participates')
                    this.dispatchAirdropInfo(data);
                    console.log('user info dispatched')
                  } else {
                    console.log('user has not participated yet', data)
                    requester.verifyUserAirdropInfo(token).then(() => {
                      // then set airdrop info in redux
                      console.log('user moved from temp to main')
                      requester.getUserAirdropInfo().then(res => {
                        res.body.then(data => {
                          this.dispatchAirdropInfo(data);
                          console.log('user info dispatched')
                          NotificationManager.info('Verification email has been sent. Please follow the link to confirm your email.');
                        });
                      });
                    });
                  }
                });
              });
            }
          } else {
            console.log('no user logged')
            this.openModal(AIRDROP_LOGIN);
          }
        } else if (!user.exists) {
          // user profile doesn't exist
          console.log('user does not exist')
          this.logout();
          this.openModal(AIRDROP_REGISTER);
        } else {
          NotificationManager.warning('Token expired or invalid');
          this.props.location.href = '/airdrop';
        }
      });
    }).catch(e => {
      console.log(e);
      // this.props.history.push('/airdrop');
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
    this.props.dispatch(setAirdropInfo(email, facebookProfile, telegramProfile, twitterProfile, redditProfile, refLink, participates, isVerifyEmail, referralCount, isCampaignSuccessfullyCompleted));
    this.props.airdropInfo.referralCount = referralCount;
    this.props.airdropInfo.isCampaignSuccessfullyCompleted = isCampaignSuccessfullyCompleted;
    this.setState({ loading: false });
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
        NotificationManager.info('Profile saved.');
      } else {
        NotificationManager.info('Profile cannot be empty.');
      }
    });
  }

  handleResendVerificationEmail(e) {
    e.preventDefault();
    requester.resendConfirmationEmail().then(() => {
      NotificationManager.info('Verification email has been sent.');
    });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    // if (this.state.loading) {
    //   return <div className="loader"></div>;
    // }

    if (!this.isUserLogged()) {
      return (
        <div className="container">
          <NoEntriesMessage text='Log in or participate in our airdrop campaign.'>
            <a href="#" className="btn" onClick={(e) => this.openModal(LOGIN, e)}>Log in</a>
            <a href={"https://locktrip.com/airdrop/" + this.props.location.search} className="btn">Participate</a>
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
              <a href={"https://locktrip.com/airdrop/" + this.props.location.search} className="btn">Participate</a>
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
                <div className="balance-row__label"><span className="emphasized-text">Unverified Balance</span></div>
                <div className="balance-row__content">${this.props.airdropInfo.isCampaignSuccessfullyCompleted ? this.props.airdropInfo.referralCount * 5 + 10 : this.props.airdropInfo.referralCount * 5}</div>


              </div>

              <div className="balance-row">
                <div className="balance-row__label"><span className="emphasized-text">Your Referral URL</span></div>
                <div className="balance-row__content"><span className="referral-url">{this.props.airdropInfo.refLink.toString().replace('alpha.', '')}</span></div>
                <CopyToClipboard text={this.props.airdropInfo.refLink.toString().replace('alpha.', '')} onCopy={() => { NotificationManager.info('Copied to clipboard.'); }}><button className="referral-url-copy">Copy to Clipboard</button></CopyToClipboard>
              </div>

              {/* <div className="balance-row">
                <div className="balance-row__label"><span className="emphasized-text">Number of Referred People</span></div>
                <div className="balance-row__content">101</div>
              </div> */}
            </div>

            <div className="airdrop-info">
              <div className="airdrop-info__header">Airdrop Program</div>
              <div className="airdrop-info__content">
                <div className="airdrop-row email">
                  <div className="description">
                    {this.props.airdropInfo.isVerifyEmail
                      ? <div><span className="step-check checked"></span><span className="airdrop-row__heading">Email Signup - Completed</span></div>
                      : <div><span className="step-check unchecked"></span><span className="airdrop-row__heading">Email Signup - Not yet verified. <a href="#" onClick={this.handleResendVerificationEmail}>Resend verification email</a>.</span></div>
                    }
                  </div>
                </div>
                <hr />
                <div className="airdrop-row">
                  <div className="description">
                    {this.props.airdropInfo.telegramProfile
                      ? <div><span className="step-check checked"></span><span className="airdrop-row__heading">Telegram Join</span>&nbsp;<span className="icon-arrow-right"></span>&nbsp;<span>Social media activity for <span className="profile-name">{this.props.airdropInfo.telegramProfile}</span> is being verified. You can still <a href="#" onClick={(e) => { this.handleEdit('telegram', e); }}>change</a> your profile.</span></div>
                      : <div><span className="step-check unchecked"></span><span className="airdrop-row__heading">Telegram Join</span>&nbsp;<span className="icon-arrow-right"></span>&nbsp;<span>Please click <a href="#" onClick={(e) => { this.handleEdit('telegram', e); }}>here</a> to complete this step and be eligible to claim your tokens.</span></div>
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
                      ? <div><span className="step-check checked"></span><span className="airdrop-row__heading">Twitter Follow</span>&nbsp;<span className="icon-arrow-right"></span>&nbsp;<span>Social media activity for <span className="profile-name">{this.props.airdropInfo.twitterProfile}</span> is being verified. You can still <a href="#" onClick={(e) => { this.handleEdit('twitter', e); }}>change</a> your profile.</span></div>
                      : <div><span className="step-check unchecked"></span><span className="airdrop-row__heading">Twitter Follow</span>&nbsp;<span>Please click <a href="#" onClick={(e) => { this.handleEdit('twitter', e); }}>here</a> to complete this step and be eligible to claim your tokens.</span></div>
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
                      ? <div><span className="step-check checked"></span><span className="airdrop-row__heading">Twitter Share</span>&nbsp;<span className="icon-arrow-right"></span>&nbsp;<span>Social media activity for <span className="profile-name">{this.props.airdropInfo.twitterProfile}</span> is being verified. You can still <a href="#" onClick={(e) => { this.handleEdit('twitter', e); }}>change</a> your profile.</span></div>
                      : <div><span className="step-check unchecked"></span><span className="airdrop-row__heading">Twitter Share</span>&nbsp;<span>Please click <a href="#" onClick={(e) => { this.handleEdit('twitter', e); }}>here</a> to complete this step and be eligible to claim your tokens.</span></div>
                    }
                  </div>
                </div>
                <div className="airdrop-row">
                  <div className="description">
                    {this.props.airdropInfo.facebookProfile
                      ? <div><span className="step-check checked"></span><span className="airdrop-row__heading">Facebook Follow</span>&nbsp;<span className="icon-arrow-right"></span>&nbsp;<span>Social media activity for <span className="profile-name">{this.props.airdropInfo.facebookProfile}</span> is being verified. You can still <a href="#" onClick={(e) => { this.handleEdit('facebook', e); }}>change</a> your profile.</span></div>
                      : <div><span className="step-check unchecked"></span><span className="airdrop-row__heading">Facebook Follow</span>&nbsp;<span>Please click <a href="#" onClick={(e) => { this.handleEdit('facebook', e); }}>here</a> to enter your Facebook Username and be eligible to claim your tokens.</span></div>
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

export default withRouter(connect(mapStateToProps)(AirdropPage));
