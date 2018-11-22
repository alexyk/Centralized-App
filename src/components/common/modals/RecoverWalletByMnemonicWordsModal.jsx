import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';
import { RECOVER_WALLET } from '../../../constants/modals.js';

function RecoverWalletByMnemonicWordsModal(props) {

  const handleEnterKeyPress = (event) => {
    if (event.key === 'Enter') {
      props.recoverPassword();
    }
  };

  return (
    <React.Fragment>
      <Modal show={props.isActive} className="modal fade myModal">
        <Modal.Header>
          <h1>Recover Wallet Password</h1>
          <button type="button" className="close" onClick={() => props.closeModal(RECOVER_WALLET)}>&times;</button>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={(e) => { e.preventDefault(); props.recoverPassword(); }}>
            <div className="modal-input-label">Enter your wallet mnemonic words:</div>
            <textarea name="mnemonicWords" onChange={props.onChange} value={props.mnemonicWords} autoFocus onKeyPress={handleEnterKeyPress} />
            <button type="submit" className="btn btn-primary">Recover</button>
          </form>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}

RecoverWalletByMnemonicWordsModal.propTypes = {
  mnemonicWords: PropTypes.string,
  onChange: PropTypes.func,
  openModal: PropTypes.func,
  closeModal: PropTypes.func,
  isActive: PropTypes.bool,
  recoverPassword: PropTypes.func,
};

export default RecoverWalletByMnemonicWordsModal;