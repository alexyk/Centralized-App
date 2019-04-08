import React from 'react';
import {Modal} from 'react-bootstrap';
import PropTypes from 'prop-types';
import {CANCEL_TRIP_MODAL} from '../../../constants/modals.js';

function sendCancelRequest(e, props) {
  const value = e.target.value;
  props.onClose(CANCEL_TRIP_MODAL, e);

  if (value === '1') {
    props.sendCancelRequest();
  } else {
    props.onClose(CANCEL_TRIP_MODAL, e);
  }
}

function CancelTripModal(props) {
  return (
    <React.Fragment>
      <Modal show={props.isActive} onHide={e => props.onClose(CANCEL_TRIP_MODAL, e)} className="modal fade myModal">
        <Modal.Header>
          <h1>Cancelling your booking?</h1>
          <button type="button" className="close" onClick={(e) => props.onClose(CANCEL_TRIP_MODAL, e)}>&times;</button>
          <p>To check if refund is available as per the Cancellation Policy, please contact Custommer Support before
            proceeding with your cancellation.</p>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={(e) => {
            e.preventDefault();
          }}>
            <div className="modal-input-label">Are you sure you want to cancel?</div>
            <button type="submit" className="button" value="1" onClick={(e) => sendCancelRequest(e, props)}>YES, CANCEL
              MY BOOKING
            </button>
            <button type="submit" className="button" value="0" onClick={(e) => sendCancelRequest(e, props)}>No, I don't
              want to cancel
            </button>
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
