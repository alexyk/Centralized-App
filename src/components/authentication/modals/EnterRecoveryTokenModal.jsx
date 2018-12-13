import { Config } from '../../../config';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';
import { ENTER_RECOVERY_TOKEN } from '../../../constants/modals.js';

function EnterRecoveryTokenModal(props) {
  return (
    <React.Fragment>
      <Modal show={props.isActive} onHide={e => props.closeModal(ENTER_RECOVERY_TOKEN, e)} className="modal fade myModal">
        <Modal.Header>
          <h1>Recover your password (2)</h1>
          <button type="button" className="close" onClick={(e) => props.closeModal(ENTER_RECOVERY_TOKEN, e)}>&times;</button>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={(e) => { e.preventDefault(); props.handleSubmitRecoveryToken(); }}>
            <p>A confirmation email has been sent. To enter a new password open the link from your email or enter the security code in the field below. </p>
            <div className="input-container">
              <img src={Config.getValue('basePath') + 'images/login-mail.png'} className="email-image" alt="email" />
              <input type="text" name="recoveryToken" value={props.recoveryToken} onChange={props.onChange} className="with-icon" placeholder="Security Code" />
            </div>

            <button type="submit" className="button">Proceed to Password Change</button>
            <div className="clearfix"></div>
          </form>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}

EnterRecoveryTokenModal.propTypes = {
  recoveryToken: PropTypes.string,
  openModal: PropTypes.func,
  closeModal: PropTypes.func,
  isActive: PropTypes.bool,
  onChange: PropTypes.func,
  handleSubmitRecoveryToken: PropTypes.func
};

export default EnterRecoveryTokenModal;