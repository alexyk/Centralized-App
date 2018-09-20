import { NotificationManager } from 'react-notifications';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';
import { CONFIRM_WALLET, SAVE_WALLET } from '../../../constants/modals.js';
import { MNEMONIC_LAST_CALL, WRONG_MNEMONIC_WORDS } from '../../../constants/warningMessages.js';
import { LONG } from '../../../constants/notificationDisplayTimes.js';

import '../../../styles/css/components/modals/modal.css';

function ConfirmWalletModal(props) {
  const onWordsForget = () => {
    NotificationManager.warning(MNEMONIC_LAST_CALL, '', LONG);
    props.closeModal(CONFIRM_WALLET);
    props.openModal(SAVE_WALLET);
  };

  const handleSubmit = () => {
    if (props.mnemonicWords.trim() !== localStorage.walletMnemonic) {
      NotificationManager.warning(WRONG_MNEMONIC_WORDS, '', LONG);
      props.closeModal(CONFIRM_WALLET);
      props.openModal(SAVE_WALLET);
    } else {
      props.handleCreateWallet();
    }
  };

  const handleEnterKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div>
      <Modal show={props.isActive} className="modal fade myModal">
        <Modal.Header>
          <h1>Confirm Wallet Information</h1>
          <button type="button" className="close" onClick={(e) => props.closeModal(CONFIRM_WALLET, e)}>&times;</button>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <div className="modal-input-label">Enter your wallet mnemonic words:</div>
            <textarea name="mnemonicWords" onChange={props.handleMnemonicWordsChange} value={props.mnemonicWords} autoFocus onKeyPress={handleEnterKeyPress} />
            {!props.confirmedRegistration
              ? <button type="submit" className="btn btn-primary">Confirm Wallet</button>
              : <button className="btn btn-primary btn-book" disabled>Processing Registration...</button>
            }
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

ConfirmWalletModal.propTypes = {
  openModal: PropTypes.func,
  closeModal: PropTypes.func,
  handleCreateWallet: PropTypes.func,
  handleMnemonicWordsChange: PropTypes.func,
  mnemonicWords: PropTypes.string,
  isActive: PropTypes.bool,
  confirmedRegistration: PropTypes.bool
};

export default ConfirmWalletModal;