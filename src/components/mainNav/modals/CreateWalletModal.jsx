import { NotificationManager } from 'react-notifications';
import { Config } from '../../../config';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';
import validator from 'validator';
import { Wallet } from '../../../services/blockchain/wallet.js';
import { CREATE_WALLET, SAVE_WALLET } from '../../../constants/modals.js';
import { WALLET_INVALID_PASSWORD_LENGTH } from '../../../constants/warningMessages.js';
import { CREATING_WALLET } from '../../../constants/infoMessages.js';
import { LONG } from '../../../constants/notificationDisplayTimes.js';

import '../../../styles/css/components/modals/modal.css';

function CreateWalletModal(props) {
  const submitPassword = () => {
    if (props.walletPassword !== props.repeatWalletPassword) {
      NotificationManager.warning('Passwords do not match.', '', LONG);
    } else if (props.walletPassword.length < 8) {
      NotificationManager.warning(WALLET_INVALID_PASSWORD_LENGTH, '', LONG);
    } else if (!validator.matches(props.walletPassword, /[a-zA-Z]+/)) {
      NotificationManager.warning('Passwords should contain at least one character.', '', LONG);
    } else if (!validator.matches(props.walletPassword, /[$@$!%*#?&]+/)) {
      NotificationManager.warning('Passwords should contain at least one special character.', '', LONG);
    } else {
      try {
        NotificationManager.info(CREATING_WALLET, '', LONG);
        Wallet.createFromPassword(props.walletPassword).then((wallet) => {
          localStorage.setItem('walletAddress', wallet.address);
          localStorage.setItem('walletMnemonic', wallet.mnemonic);
          localStorage.setItem('walletJson', JSON.stringify(wallet.jsonFile));
          props.closeModal(CREATE_WALLET);
          props.openModal(SAVE_WALLET);
        });
      } catch (error) {
        NotificationManager.info(error, '', LONG);
        console.log(error);
      }
    }
  };

  return (
    <div>
      <Modal show={true} className="modal fade myModal">
        <Modal.Header>
          <h1>Please setup your personal wallet password</h1>
          <button type="button" className="close" onClick={(e) => props.closeModal(CREATE_WALLET, e)}>&times;</button>
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
            <p>Your LOC wallet is Blockchain based and you are the only person to have access to it. It will not be hosted on our server. When you are adding funds to it, your funds will be in your complete control and possession therefore It is very important not to share your wallet password with anyone. For security reasons we will not store this password and there will be no way for you to recover it through our site.</p>
            <button type="submit" className="btn btn-primary">Submit password</button>
            <div className="clearfix"></div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

CreateWalletModal.propTypes = {
  walletPassword: PropTypes.string,
  openModal: PropTypes.func,
  closeModal: PropTypes.func,
  onChange: PropTypes.func,
  isActive: PropTypes.bool
};

export default CreateWalletModal;