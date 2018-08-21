import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';

import { Config } from '../../../config.js';

import { PASSWORD_PROMPT } from '../../../constants/modals.js';

function PasswordModal(props) {

  return (
    <div>
      <Modal show={props.isActive} onHide={e => props.closeModal(PASSWORD_PROMPT, e)} className="modal fade myModal">
        <Modal.Header>
          <h1>{props.text}</h1>
          <button type="button" className="close" onClick={(e) => props.closeModal(PASSWORD_PROMPT, e)}>&times;</button>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={(e) => { e.preventDefault(); props.handleSubmit(); }}>
            <div className="input-container">
              <img src={Config.getValue('basePath') + 'images/login-pass.png'} className="password-image" alt="pass" />
              <input type="password" placeholder={props.placeholder} name="password" value={props.password} className="with-icon" onChange={props.onChange} />
            </div>
            <button type="submit" className="btn btn-primary">Confirm</button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

PasswordModal.propTypes = {
  password: PropTypes.string,
  text: PropTypes.string,
  placeholder: PropTypes.string,
  openModal: PropTypes.func,
  closeModal: PropTypes.func,
  onChange: PropTypes.func,
  handleSubmit: PropTypes.func,
  isActive: PropTypes.bool
};

export default PasswordModal;