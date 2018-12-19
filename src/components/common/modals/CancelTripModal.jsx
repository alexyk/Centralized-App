import React from 'react';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { CANCEL_TRIP_MODAL } from '../../../constants/modals.js';

function CancelTripModal(props) {
  return (
    <React.Fragment>
      <Modal show={props.isActive} onHide={e => props.onClose(CANCEL_TRIP_MODAL, e)} className="modal fade myModal">
        <Modal.Header>
          <h1>Cancel Trip</h1>
          <button type="button" className="close" onClick={(e) => props.onClose(CANCEL_TRIP_MODAL, e)}>&times;</button>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={(e) => { e.preventDefault(); props.handleCancelTrip(); props.onClose(CANCEL_TRIP_MODAL); }}>
            <div className="modal-input-label">Tell your host why do you want to cancel your trip.</div>
            <textarea rows="4" name="cancellationText" value={props.cancellationText} onChange={props.onChange} required></textarea>
            <button type="submit" className="button">Send message</button>
            <div className="clearfix"></div>
          </form>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}

CancelTripModal.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  onClose: PropTypes.func,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  title: PropTypes.string,
  text: PropTypes.string,
  isActive: PropTypes.bool,
  closeModal: PropTypes.func,
};

export default CancelTripModal;