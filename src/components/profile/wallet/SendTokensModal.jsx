import { Modal } from "react-bootstrap";
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { sendTokens } from '../../../services/payment/loc';
import { NotificationManager } from 'react-notifications';

class SendTokensModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipientAddress: '0xa99c523BfC2E1374ac528FE39e4dD7c35F6C1d46',
      password: '',
      locAmount: 0,
      showModal: false
    }

    this.onChange = this.onChange.bind(this);
    this.validateAmount = this.validateAmount.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  closeModal() {
    console.log(this.state);
    this.setState({
      showModal: this.props.showModal
    });
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  validateAmount(value) {
    let success = true;
    let message = '';

    if (!value.match('/\d+/g')) {
      success = false;
      message = 'Amount is not correct!';
    } else if (!value) {
      success = false;
      message = 'Missing value';
    }

    return {
      success: success,
      message: message
    }
  }

  sendTokens() {
    const validateValues = validateValues(this.state);
    if (validateValues.success) {
      sendTokens(this.state.password, this.state.recipient, this.state.locAmount, this.props.flightReservationId);
    } else {
      NotificationManager.warning(validateValues.message, 'Warning');
    }
  }

  render() {
    console.log(this.props.result)
    return (
      <Fragment>
        <Modal
          show={this.props.showModal}
          onHide={() => this.closeModal()}
          className="modal fade myModal"
        >
          <form onSubmit={e => { e.preventDefault(); this.sendTokens(); }}>
            <Modal.Header closeButton>
              <h1>Send Tokens</h1>
            </Modal.Header>
            <Modal.Body>
                <div className="name">
                  <label htmlFor="loc-amount">Send LOC Amount</label>
                  <input id="loc-amount" name="locAmount" onChange={this.onChange} type="text" placeholder="0.000" value={this.props.result.price.locPrice.toFixed(2)}/>
                </div>
                <div className="name">
                  <label htmlFor="password">Your wallet password</label>
                  <input id="password" name="password" onChange={this.onChange} type="password" placeholder="The password is needed to unlock your wallet for a single transaction" />
                </div>
            </Modal.Body>
            <Modal.Footer>
              <div>
                <button className="button" type="submit">Send Tokens</button>
              </div>
            </Modal.Footer>
          </form>
        </Modal>
      </Fragment>
    );
  }
}

SendTokensModal.props = {
  flightReservationId: PropTypes.string,
  showModal: PropTypes.bool,
  result: PropTypes.object
}
export default SendTokensModal;
