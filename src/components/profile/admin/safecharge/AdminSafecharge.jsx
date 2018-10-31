import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NotificationManager } from 'react-notifications';
import AdminNav from '../AdminNav';
import { LONG } from '../../../../constants/notificationDisplayTimes.js';
import { Config } from '../../../../config.js';

import '../../../../styles/css/components/profile/admin/safecharge/admin-safecharge.css';

const SAFECHARGE_VAR = 'SCPaymentModeOn';

class AdminSafecharge extends Component {
  constructor(props) {
    super(props);

    this.handleSafeChargeMode = this.handleSafeChargeMode.bind(this);
  }

  handleSafeChargeMode(e) {
    if (e) {
      e.preventDefault();
    }

    fetch(`${Config.getValue('apiHost')}admin/configVars/changing`, {
      method: 'post',
      headers: {
        'Authorization': localStorage.getItem(Config.getValue('domainPrefix') + '.auth.locktrip'),
        'content-type': 'application/json'
      },
      body: JSON.stringify([{ name: SAFECHARGE_VAR, value: !(this.props.configVars[SAFECHARGE_VAR] === 'true') }])
    }).then((res) => {
      res.json().then((data) => {
        const configVars = {};        
        data.forEach((configVar) => {
          configVars[configVar.name] = configVar.value;
        });

        this.props.onChangeConfigVars(SAFECHARGE_VAR, configVars);

        // if (data.is_success) {
        //   NotificationManager.success('Loc rate is modify successfully.', '', LONG);
        // } else {
        //   NotificationManager.warning('Loc rate is not modify, please try again!!!', '', LONG);
        // }
      });
    });
  }

  render() {
    const { isSafechargeEnabled } = this.props.configVars[SAFECHARGE_VAR] == 'true';
  
    return (
      <div className="safecharge">
        <AdminNav>
          <h2 className="navigation-tab">Safecharge</h2>
        </AdminNav>
        <div className="button-holder">
          <button type="submit" className="btn btn-primary" onClick={this.handleSafeChargeMode}>{isSafechargeEnabled ? 'Disable' : 'Enable'}</button>
        </div>
      </div>
    );
  }
}

AdminSafecharge.propTypes = {
  configVars: PropTypes.object,
  onChangeConfigVars: PropTypes.func
};

export default AdminSafecharge;