import React from "react";
import validator from "validator";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import { NotificationManager } from "react-notifications";

import { Config } from "../../../config";
import { AIRDROP_REGISTER, CREATE_WALLET } from "../../../constants/modals.js";
import requester from "../../../requester";

import {
  INVALID_EMAIL,
  EMAIL_ALREADY_EXISTS,
  INVALID_FIRST_NAME,
  INVALID_LAST_NAME,
  PROFILE_INVALID_PASSWORD_LENGTH,
  PROFILE_PASSWORD_REQUIREMENTS
} from "../../../constants/warningMessages.js";
import { LONG } from "../../../constants/notificationDisplayTimes";

function AirdropRegisterModal(props) {
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
          NotificationManager.warning(INVALID_EMAIL, "", LONG);
        } else if (!isEmailFree) {
          NotificationManager.warning(EMAIL_ALREADY_EXISTS, "", LONG);
        } else if (validator.isEmpty(props.signUpFirstName)) {
          NotificationManager.warning(INVALID_FIRST_NAME, "", LONG);
        } else if (validator.isEmpty(props.signUpLastName)) {
          NotificationManager.warning(INVALID_LAST_NAME, "", LONG);
        } else if (props.signUpPassword.length < 6) {
          NotificationManager.warning(
            PROFILE_INVALID_PASSWORD_LENGTH,
            "",
            LONG
          );
        } else if (
          !props.signUpPassword.match(
            "^([^\\s]*[a-zA-Z]+.*?[0-9]+[^\\s]*|[^\\s]*[0-9]+.*?[a-zA-Z]+[^\\s]*)$"
          )
        ) {
          NotificationManager.warning(PROFILE_PASSWORD_REQUIREMENTS, "", LONG);
        } else {
          props.closeModal(AIRDROP_REGISTER);
          props.openModal(CREATE_WALLET);
        }
      });
    });
  };

  return (
    <React.Fragment>
      <Modal
        show={props.isActive}
        onHide={() => console.log("First register in Locktrip")}
        className="modal fade myModal"
      >
        <Modal.Header>
          <h1>Sign up</h1>
          <button
            type="button"
            className="close"
            onClick={() => props.closeModal(AIRDROP_REGISTER)}
          >
            &times;
          </button>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-input-label">
            Please first register in Locktrip page
          </div>
          <form
            onSubmit={e => {
              e.preventDefault();
              openWalletInfo();
            }}
          >
            <div className="input-container">
              <img
                src={Config.getValue("basePath") + "images/login-mail.png"}
                className="email-image"
                alt="email"
              />
              <input
                type="email"
                name="signUpEmail"
                value={props.signUpEmail}
                onChange={props.onChange}
                className="with-icon"
                placeholder="Email address"
                autoFocus
              />
            </div>
            <div className="input-container">
              <img
                src={Config.getValue("basePath") + "images/login-user.png"}
                className="user-image"
                alt="user"
              />
              <input
                type="text"
                required="required"
                name="signUpFirstName"
                value={props.signUpFirstName}
                onChange={props.onChange}
                className="with-icon"
                placeholder="First Name"
              />
            </div>
            <div className="input-container">
              <img
                src={Config.getValue("basePath") + "images/login-user.png"}
                className="user-image"
                alt="user"
              />
              <input
                type="text"
                required="required"
                name="signUpLastName"
                value={props.signUpLastName}
                onChange={props.onChange}
                className="with-icon"
                placeholder="Last Name"
              />
            </div>
            <div className="input-container">
              <img
                src={Config.getValue("basePath") + "images/login-pass.png"}
                className="password-image"
                alt="pass"
              />
              <input
                type="password"
                required="required"
                name="signUpPassword"
                value={props.signUpPassword}
                onChange={props.onChange}
                className="with-icon"
                placeholder="Password"
              />
            </div>
            <div className="clearfix" />
            <button type="submit" className="btn btn-primary">
              Proceed
            </button>
          </form>
          <div className="signup-rights">
            <p>
              By creating an account, you are agreeing with our Terms and
              Conditions and Privacy Statement.
            </p>
          </div>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}

AirdropRegisterModal.propTypes = {
  signUpEmail: PropTypes.string,
  signUpFirstName: PropTypes.string,
  signUpLastName: PropTypes.string,
  signUpPassword: PropTypes.string,
  onChange: PropTypes.func,
  openModal: PropTypes.func,
  closeModal: PropTypes.func,
  isActive: PropTypes.bool
};

export default AirdropRegisterModal;
