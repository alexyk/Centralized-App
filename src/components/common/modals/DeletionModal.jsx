
import React from 'react';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

function DeletionModal(props) {
  return (
    <div>
      <Modal show={true} onHide={props.onHide} className="modal fade myModal">
        <Modal.Header>
          <button type="button" className="close" onClick={props.onHide}>&times;</button>
          <h2>Delete Listing</h2>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete &quot;{props.deletingName}&quot;?</p>
          {props.isDeleting
            ? <div className="loader"></div>
            : <form onSubmit={(e) => {
              e.preventDefault();
              props.handleDeleteListing();
            }}>
              <button type="submit" className="btn">Delete</button>
              <button onClick={(e) => { e.preventDefault(); props.onHide(); }} className="btn">Cancel</button>
            </form>
          }
        </Modal.Body>
      </Modal>
    </div>
  );
}

DeletionModal.propTypes = {
  isActive: PropTypes.bool,
  deletingId: PropTypes.number,
  deletingName: PropTypes.string,
  onHide: PropTypes.func,
  onOpen: PropTypes.func,
  filterListings: PropTypes.func,
};

export default DeletionModal;