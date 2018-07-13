import React from 'react';

import 'react-notifications/lib/notifications.css';
import {NotificationManager} from 'react-notifications';
import {participateExternalCampaign} from '../../requester'
import {Link, withRouter} from "react-router-dom";
import queryString from 'query-string';
import {Config} from "../../config";
import {CopyToClipboard} from "react-copy-to-clipboard";

class WorldKuCoinCampaign extends React.Component {
  constructor(props) {
    super(props);
    const params = queryString.parse(this.props.location.search);
    this.state = {
      ethAddress: '',
      email: '',
      screenshotUrl: '',
      internshipInterested: false,
      canProceed: false,
      success: false,
      referredBy: params.ref,
      referralUrl: null,
      telegram: ''
    };
    this.onChange = this.onChange.bind(this);
    this.send = this.send.bind(this);
  }


  onChange(e) {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    this.setState({[e.target.name]: value}, () => {
      this.setState({canProceed: this.state.ethAddress !== '' && this.state.email !== '' && this.state.screenshotUrl.indexOf("http") === 0 && this.state.telegram !== ''});
    });
  }


  componentDidMount() {
  }

  send() {
    participateExternalCampaign({
      email: this.state.email,
      screenshotUrl: this.state.screenshotUrl,
      ethAddress: this.state.ethAddress,
      internshipInterested: this.state.internshipInterested,
      referredBy: this.state.referredBy,
      campaignUrl: this.props.location.pathname,
      telegram: this.state.telegram
    })
      .then(participant => {
        NotificationManager.success('Your participation has been recorded successfully. Thank you for your support!', 'KuCoin Vote');
        this.setState({success: true, referralUrl: Config.getValue("basePath") + "vote?ref=" + participant.id});
      })
      .catch(() => {
        NotificationManager.error("There was a problem recording your participation. Please try again", "KuCoin Vote");
      })
    ;
  }

  render() {
    return <div>
      <section id="wallet-index">
        <div className="container">
          <div className="row">
            <div className="after-header"/>
            <div className="col-md-11">
              <div id="profile-edit-form">
                <h2>LockTrip Kucoing Voting Airdrop</h2>
                <br/>
                <span>Please complete this to help LockTrip get listed on Kucoin and earn 2 LOC (will be paid after 15th July)</span>
                <br/>
                <span>The whole process takes approximately 2 minutes and is completely free.</span>
                <hr/>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  this.send();
                }}>
                  <div className="name">
                    <label htmlFor="email">1. Please provide us your email</label>
                    <input className="form-control" id="email" name="email" onChange={this.onChange}
                           type="email" value={this.state.email} placeholder="Your email..."/>
                  </div>
                  <hr/>
                  <div className="name">
                    <label htmlFor="email">2. Join our Voting Campaign Telegram <a
                      href="https://t.me/locktrip_kucoin_bounty" target="_blank">https://t.me/locktrip_kucoin_bounty</a></label>

                  </div>
                  <hr/>

                  <div className="name">
                    <label htmlFor="telegram">3. Provide Us Your Telegram Username</label>
                    <input className="form-control" id="telegram" name="telegram" onChange={this.onChange}
                           type="email" value={this.state.telegram} placeholder="Your telegram username..."/>
                  </div>
                  <hr/>

                  <div className="name">
                    <label htmlFor="email">4. Sign-up on KuCoin (in casse you already have a verified account with them,
                      you can skip this part) <a href="https://www.kucoin.com/#/signup?source=telegram_competition"
                                                 target="_blank">https://www.kucoin.com/#/signup?source=telegram_competition</a></label>
                    <br/>You will need your KuCoin account email address in order to vote.

                  </div>
                  <hr/>

                  <div className="name">
                    <label htmlFor="email">5. Join <a href="https://t.me/KuCoin_Telegram_Competition"
                                                      target="_blank">https://t.me/KuCoin_Telegram_Competition</a></label>

                  </div>
                  <hr/>

                  <div className="name">
                    <label htmlFor="email">6. Send a private message to @Voting_KuCoin_Bot after you join their group,
                      the bot will give you all the instructions you need automatically.
                      <br/><br/>
                      a. What is Your KuCoin Account Email Address: - just enter the email of your account with
                      Kucoin.<br/>
                      b. Project Name You Want To Get Listed (spell the name in full, DON'T USE THE TICKER): - you
                      should fill in "LockTrip" <br/>
                      c. What Is Special About This Project, Why Should It Be Listed On The Exchange: - you should write
                      few words why you like LockTrip<br/><br/>

                      NB! If you have voted for other project, you can initiate a new vote with /newform command
                    </label>

                  </div>
                  <hr/>

                  <div className="name">
                    <label htmlFor="email">7. Make a screenshot of your vote to the bot and upload it online with this
                      site: <a href="https://prnt.sc/ " target="_blank">https://prnt.sc/</a></label>

                  </div>
                  <hr/>

                  <div className="name">
                    <label htmlFor="screenshotUrl">Save the screenshot URL here</label>
                    <input className="form-control" id="screenshotUrl" name="screenshotUrl" onChange={this.onChange}
                           type="text" value={this.state.screenshotUrl} placeholder="Your voting screenshot URL..."/>
                  </div>

                  <div className="name">
                    <label htmlFor="ethAddress">Provide us your ETH wallet</label>
                    <input className="form-control" id="ethAddress" name="ethAddress"
                           onChange={this.onChange} value={this.state.ethAddress} type="text"
                           placeholder="Your ETH address..."/>
                  </div>

                  {this.state.referralUrl &&
                    <div className="name">
                      <label htmlFor="referralUrl">Your Referral Link is : </label>
                      <input className="form-control form-control-disabled" id="referralUrl" name="referralUrl"
                      type="text" value={this.state.referralUrl} disabled="disabled"/>
                      &nbsp;
                      <CopyToClipboard text={this.state.referralUrl} onCopy={() => {
                      NotificationManager.info('Copied to clipboard.');
                    }}><button className="btn">Copy</button></CopyToClipboard>
                      <br/>
                      <span>Refer other people with your referral link to get 1 LOC per each successful referral.</span>
                      <br/>Here's a video on how to do the whole process :<a href="https://youtu.be/VQf6MFifJpQ" target="
                                                                             _blank">https://youtu.be/VQf6MFifJpQ</a>
                    </div>
                  }
                  {this.state.canProceed ?
                    <button className="btn btn-primary" type="submit">Claim LOC Tokens</button> :
                    <button className="btn btn-primary" disabled="disabled">Claim LOC Tokens</button>}
                  &nbsp;&nbsp;
                  {this.state.success && <Link to="/hotels" className="btn btn-success">Go to LockTrip</Link>}
                </form>
              </div>
            </div>
            <div className="before-footer clear-both"/>
          </div>
        </div>
      </section>
    </div>;
  }
}

export default withRouter(WorldKuCoinCampaign);
