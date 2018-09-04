import '../../../styles/css/components/hotels/book/hotel-booking-confirm-page.scss';

import { Modal } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';
import PropTypes from 'prop-types';
import React from 'react';
import { SMS_VERIFICATION } from '../../../constants/modals';

class RoomInfoModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      SMSCode: '',
      timerOn: false,
      seconds: 60
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.sendSMSCode = this.sendSMSCode.bind(this);
    this.countdown = this.countdown.bind(this);
    this.verifySMSCode = this.verifySMSCode.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  sendSMSCode() {
    // requester.sendSMSCode().then(res => {
    //   res.body.then(data => {
    NotificationManager.info('SMS with verification code is sent');
    this.setState({ timerOn: true });
    this.countdown();
    //   });
    // });
  }

  verifySMSCode() {
    var debug = 321897;

    if (this.state.timerOn === false) {
      NotificationManager.info('First send SMS');
    }
    else if (this.state.SMSCode === debug) {
      NotificationManager.success('Your reservation is verified with SMS');
      this.props.closeModal(SMS_VERIFICATION);
    }
    else {
      NotificationManager.error('Your SMS Code is wrong');
    }
  }

  handleSubmit() {
    this.props.closeModal(SMS_VERIFICATION);
    this.props.handleSearch();
  }

  countdown() {
    var seconds = this.state.seconds;
    seconds--;
    // var result = Number((seconds < 10 ? '0' : '') + String(seconds));
    this.setState({ seconds });
    if (seconds > 0) {
      setTimeout(this.countdown, 1000);
    }
    else {
      this.setState({ timerOn: false, seconds: 60 });
      clearTimeout();
    }
  }

  render() {

    // console.log(this.state);
    return (
      <div>
        <Modal show={this.props.isActive} onHide={() => this.props.closeModal(SMS_VERIFICATION)} className="modal fade myModal">
          <Modal.Header>
            <h1>SMS Verfication</h1>
            <button type="button" className="close" onClick={() => this.props.closeModal(SMS_VERIFICATION)}>&times;</button>
          </Modal.Header>
          <Modal.Body>
            <div className="sms">
              <input type="text" className="sms-field" value={this.state.SMSCode} name="SMSCode" onChange={this.onChange} />
              {!this.state.timerOn ? <button onClick={this.sendSMSCode} className="sms-button">Send SMS</button> : <button disabled className="sms-button">{(this.state.seconds < 10 ? '0' : '') + String(this.state.seconds) + 's'}</button>}
            </div>
            <button className="btn btn-primary" onClick={() => this.verifySMSCode()}>Verify</button>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

RoomInfoModal.propTypes = {
  closeModal: PropTypes.func,
  isActive: PropTypes.bool,
  modalId: PropTypes.string,
  handleSearch: PropTypes.func,
};

export default RoomInfoModal;
