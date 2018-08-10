import '../../../../styles/css/components/profile/me/profile-verification.css';

import { CAPTURE_IMAGE } from '../../../../constants/modals.js';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';
import Webcam from 'react-webcam';

class CaptureImageModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const props = this.props;
    return (
      <div>
        <Modal show={props.isActive} onHide={() => props.closeModal(CAPTURE_IMAGE)} className="modal fade myModal">
          <Modal.Header>
            <h1>Capture Image</h1>
            <button type="button" className="close" onClick={() => props.closeModal(CAPTURE_IMAGE)}>&times;</button>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={(e) => { e.preventDefault(); props.closeModal(CAPTURE_IMAGE); props.onCaptureDrop(); }}>
              <Webcam
                className="webcam"
                audio={false}
                screenshotFormat="image/jpeg"
                ref={(cam) => props.setRef(cam)}
              />

              <button type="submit" className="btn btn-primary">Capture</button>
              <div className="clearfix"></div>
            </form>

          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

CaptureImageModal.propTypes = {
  closeModal: PropTypes.func,
  isActive: PropTypes.bool
};

export default CaptureImageModal;
