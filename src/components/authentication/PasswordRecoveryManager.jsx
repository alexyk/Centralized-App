import React from 'react';
import requester from '../../requester';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import { LONG } from '../../constants/notificationDisplayTimes.js';
import { closeModal, openModal } from '../../actions/modalsInfo';
import { isActive } from '../../selectors/modalsInfo';
import { executeWithToken } from '../../services/grecaptcha/grecaptcha';
import { 
  INVALID_EMAIL, 
  INVALID_SECURITY_CODE, 
  PASSWORDS_DONT_MATCH,
  INVALID_PASSWORD,
  PROFILE_PASSWORD_REQUIREMENTS } from '../../constants/warningMessages.js';
import SendRecoveryEmailModal from './modals/SendRecoveryEmailModal';
import ChangePasswordModal from './modals/ChangePasswordModal';
import EnterRecoveryTokenModal from './modals/EnterRecoveryTokenModal';
import {
  CHANGE_PASSWORD,
  ENTER_RECOVERY_TOKEN,
  SEND_RECOVERY_EMAIL,
  LOGIN
} from '../../constants/modals.js';
import {
  PASSWORD_SUCCESSFULLY_CHANGED,
} from '../../constants/successMessages.js';

import { NOT_FOUND } from '../../constants/errorMessages';

class PasswordRecoveryManager extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loginEmail: '',
      loginPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      recoveryToken: ''
    };

    this.onChange = this.onChange.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.verifyUserPassword = this.verifyUserPassword.bind(this);
    this.handleSubmitRecoveryToken = this.handleSubmitRecoveryToken.bind(this);
    this.handleSubmitRecoveryEmail = this.handleSubmitRecoveryEmail.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
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

    this.props.dispatch(closeModal(modal));
  }

  handleSubmitRecoveryEmail(token) {
    const email = { email: this.state.recoveryEmail };
    requester.sendRecoveryEmail(email, token).then(res => {
      if (res.success) {
        this.closeModal(SEND_RECOVERY_EMAIL);
        this.openModal(ENTER_RECOVERY_TOKEN);
      } else {
        NotificationManager.warning(INVALID_EMAIL, '', LONG);
      }
    });
  }

  handleSubmitRecoveryToken() {
    requester.sendRecoveryToken([`token=${this.state.recoveryToken}`]).then(res => {
      if (res.success) {
        this.closeModal(ENTER_RECOVERY_TOKEN);
        this.openModal(CHANGE_PASSWORD);
      } else {
        NotificationManager.warning(INVALID_SECURITY_CODE, '', LONG);
      }
    });
  }

  verifyUserPassword() {
    const { newPassword, confirmNewPassword } = this.state;
    if (newPassword !== confirmNewPassword) {
      NotificationManager.warning(PASSWORDS_DONT_MATCH, '', LONG);
    } else if (newPassword.length < 8 || newPassword.length > 30) {
      NotificationManager.warning(INVALID_PASSWORD, '', LONG);
    } else if (!newPassword.match('^([^\\s]*[a-zA-Z]+.*?[0-9]+[^\\s]*|[^\\s]*[0-9]+.*?[a-zA-Z]+[^\\s]*)$')) {
      NotificationManager.warning(PROFILE_PASSWORD_REQUIREMENTS, '', LONG);
    } else {
      executeWithToken(this.handlePasswordChange);
    }
  }

  handlePasswordChange(token) {
    const postObj = {
      token: this.state.recoveryToken,
      password: this.state.newPassword,
    };

    requester.sendNewPassword(postObj, token).then(res => {
      if (res.success) {
        this.closeModal(CHANGE_PASSWORD);
        this.openModal(LOGIN);
        NotificationManager.success(PASSWORD_SUCCESSFULLY_CHANGED, '', LONG);
      } else {
        NotificationManager.error(NOT_FOUND, '', LONG);
      }
    });
  }

  render() {
    return (
      <React.Fragment>
        <SendRecoveryEmailModal 
          isActive={this.props.isActive[SEND_RECOVERY_EMAIL]} 
          openModal={this.openModal}
          closeModal={this.closeModal} 
          recoveryEmail={this.state.recoveryEmail} 
          handleSubmitRecoveryEmail={() => executeWithToken(this.handleSubmitRecoveryEmail)} 
          onChange={this.onChange} 
        />
        <EnterRecoveryTokenModal 
          isActive={this.props.isActive[ENTER_RECOVERY_TOKEN]} 
          openModal={this.openModal} 
          closeModal={this.closeModal} 
          onChange={this.onChange} 
          recoveryToken={this.state.recoveryToken} 
          handleSubmitRecoveryToken={this.handleSubmitRecoveryToken} 
        />
        <ChangePasswordModal 
          isActive={this.props.isActive[CHANGE_PASSWORD]}
          openModal={this.openModal} 
          closeModal={this.closeModal} 
          newPassword={this.state.newPassword} 
          confirmNewPassword={this.state.confirmNewPassword} 
          onChange={this.onChange} 
          handlePasswordChange={this.verifyUserPassword} 
        />
      </React.Fragment>
    );
  }
}

PasswordRecoveryManager.propTypes = {
  // start Router props
  location: PropTypes.object,
  history: PropTypes.object,

  // start Redux props
  dispatch: PropTypes.func,
  isActive: PropTypes.object,
};

function mapStateToProps(state) {
  const { modalsInfo } = state;
  return {
    isActive: isActive(modalsInfo)
  };
}

export default withRouter(connect(mapStateToProps)(PasswordRecoveryManager));