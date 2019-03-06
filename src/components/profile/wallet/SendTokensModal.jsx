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
      showModal: this.props.showModal
    }

    this.onChange = this.onChange.bind(this);
    this.sendTokens = this.sendTokens.bind(this);
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  sendTokens() {
    sendTokens(this.state.password, this.state.recipientAddress, this.state.locAmount, this.props.flightReservationId);
  }

  render() {
    const { result } = this.props;
    const price = result && result.price.locPrice ? result.price.locPrice.toFixed(2) : '';

    return (
      <Fragment>
        <Modal
          show={this.props.showModal}
          className="modal fade myModal"
        >
          <form onSubmit={e => { e.preventDefault(); this.sendTokens(); }}>
            <Modal.Header>
              <h1>Send Tokens</h1>
              <button
                type="button"
                className="close"
                onClick={() => this.props.closeModal()}
              >
                &times;
              </button>
            </Modal.Header>
            <Modal.Body>
                <div className="name">
                  <label htmlFor="loc-amount">Send LOC Amount</label>
                  <input id="loc-amount" name="locAmount" onChange={this.onChange} type="text" placeholder="0.000" value={price}/>
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
  result: PropTypes.object,
  closeModal: PropTypes.func
}
export default SendTokensModal;
