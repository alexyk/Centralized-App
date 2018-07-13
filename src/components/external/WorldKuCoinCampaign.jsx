import React from 'react';

import 'react-notifications/lib/notifications.css';
import {NotificationManager} from 'react-notifications';
import {participateExternalCampaign} from '../../requester'
import {Link, withRouter} from "react-router-dom";
import queryString from 'query-string';
import {Config} from "../../config";

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
      referralUrl: null
    };
    this.onChange = this.onChange.bind(this);
    this.send = this.send.bind(this);
    console.log(this.state);
  }



  onChange(e) {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    this.setState({[e.target.name]: value}, () => {
      this.setState({canProceed: this.state.ethAddress !== '' && this.state.email !== '' && this.state.screenshotUrl !== ''});
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
      campaignUrl: this.props.location.pathname
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
                <h2>Your LockTrip KuCoin Listing Support</h2>
                <br/>
                <span>Please fill in the following form to confirm your vote and submit your wallet for the LockTrip prize.</span>
                <hr/>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  this.send();
                }}>
                  <div className="name">
                    <label htmlFor="email">Email</label>
                    <input className="form-control" id="email" name="email" onChange={this.onChange}
                           type="email" value={this.state.email} placeholder="Your email..."/>
                  </div>
                  <div className="name">
                    <label htmlFor="ethAddress">ETH address</label>
                    <input className="form-control" id="ethAddress" name="ethAddress"
                           onChange={this.onChange} value={this.state.ethAddress} type="text"
                           placeholder="Your ETH address..."/>
                  </div>
                  <div className="name">
                    <label htmlFor="screenshotUrl">Screenshot URL</label>
                    <input className="form-control" id="screenshotUrl" name="screenshotUrl" onChange={this.onChange}
                           type="text" value={this.state.screenshotUrl} placeholder="Your voting screenshot URL..."/>
                  </div>
                  {this.state.referralUrl &&
                  <div className="name">
                    <label htmlFor="referralUrl">Your referral URL</label>
                    <input className="form-control form-control-disabled" id="referralUrl" name="referralUrl"
                           type="text" value={this.state.referralUrl} disabled="disabled"/>
                  </div>
                  }
                  {this.state.canProceed ?
                    <button className="btn btn-primary" type="submit">Submit your campaign support</button> :
                    <button className="btn btn-primary" disabled="disabled">Submit your campaign support</button>}
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
