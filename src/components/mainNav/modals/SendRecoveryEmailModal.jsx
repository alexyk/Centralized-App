import { Config } from '../../../config';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';
import { SEND_RECOVERY_EMAIL, ENTER_RECOVERY_TOKEN } from '../../../constants/modals.js';

import '../../../styles/css/components/modals/modal.css';

function SendRecoveryEmailModal(props) {

  return (
    <div>
      <Modal show={props.isActive} onHide={e => props.closeModal(SEND_RECOVERY_EMAIL, e)} className="modal fade myModal">
        <Modal.Header>
          <h1>Recover your password</h1>
          <button type="button" className="close" onClick={(e) => props.closeModal(SEND_RECOVERY_EMAIL, e)}>&times;</button>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={(e) => { e.preventDefault(); props.handleSubmitRecoveryEmail(); }}>
            <div className="input-container">
              <img src={Config.getValue('basePath') + 'images/login-mail.png'} className="email-image" alt="email" />
              <input type="email" name="recoveryEmail" value={props.recoveryEmail} onChange={props.onChange} className="with-icon" placeholder="Email address" />
            </div>

            <div className="login-sign">
              <p>Already sent an email? Enter your security <a onClick={(e) => { e.preventDefault(); props.closeModal(SEND_RECOVERY_EMAIL); props.openModal(ENTER_RECOVERY_TOKEN); }}>token</a>.</p>
            </div>

            <button type="submit" className="btn btn-primary">Send email</button>
            <div className="clearfix"></div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

SendRecoveryEmailModal.propTypes = {
  recoveryEmail: PropTypes.string,
  openModal: PropTypes.func,
  closeModal: PropTypes.func,
  onChange: PropTypes.func,
  handleSubmitRecoveryEmail: PropTypes.func,
  isActive: PropTypes.bool
};

export default SendRecoveryEmailModal;