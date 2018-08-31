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
          <h1>Email Verification</h1>
          <button type="button" className="close" onClick={() => props.closeModal(EMAIL_VERIFICATION)}>&times;</button>
        </Modal.Header>
        <Modal.Body>
          <p>It seems that your email has not yet been verified. Email with a security code has been sent to you. Please enter the security code in the field below.</p>
          <form onSubmit={(e) => { e.preventDefault(); props.handleLogin(); }}>
            <div className="input-container">
              <input type="text" name="emailVerificationToken" value={props.emailVerificationToken} onChange={props.onChange} placeholder="Security Code" />
            </div>
            <button type="submit" className="btn btn-primary">Submit Security Code</button>
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