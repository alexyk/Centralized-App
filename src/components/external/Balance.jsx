import 'react-notifications/lib/notifications.css';

import { COPIED_TO_CLIPBOARD } from '../../constants/infoMessages.js';
import { Config } from '../../config';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { LONG } from '../../constants/notificationDisplayTimes.js';
import { NotificationManager } from 'react-notifications';
import React from 'react';
import requester from '../../requester';
import { withRouter } from 'react-router-dom';

class Balance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      balance: null,
      canProceed: false,
      refLink: null
    };
    this.onChange = this.onChange.bind(this);
    this.send = this.send.bind(this);
  }


  onChange(e) {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    this.setState({ [e.target.name]: value }, () => {
      this.setState({ canProceed: this.state.email.indexOf('@') > 0 });
    });
  }


  componentDidMount() {
  }

  send() {
    requester.getExternalCampaignBalance({ email: this.state.email }).then(res => {
      if (res.success) {
        res.body.then(data => {
          this.setState({ balance: data.count, refLink: Config.getValue('basePath') + 'vote?ref=' + data.referralId });
        });
      } else {
        // console.log('Error');
      }
    });
  }

  render() {
    return <div>
      <section id="wallet-index">
        <div className="container">
          <div className="row">
            <div className="after-header" />
            <div className="col-md-11">
              <div id="profile-edit-form">
                <h2>Check your campaign contribution balance</h2>
                <hr />
                <span>
                  Token distribution will be after 15th July. Your balance will be verified together with your screenshot right before distribution.
                </span>
                <hr />
                <form onSubmit={(e) => {
                  e.preventDefault();
                  this.send();
                }}>
                  <div className="name">
                    <label htmlFor="email">Email</label>
                    <input className="form-control" id="email" name="email" onChange={this.onChange}
                      type="email" value={this.state.email} placeholder="Your email..." />
                  </div>
                  <hr />
                  {this.state.balance !== null &&
                    <div className="name">
                      <input className="form-control form-control-disabled" id="balance" name="balance"
                        type="text" disabled="disabled" value={'Unverified balance: ' + this.state.balance} />
                    </div>
                  }
                  {this.state.refLink !== null &&
                    <div className="name">
                      <label htmlFor="refLink">Referral URL:</label>
                      <input className="form-control form-control-disabled" id="refLink" name="refLink"
                        type="text" disabled="disabled" value={this.state.refLink} />
                      <CopyToClipboard text={this.state.refLink} onCopy={() => { NotificationManager.info(COPIED_TO_CLIPBOARD, '', LONG); }}>
                        <a href="" className="btn">Copy</a>
                      </CopyToClipboard>
                    </div>
                  }
                  <hr />
                  {this.state.canProceed ?
                    <button className="btn btn-primary" type="submit">Check</button> :
                    <button className="btn btn-primary" disabled="disabled">Check</button>}
                </form>
              </div>
            </div>
            <div className="before-footer clear-both" />
          </div>
        </div>
      </section>
    </div>;
  }
}

export default withRouter(Balance);
