import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';

const modal = {
  current: 'showContactHostModal',
};

class ContactHostModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    if (e) {
      e.preventDefault();
    }

    const { id } = this.props;
    const { message } = this.state;
    this.props.handleContactHost(id, message); 
  }

  render() {
    return (
      <React.Fragment>
        <Modal show={this.props.isActive} onHide={e => this.props.closeModal(modal.current, e)} className="modal fade myModal">
          <Modal.Header>
            <h1>Contact Host</h1>
            <button type="button" className="close" onClick={e => this.props.closeModal(modal.current, e)}>&times;</button>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={(e) => { this.onSubmit(e); }}>
              <div className="input-container">
                <textarea rows="4" name="message" value={this.state.message} onChange={this.onChange}></textarea>
              </div>
              <button type="submit" className="button">Send message</button>
              <div className="clearfix"></div>
            </form>
          </Modal.Body>
        </Modal>
      </React.Fragment>
    );
  }
}

ContactHostModal.propTypes = {
  isActive: PropTypes.bool,
  closeModal: PropTypes.func,
  handleContactHost: PropTypes.func,
  match: PropTypes.object,
  id: PropTypes.string
};

export default withRouter(ContactHostModal);