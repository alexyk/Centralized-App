import { Config } from '../../../config';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';
import { LOGIN, REGISTER, SEND_RECOVERY_EMAIL } from '../../../constants/modals.js';

function LoginModal(props) {
  const { isLogging } = props; 
  return (
    <React.Fragment>
      <Modal show={props.isActive} onHide={() => props.closeModal(LOGIN)} className="modal fade myModal">
        <Modal.Header>
          <h1>Login</h1>
          <button type="button" className="close" onClick={() => props.closeModal(LOGIN)}>&times;</button>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={(e) => { e.preventDefault(); props.handleLogin(); }}>
            <div className="input-container">
              <img src={Config.getValue('basePath') + 'images/login-mail.png'} className="email-image" alt="mail" />
              <input type="email" name="loginEmail" value={props.loginEmail} onChange={props.onChange} className="with-icon" placeholder="Email address" required autoFocus />
            </div>
            <div className="input-container">
              <img src={Config.getValue('basePath') + 'images/login-pass.png'} className="password-image" alt="pass" />
              <input type="password" name="loginPassword" value={props.loginPassword} onChange={props.onChange} className="with-icon" placeholder="Password" />
            </div>
            <div className="remember-me">
              <label><input type="checkbox" value="" id="login-remember" />Remember Me</label>
            </div>
            <button type="submit" className="button" disabled={isLogging}>{isLogging ? 'Logging in...' : 'Login'}</button>
            <div className="clearfix"></div>
          </form>

          <hr />
          <div className="login-sign">
            Don’t have an account? <a href=" " onClick={() => { props.closeModal(LOGIN); props.openModal(REGISTER); }}>Sign up</a>
            . Forgot your password? <a href=" " onClick={(e) => { props.closeModal(LOGIN, e); props.openModal(SEND_RECOVERY_EMAIL, e); }}>Recover</a>
          </div>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}

LoginModal.propTypes = {
  loginEmail: PropTypes.string,
  loginPassword: PropTypes.string,
  handleLogin: PropTypes.func,
  onChange: PropTypes.func,
  openModal: PropTypes.func,
  closeModal: PropTypes.func,
  isActive: PropTypes.bool,
  isLogging: PropTypes.bool
};

export default LoginModal;