import { Config } from "../../../config";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import React from "react";

import "../../../styles/css/components/modals/modal.css";

function LoginModal(props) {
  const { isLogging } = props;
  return (
    <React.Fragment>
      <Modal
        show={props.isActive}
        onHide={props.onHide}
        className="modal fade myModal"
      >
        <Modal.Header>
          <h1>Login</h1>
          <button type="button" className="close" onClick={props.onClose}>
            &times;
          </button>
        </Modal.Header>
        <Modal.Body>
          <form
            onSubmit={e => {
              e.preventDefault();
              props.handleLogin();
            }}
          >
            <div className="input-container">
              <img
                src={Config.getValue("basePath") + "images/login-mail.png"}
                className="email-image"
                alt="mail"
              />
              <input
                type="email"
                name="loginEmail"
                value={props.loginEmail}
                onChange={props.onChange}
                className="with-icon"
                placeholder="Email address"
                required
                autoFocus
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
                name="loginPassword"
                value={props.loginPassword}
                onChange={props.onChange}
                className="with-icon"
                placeholder="Password"
              />
            </div>
            <div className="remember-me">
              <label>
                <input type="checkbox" value="" id="login-remember" />
                Remember Me
              </label>
            </div>
            <button type="submit" className="button" disabled={isLogging}>
              {isLogging ? "Logging in..." : "Login"}
            </button>
            <div className="clearfix" />
          </form>

          <hr />
          <div className="login-sign">
            Don’t have an account?{" "}
            <a
              onClick={e => {
                e.preventDefault();
                props.onSignupClicked();
              }}
            >
              Sign up
            </a>
            . Forgot your password?{" "}
            <a
              onClick={e => {
                e.preventDefault();
                props.onRecoverPasswordClicked();
              }}
            >
              Recover
            </a>
          </div>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}

LoginModal.propTypes = {
  loginEmail: PropTypes.string,
  loginPassword: PropTypes.string,
  onHide: PropTypes.func,
  onClose: PropTypes.func,
  onRecoverPasswordClicked: PropTypes.func,
  onSignupClicked: PropTypes.func,
  handleLogin: PropTypes.func,
  onChange: PropTypes.func,
  closeModal: PropTypes.func,
  isActive: PropTypes.bool,
  isLogging: PropTypes.bool
};

export default LoginModal;
