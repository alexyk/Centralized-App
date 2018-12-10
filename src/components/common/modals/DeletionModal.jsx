
import React from 'react';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

function DeletionModal(props) {
  return (
    <React.Fragment>
      <Modal show={props.isActive} onHide={props.onHide} className="modal fade myModal">
        <Modal.Header>
          <h1>Delete Listing</h1>
          <button type="button" className="close" onClick={props.onHide}>&times;</button>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete &quot;{props.deletingName}&quot;?</p>
          {props.isDeleting
            ? <div className="loader"></div>
            : <form onSubmit={(e) => {
              e.preventDefault();
              props.handleDeleteListing();
            }}>
              <button type="submit" className="button">Delete</button>
              <button onClick={(e) => { e.preventDefault(); props.onHide(); }} className="button">Cancel</button>
            </form>
          }
        </Modal.Body>
      </Modal>
    </React.Fragment>
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