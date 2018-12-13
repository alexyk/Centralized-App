import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';
import { SAVE_WALLET, CONFIRM_WALLET } from '../../../constants/modals.js';

function SaveWalletModal(props) {

  const handleFocus = (e) => {
    e.target.select();
  };

  const handleSubmit = () => {
    props.closeModal(SAVE_WALLET);
    props.openModal(CONFIRM_WALLET);
  };

  return (
    <React.Fragment>
      <Modal show={props.isActive} className="modal fade myModal">
        <Modal.Header>
          <h1>Save your wallet info</h1>
          <button type="button" className="close" onClick={(e) => props.closeModal(SAVE_WALLET, e)}>&times;</button>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-input-label">Wallet public address:</div>
          <input type="text" name="locAddress" onFocus={handleFocus} value={localStorage.walletAddress} />
          <div className="modal-input-label">Wallet mnemonic words:</div>
          <textarea name="mnemonic" onFocus={handleFocus} value={localStorage.walletMnemonic} />
          <input type="hidden" name="json" onFocus={handleFocus} value={localStorage.walletJson} />
          <p>You can use the mnemonic phrases to decrypt the wallet from external wallet manager such as MyEtherWallet or MetaMask. Save them carefully, they are irrecoverable.</p>
          <button className="button" onClick={handleSubmit}>Continue</button>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}

SaveWalletModal.propTypes = {
  openModal: PropTypes.func,
  closeModal: PropTypes.func,
  isActive: PropTypes.bool
};

export default SaveWalletModal;