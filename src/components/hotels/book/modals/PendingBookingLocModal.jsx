import '../../../../styles/css/components/modals/modal.css';

import { PENDING_BOOKING_LOC, CONFIRM_PAYMENT_WITH_LOC } from '../../../../constants/modals.js';

import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';

function PendingBookingLocModal(props) {

  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }

    props.closeModal(PENDING_BOOKING_LOC, e);
    props.openModal(CONFIRM_PAYMENT_WITH_LOC, e);
  };

  return (
    <React.Fragment>
      <Modal show={props.isActive} className="modal fade myModal">
        <Modal.Header>
          <h1>Warning!</h1>
          <button type="button" className="close" onClick={(e) => props.closeModal(PENDING_BOOKING_LOC, e, true)}>&times;</button>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={ handleSubmit } >
            <p style={{ textAlign: 'justify', marginTop: '0' }}>
              You already have one <span className="important-text">active</span> booking with status <span className="important-text">PENDING</span> in your dashboard. This booking is still being processed and is pending confirmation from the hotel.
              Please, proceed <span className="important-text">ONLY</span> if you are trying to book a different stay. Otherwise you might generate a duplicate booking which might result in double spending of your LOC tokens.
              Please, confirm if you want to book a different stay from the one which is currently Pending.
            </p>
            <button type="submit" className="button">Yes, I want to book a different stay</button>
            <button className="button" onClick={(e) => props.closeModal(PENDING_BOOKING_LOC, e, true)}>Cancel</button>
            <div className="clearfix"></div>
          </form>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}

PendingBookingLocModal.propTypes = {
  walletPassword: PropTypes.string,
  openModal: PropTypes.func,
  closeModal: PropTypes.func,
  onChange: PropTypes.func,
  isActive: PropTypes.bool
};

export default PendingBookingLocModal;
