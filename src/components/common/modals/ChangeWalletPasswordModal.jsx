import React from 'react';
import { Modal } from 'react-bootstrap';
import ReCAPTCHA from 'react-google-recaptcha';
import { NotificationManager } from 'react-notifications';
import PropTypes from 'prop-types';
import validator from 'validator';
import { Config } from '../../../config';
import { CHANGE_WALLET_PASSWORD } from '../../../constants/modals';
import { LONG } from '../../../constants/notificationDisplayTimes.js';
import { WALLET_INVALID_PASSWORD_LENGTH } from '../../../constants/warningMessages.js';

import '../../../styles/css/components/modals/modal.css';

function ChangeWalletPasswordModal(props) {

  let captcha;

  const submitPassword = () => {
    if (props.walletPassword !== props.repeatWalletPassword) {
      NotificationManager.warning('Passwords do not match.', '', LONG);
    } else if (props.walletPassword.length < 8) {
      NotificationManager.warning(WALLET_INVALID_PASSWORD_LENGTH, '', LONG);
    } else if (!validator.matches(props.walletPassword, /[a-zA-Z]+/)) {
      NotificationManager.warning('Passwords should contain at least one character.', '', LONG);
    } else if (!validator.matches(props.walletPassword, /[@$!%*#?&]+/)) {
      NotificationManager.warning('Passwords should contain at least one special character.', '', LONG);
    } else {
      captcha.execute();
    }
  };

  return (
    <div>
      <Modal show={props.isActive} className="modal fade myModal">
        <Modal.Header>
          <h1>Recover your password (2)</h1>
          <button type="button" className="close" onClick={(e) => props.closeModal(CHANGE_WALLET_PASSWORD, e)}>&times;</button>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={(e) => { e.preventDefault(); submitPassword(); }}>
            <div className="input-container">
              <img src={Config.getValue('basePath') + 'images/login-pass.png'} className='password-image' alt="pass" />
              <input autoFocus type="password" name="walletPassword" value={props.walletPassword} onChange={props.onChange} className="with-icon" placeholder="Password" />
            </div>
            <div className="input-container">
              <img src={Config.getValue('basePath') + 'images/login-pass.png'} className='password-image' alt="pass" />
              <input type="password" name="repeatWalletPassword" value={props.repeatWalletPassword} onChange={props.onChange} className="with-icon" placeholder="Re-enter password" />
            </div>
            <div className="modal-input-label">Your password shoud:</div>
            <ul className="password-requirements">
              <li>be at least 8 characters long</li>
              <li>contain at least one symbol</li>
              <li>contain at least one character</li>
            </ul>
            <hr />
            <p><span className="important-text">Important:</span> Your LOC wallet is Blockchain based and you are the only person to have access to it. It will not be hosted on our server. When you are adding funds to it, your funds will be in your complete control and possession therefore It is very important not to share your wallet password with anyone. For security reasons we will not store this password.</p>
            <button type="submit" className="btn btn-primary">Save Password</button>
            <div className="clearfix"></div>
          </form>

          <ReCAPTCHA
            ref={el => captcha = el}
            size="invisible"
            sitekey={Config.getValue('recaptchaKey')}
            onChange={token => { props.updateWalletJson(token); captcha.reset(); }}
          />

        </Modal.Body>
      </Modal>
    </div>
  );
}

ChangeWalletPasswordModal.propTypes = {
  walletPassword: PropTypes.string,
  repeatWalletPassword: PropTypes.string,
  onChange: PropTypes.func,
  openModal: PropTypes.func,
  closeModal: PropTypes.func,
  isActive: PropTypes.bool,
  updateWalletJson: PropTypes.func,
};

export default ChangeWalletPasswordModal;