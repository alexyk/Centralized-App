import { AIRDROP_LOGIN, REGISTER, SEND_RECOVERY_EMAIL } from '../../../constants/modals.js';

import { Config } from '../../../config';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
// import ReCAPTCHA from 'react-google-recaptcha';
import React from 'react';

let captcha = undefined;

function AirdropLoginModal(props) {

  return (
    <React.Fragment>
      <Modal show={props.isActive} onHide={() => props.closeModal(AIRDROP_LOGIN)} className="modal fade myModal">
        <Modal.Header>
          <h1>Login airdrop</h1>
          <button type="button" className="close" onClick={() => props.closeModal(AIRDROP_LOGIN)}>&times;</button>
        </Modal.Header>
        <Modal.Body>
          <div>Please first login in Locktrip page</div>
          <form onSubmit={(e) => { e.preventDefault(); captcha.execute(); }}>
            <div className="input-container" style={{ marginTop: '10px' }}>
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

            <button type="submit" className="btn btn-primary">Login</button>
            <div className="clearfix"></div>
          </form>

          <hr />
          <div className="login-sign">
            Don’t have an account? <a onClick={() => { props.closeModal(AIRDROP_LOGIN); props.openModal(REGISTER); }}>Sign up</a>
            . Forgot your password? <a onClick={(e) => { props.closeModal(AIRDROP_LOGIN, e); props.openModal(SEND_RECOVERY_EMAIL, e); }}>Recover</a>
          </div>
        </Modal.Body>
      </Modal>

      {/* <ReCAPTCHA
        ref={el => captcha = el}
        size="invisible"
        sitekey={Config.getValue('recaptchaKey')}
        onChange={(token) => { props.handleLogin(token); captcha.reset(); }}
      /> */}
    </React.Fragment>
  );
}

AirdropLoginModal.propTypes = {
  loginEmail: PropTypes.string,
  loginPassword: PropTypes.string,
  handleLogin: PropTypes.func,
  onChange: PropTypes.func,
  openModal: PropTypes.func,
  closeModal: PropTypes.func,
  isActive: PropTypes.bool
};

export default AirdropLoginModal;
