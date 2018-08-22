import { Config } from '../../../config';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';
import { EMAIL_VERIFICATION } from '../../../constants/modals.js';

import '../../../styles/css/components/modals/modal.css';

function EmailVerificationModal(props) {

  return (
    <div>
      <Modal show={props.isActive} onHide={() => props.closeModal(EMAIL_VERIFICATION)} className="modal fade myModal">
        <Modal.Header>
          <h1>Email verification</h1>
          <button type="button" className="close" onClick={() => props.closeModal(EMAIL_VERIFICATION)}>&times;</button>
        </Modal.Header>
        <Modal.Body>
          <p>Please send us the token that you have received on your email.</p>
          <form onSubmit={(e) => { e.preventDefault(); props.handleLogin(); }}>
            <div className="input-container">
              <img src={Config.getValue('basePath') + 'images/login-mail.png'} className="email-image" alt="mail" />
              <input type="text" name="emailVerificationToken" value={props.emailVerificationToken} onChange={props.onChange} className="with-icon" placeholder="Email verification token" required autoFocus />
            </div>

            <button type="submit" className="btn btn-primary">Send Token</button>
            <div className="clearfix"></div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

EmailVerificationModal.propTypes = {
  emailVerificationToken: PropTypes.string,
  onChange: PropTypes.func,
  openModal: PropTypes.func,
  closeModal: PropTypes.func,
  handleLogin: PropTypes.func,
  isActive: PropTypes.bool
};

export default EmailVerificationModal;