import '../../../../styles/css/components/profile/me/profile-verification.css';

import { CAPTURE_IMAGE } from '../../../../constants/modals.js';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';

class CaptureImageModal extends React.Component {
  render() {
    const props = this.props;
    return (
      <React.Fragment>
        <Modal show={props.isActive} onHide={() => props.closeModal(CAPTURE_IMAGE)} className="modal fade myModal">
          <Modal.Header>
            <h1>Capture Image</h1>
            <button type="button" className="close" onClick={() => props.closeModal(CAPTURE_IMAGE)}>&times;</button>
          </Modal.Header>
          <Modal.Body>
            {props.children}
          </Modal.Body>
        </Modal>
      </React.Fragment>
    );
  }
}

CaptureImageModal.propTypes = {
  closeModal: PropTypes.func,
  isActive: PropTypes.bool
};

export default CaptureImageModal;
