import '../../../../styles/css/components/modals/modal.css';

import { CONFIRM_PRICE_UPDATE } from '../../../../constants/modals';

import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';

function PriceUpdatedModal(props) {

  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }

    props.openModal(CONFIRM_PRICE_UPDATE, e);
  };

  return (
    <React.Fragment>
      <Modal show={props.isActive} className="modal fade myModal">
        <Modal.Header>
          <h1>Warning!</h1>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={ handleSubmit } >
            <p style={{ textAlign: 'justify', marginTop: '0' }}>
              You already have one <span className="important-text">active</span> booking with status <span className="important-text">PENDING</span> in your dashboard. This booking is still being processed and is pending confirmation from the hotel.
              Please, proceed <span className="important-text">ONLY</span> if you are trying to book a different stay. Otherwise you might generate a duplicate booking which might result in double spending of your LOC tokens.
              Please, confirm if you want to book a different stay from the one which is currently Pending.
            </p>
            <button type="submit" className="button">Yes, I want to book a different stay</button>
            <button className="button" onClick={(e) => props.closeModal(CONFIRM_PRICE_UPDATE, e, true)}>Cancel</button>
            <div className="clearfix"></div>
          </form>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}

PriceUpdatedModal.propTypes = {
  openModal: PropTypes.func,
  closeModal: PropTypes.func
};

export default PriceUpdatedModal  ;
