import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import { PASSWORD_PROMPT, RECOVER_WALLET } from '../../../constants/modals.js';
import { Config } from '../../../config.js';

function WalletPasswordModal(props) {

  return (
    <React.Fragment>
      <Modal show={props.isActive} onHide={e => props.closeModal(PASSWORD_PROMPT, e)} className="modal fade myModal">
        <Modal.Header>
          <h1>{props.text}</h1>
          <button type="button" className="close" onClick={(e) => props.closeModal(PASSWORD_PROMPT, e)}>&times;</button>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={(e) => { e.preventDefault(); props.handleSubmit(); }}>
            <div className="input-container">
              <img src={Config.getValue('basePath') + 'images/login-pass.png'} className="password-image" alt="pass" />
              <input type="password" placeholder={props.placeholder} name="password" value={props.password} className="with-icon" onChange={props.onChange} required/>
            </div>
            <button type="submit" className="button">Confirm</button>
          </form>

          <hr />
          <div className="login-sign">
            Forgot your password? <a onClick={(e) => { props.closeModal(PASSWORD_PROMPT, e); props.openModal(RECOVER_WALLET, e); }}>Recover</a>
          </div>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}

WalletPasswordModal.propTypes = {
  password: PropTypes.string,
  text: PropTypes.string,
  placeholder: PropTypes.string,
  openModal: PropTypes.func,
  closeModal: PropTypes.func,
  onChange: PropTypes.func,
  handleSubmit: PropTypes.func,
  isActive: PropTypes.bool
};

export default WalletPasswordModal;
