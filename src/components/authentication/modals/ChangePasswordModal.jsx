import { Config } from '../../../config';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';
import { CHANGE_PASSWORD } from '../../../constants/modals.js';

function ChangePasswordModal(props) {

  return (
    <React.Fragment>
      <Modal show={props.isActive} onHide={e => props.closeModal(CHANGE_PASSWORD, e)} className="modal fade myModal">
        <Modal.Header>
          <h1>Recover your password (3)</h1>
          <button type="button" className="close" onClick={(e) => props.closeModal(CHANGE_PASSWORD, e)}>&times;</button>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={(e) => { e.preventDefault(); props.handlePasswordChange(); }}>
            <div className="input-container">
              <img src={Config.getValue('basePath') + 'images/login-pass.png'} className="password-image" alt="password" />
              <input type="password" name="newPassword" value={props.newPassword} onChange={props.onChange} className="with-icon" placeholder="New password" />
            </div>

            <div className="input-container">
              <img src={Config.getValue('basePath') + 'images/login-pass.png'} className="password-image" alt="re-enter password" />
              <input type="password" name="confirmNewPassword" value={props.confirmNewPassword} onChange={props.onChange} className="with-icon" placeholder="Re-enter password" />
            </div>

            <button type="submit" className="button">Save Password</button>
            <div className="clearfix"></div>
          </form>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}

ChangePasswordModal.propTypes = {
  newPassword: PropTypes.string,
  confirmNewPassword: PropTypes.string,
  onChange: PropTypes.func,
  openModal: PropTypes.func,
  closeModal: PropTypes.func,
  handlePasswordChange: PropTypes.func,
  isActive: PropTypes.bool
};

export default ChangePasswordModal;