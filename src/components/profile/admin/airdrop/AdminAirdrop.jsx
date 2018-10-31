import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import AdminNav from '../AdminNav';
import { Config } from '../../../../config.js';
import { LONG } from '../../../../constants/notificationDisplayTimes.js';

import '../../../../styles/css/components/profile/admin/airdrop/admin-airdrop.css';

class AdminAirDrop extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentLocRate: '',
      locRate: '',
    };

    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.requestAirdropLocRate();
  }

  requestAirdropLocRate() {
    fetch(`${Config.getValue('apiHost')}admin/loc/rate`, {
      headers: {
        'Authorization': localStorage.getItem(Config.getValue('domainPrefix') + '.auth.locktrip')
      }
    }).then((res) => {
      res.json().then((data) => {
        this.setState({
          currentLocRate: data.loc_rate,
          locRate: data.loc_rate
        });
      });
    });
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit(e) {
    if (e) {
      e.preventDefault();
    }

    fetch(`${Config.getValue('apiHost')}admin/loc/rate`, {
      method: 'post',
      headers: {
        'Authorization': localStorage.getItem(Config.getValue('domainPrefix') + '.auth.locktrip'),
        'content-type': 'application/json'
      },
      body: JSON.stringify({ loc_rate: this.state.locRate })
    }).then((res) => {
      res.json().then((data) => {
        this.requestAirdropLocRate();
        if (data.is_success) {
          NotificationManager.success('Loc rate is modify successfully.', '', LONG);
        } else {
          NotificationManager.warning('Loc rate is not modify, please try again!!!', '', LONG);
        }
      });
    });
  }

  render() {
    const { currentLocRate, locRate } = this.state;

    return (
      <div className="loc-rate">
        <AdminNav>
          <h2 className="navigation-tab">Airdrop</h2>
        </AdminNav>
        <h4 className="current-loc-rate">Current loc rate: {currentLocRate && (currentLocRate).toFixed(2)}</h4>
        <form method="post" onSubmit={this.handleSubmit}>
          <div className="input-froup">
            <label htmlFor="locRate">Loc rate</label>
            <input
              type="number"
              id="locRate"
              name="locRate"
              placeholder="Loc rate"
              value={locRate}
              onChange={this.onChange} />
          </div>
          <div className="button-holder">
            <button type="submit" className="btn btn-primary">Modify</button>
          </div>
        </form>
      </div>
    );
  }
}

export default AdminAirDrop;