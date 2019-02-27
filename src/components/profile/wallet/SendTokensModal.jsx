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
      locAmount: 0
    }

    this.onChange = this.onChange.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  closeModal() {
    Modal.closeModal()
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  sendTokens() {
    sendTokens(this.state.password, this.state.recipient, this.state.locAmount);
  }

  render() {
    return (
      <Fragment>
        <Modal
          show={true}
          onHide={() => this.closeModal()}
          className="modal fade myModal"
        >
          <Modal.Header>
            <h1>Send Tokens</h1>
            <button
              type="button"
              className="close"
              onClick={() => this.closeModal()}
            >
              &times;
            </button>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={e => { e.preventDefault(); this.sendTokens(); }}>
              <div className="loc-address">
                <label htmlFor="recipient-loc-address">Recipient ETH/LOC address</label>
                <input id="recipient-loc-address" name="recipientAddress" onChange={this.onChange} type="text" placeholder="Valid ERC-20 compliant wallet address" />
              </div>
              <div className="name">
                <label htmlFor="loc-amount">Send LOC Amount</label>
                <input id="loc-amount" name="locAmount" onChange={this.onChange} type="number" placeholder="0.000" />
              </div>
              <div className="name">
                <label htmlFor="password">Your wallet password</label>
                <input id="password" name="password" onChange={this.onChange} type="password" placeholder="The password is needed to unlock your wallet for a single transaction" />
              </div>
              <div>
                <button className="button" type="submit">Send Tokens</button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </Fragment>
    );
  }
}


export default SendTokensModal;
