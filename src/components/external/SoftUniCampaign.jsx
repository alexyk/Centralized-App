import React from 'react';

import 'react-notifications/lib/notifications.css';
import {NotificationManager} from 'react-notifications';
import {participateExternalCampaign} from '../../requester'
import {Link, withRouter} from "react-router-dom";

class SoftUniCampaign extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ethAddress: '',
      email: '',
      screenshotUrl: '',
      internshipInterested: false,
      canProceed: false,
      success: false
    };
    this.onChange = this.onChange.bind(this);
    this.send = this.send.bind(this);
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
      campaignUrl: this.props.location.pathname
    })
      .then(() => {
        NotificationManager.success('Your participation has been recorded successfully. Thank you for your support!', 'SoftUni KuCoin');
        this.setState({success: true});
      })
      .catch(() => {
        NotificationManager.error("There was a problem recording your participation. Please try again", "SoftUni KuCoin");
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
                <h2>Your SoftUni KuCoin Campaign Support</h2>
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
                  <div>
                    Are you interested in LockTrip internship?
                    <input value={this.state.internshipInterested} style={{width: "10%"}}
                           id="internshipInterested"
                           name="internshipInterested"
                           onChange={this.onChange}
                           checked={this.state.internshipInterested}
                           type="checkbox"/>
                  </div>
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

export default withRouter(SoftUniCampaign);
