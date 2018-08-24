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
          <h1>Email Verification</h1>
          <button type="button" className="close" onClick={() => props.closeModal(EMAIL_VERIFICATION)}>&times;</button>
        </Modal.Header>
        <Modal.Body>
          <p>It seems that your email has not yet been verified. You need to verify your email before you can proceed with your booking.</p>
          <hr/>
          <form onSubmit={(e) => { e.preventDefault(); props.requestVerificationEmail(); }}>
            <button type="submit" className="btn btn-primary">Send Email</button>
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