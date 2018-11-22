import React from 'react';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

function CancellationModal(props) {
  return (
    <React.Fragment>
      <Modal show={props.isActive} onHide={e => props.onClose(props.name, e)} className="modal fade myModal">
        <Modal.Header>
          <h1>{props.title}</h1>
          <button type="button" className="close" onClick={(e) => props.onClose(props.name, e)}>&times;</button>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={(e) => { e.preventDefault(); props.onSubmit(); props.onClose(props.name); }}>
            <div className="modal-input-label">{props.text}</div>
            <textarea rows="4" name="cancellationText" value={props.value} onChange={props.onChange} required></textarea>
            <button type="submit" className="btn btn-primary">Send message</button>
            <div className="clearfix"></div>
          </form>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}

CancellationModal.propTypes = {
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

export default CancellationModal;