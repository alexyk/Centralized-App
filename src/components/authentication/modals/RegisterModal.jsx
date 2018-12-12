import '../../../styles/css/components/modals/modal.css';

import { REGISTER } from '../../../constants/modals.js';
import {
  EMAIL_ALREADY_EXISTS,
  INVALID_EMAIL,
  INVALID_FIRST_NAME,
  INVALID_LAST_NAME,
  PROFILE_INVALID_PASSWORD_LENGTH,
  PROFILE_PASSWORD_REQUIREMENTS
} from '../../../constants/warningMessages.js';

import { Config } from '../../../config';
import { LONG } from '../../../constants/notificationDisplayTimes.js';
import { Modal } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import StringUtils from '../../../services/utilities/stringUtilities.js';
import requester from '../../../requester';
import validator from 'validator';

function RegisterModal(props) {

  const openWalletInfo = () => {
    requester.getEmailFreeResponse(props.signUpEmail).then(res => {
      res.body.then(data => {
        let isEmailFree = false;
        if (data.exist) {
          isEmailFree = false;
        } else {
          isEmailFree = true;
        }

        if (!validator.isEmail(props.signUpEmail)) {
          NotificationManager.warning(INVALID_EMAIL, '', LONG);
        } else if (!isEmailFree) {
          NotificationManager.warning(EMAIL_ALREADY_EXISTS, '', LONG);
        } else if (validator.isEmpty(props.signUpFirstName)) {
          NotificationManager.warning(INVALID_FIRST_NAME, '', LONG);
        } else if (validator.isEmpty(props.signUpLastName)) {
          NotificationManager.warning(INVALID_LAST_NAME, '', LONG);
        } else if (props.signUpPassword.length < 6) {
          NotificationManager.warning(PROFILE_INVALID_PASSWORD_LENGTH, '', LONG);
        } else if (!props.signUpPassword.match('^([^\\s]*[a-zA-Z]+.*?[0-9]+[^\\s]*|[^\\s]*[0-9]+.*?[a-zA-Z]+[^\\s]*)$')) {
          NotificationManager.warning(PROFILE_PASSWORD_REQUIREMENTS, '', LONG);
        } else {
          props.handleRegister();
        }
      });
    });
  };

  const countryHasMandatoryState = props.country && ['Canada', 'India', 'United States of America'].includes(props.country.name);

  return (
    <React.Fragment>
      <Modal show={props.isActive} onHide={() => props.closeModal(REGISTER)} className="modal fade myModal">
        <Modal.Header>
          <h1>Sign up</h1>
          <button type="button" className="close" onClick={() => props.closeModal(REGISTER)}>&times;</button>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={(e) => { e.preventDefault(); openWalletInfo(); }}>
            <div className="input-container">
              <img src={Config.getValue('basePath') + 'images/login-mail.png'} className="email-image" alt="email" />
              <input type="email" name="signUpEmail" value={props.signUpEmail} onChange={props.onChange} className="with-icon" placeholder="Email address" autoFocus />
            </div>
            <div className="input-container">
              <img src={Config.getValue('basePath') + 'images/login-user.png'} className="user-image" alt="user" />
              <input type="text" required="required" name="signUpFirstName" value={props.signUpFirstName} onChange={props.onChange} className="with-icon" placeholder="First Name" />
            </div>
            <div className="input-container">
              <img src={Config.getValue('basePath') + 'images/login-user.png'} className="user-image" alt="user" />
              <input type="text" required="required" name="signUpLastName" value={props.signUpLastName} onChange={props.onChange} className="with-icon" placeholder="Last Name" />
            </div>
            <div className="input-container select">
              <img src={Config.getValue('basePath') + 'images/login-user.png'} className="user-image" alt="user" />
              <select name="country" id="country" onChange={props.handleChangeCountry} value={JSON.stringify(props.country)} style={{ padding: '10px', maxWidth: '100%', marginBottom: '10px', minHeight: '50px', paddingLeft: '40px' }} placeholder='Enter your country' required>
                <option value="" defaultValue>Country</option>
                {props.countries && props.countries.map((item, i) => {
                  return <option key={i} value={JSON.stringify(item)} style={{ minWidth: '100%', maxWidth: '0' }}>{StringUtils.shorten(item.name, 30)}</option>;
                })}
              </select>
            </div>
            {countryHasMandatoryState &&
              <div className="input-container select">
                <img src={Config.getValue('basePath') + 'images/login-user.png'} className="user-image" alt="user" />
                <select name="countryState" id="countryState" onChange={props.onChange} value={props.countryState} style={{ padding: '10px', maxWidth: '100%', marginBottom: '10px', minHeight: '50px', paddingLeft: '40px' }} required>
                  <option value="">State</option>
                  {props.states && props.states.map((item, i) => {
                    return <option key={i} value={item.id} style={{ minWidth: '100%', maxWidth: '0' }}>{item.name}</option>;
                  })}
                </select>
              </div>}
            <div className="input-container">
              <img src={Config.getValue('basePath') + 'images/login-pass.png'} className="password-image" alt="pass" />
              <input type="password" required="required" name="signUpPassword" value={props.signUpPassword} onChange={props.onChange} className="with-icon" placeholder="Password" />
            </div>
            <div className="clearfix"></div>
            <button type="submit" className="button">Proceed</button>
          </form>
          <div className="signup-rights">
            <p>By creating an account, you are agreeing with our Terms and Conditions and Privacy Statement.</p>
          </div>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}

RegisterModal.propTypes = {
  signUpEmail: PropTypes.string,
  signUpFirstName: PropTypes.string,
  signUpLastName: PropTypes.string,
  signUpPassword: PropTypes.string,
  country: PropTypes.object,
  states: PropTypes.array,
  countryState: PropTypes.number,
  onChange: PropTypes.func,
  openModal: PropTypes.func,
  closeModal: PropTypes.func,
  isActive: PropTypes.bool,
  handleRegister: PropTypes.func,
  handleChangeCountry: PropTypes.func,

  // Redux props
  countries: PropTypes.array
};

const mapStateToProps = (state) => {
  const { countriesInfo } = state;

  return {
    countries: countriesInfo.countries
  };
};

export default connect(mapStateToProps)(RegisterModal);
