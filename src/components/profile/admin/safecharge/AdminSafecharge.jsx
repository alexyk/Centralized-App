import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { NotificationManager } from 'react-notifications';
import AdminNav from '../AdminNav';
// import { LONG } from '../../../../constants/notificationDisplayTimes.js';
import requester from '../../../../requester';

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

    const configVars = [{ name: SAFECHARGE_VAR, value: !(this.props.configVars[SAFECHARGE_VAR] === 'true') }];

    requester.updateConfigVars(configVars).then((res) => {
      if (res.success) {
        res.body.then((data) => {
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
      } else {
        res.errors.then((err) => {
          console.log(err);
        });
      }
    });
  }

  render() {
    const isSafechargeEnabled = this.props.configVars[SAFECHARGE_VAR] === 'true';

    return (
      <div className="admin-safecharge">
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