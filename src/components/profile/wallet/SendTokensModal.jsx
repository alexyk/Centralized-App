import { Modal } from "react-bootstrap";
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { sendTokens } from '../../../services/payment/loc';
import { connect } from "net";

class SendTokensModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipientAddress: '',
      password: '',
      locAmount: 0,
      showModal: false
    }

    this.onChange = this.onChange.bind(this);
    this.validateAmount = this.validateAmount.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  closeModal() {
    this.setState({
      showModal: this.props.showModal
    });
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  validateAmount(e) {
    const value = e.target.value;

    if (value.match('/\d+/g')) {
      this.setState({
        [e.target.name]: value
      })
    }
  }

  sendTokens() {
    sendTokens(this.state.password, this.state.recipient, this.state.locAmount, this.props.flightReservationId);
  }

  render() {
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
                <div className="loc-address">
                  <label htmlFor="recipient-loc-address">Recipient ETH/LOC address</label>
                  <input id="recipient-loc-address" name="recipientAddress" onChange={this.onChange} type="text" placeholder="Valid ERC-20 compliant wallet address" />
                </div>
                <div className="name">
                  <label htmlFor="loc-amount">Send LOC Amount</label>
                  <input id="loc-amount" name="locAmount" onChange={this.validateAmount} type="text" placeholder="0.000" />
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
  showModal: PropTypes.bool
}
export default SendTokensModal;
