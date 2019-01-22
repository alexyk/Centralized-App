import React from "react";
import requester from "../../requester";
import { Config } from "../../config";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { NotificationManager } from "react-notifications";
import { LONG } from "../../constants/notificationDisplayTimes.js";
import LoginModal from "./modals/LoginModal";
import { closeModal, openModal } from "../../actions/modalsInfo";
import { isActive } from "../../selectors/modalsInfo";
import { setUserInfo } from "../../actions/userInfo";
import { Wallet } from "../../services/blockchain/wallet.js";
import { VERIFICATION_EMAIL_SENT } from "../../constants/infoMessages.js";
import UpdateCountryModal from "./modals/UpdateCountryModal";
import EmailVerificationModal from "./modals/EmailVerificationModal";
import EnterEmailVerificationTokenModal from "./modals/EnterEmailVerificationTokenModal";
import { executeWithToken } from "../../services/grecaptcha/grecaptcha";
import queryString from "query-string";
import {
  EMAIL_VERIFICATION,
  ENTER_RECOVERY_TOKEN
} from "../../constants/modals.js";
import { INVALID_SECURITY_CODE } from "../../constants/warningMessages";
import { ENTER_EMAIL_VERIFICATION_SECURITY_TOKEN } from "../../constants/modals.js";

import { LOGIN, UPDATE_COUNTRY, REGISTER } from "../../constants/modals.js";
import * as _ from "ramda";
import { SEND_RECOVERY_EMAIL } from "../../constants/modals";

export class LoginManager extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loginEmail: "",
      loginPassword: "",
      country: null,
      states: [],
      countryState: "",
      recoveryToken: "",
      isUpdatingCountry: false,
      isLogging: false
    };

    this.onChange = this.onChange.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.login = this.login.bind(this);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleChangeCountry = this.handleChangeCountry.bind(this);
    this.handleUpdateCountry = this.handleUpdateCountry.bind(this);
    this.requestStates = this.requestStates.bind(this);
    this.tryToOpenRecoveryModalOnMount = this.tryToOpenRecoveryModalOnMount.bind(
      this
    );
  }

  tryToOpenRecoveryModalOnMount() {
    console.log("tryToOpenRecoveryModalOnMount");
    if (this.props.openRecoveryOnMount) {
      console.log("openRecoveryOnMount");

      // this.openModal(SEND_RECOVERY_EMAIL);
      this.props.openRecoveryEmailModal();
    }
  }

  componentDidMount() {
    this.handleWebAuthorization();
    this.handleMobileAuthorization();
    this.tryToOpenRecoveryModalOnMount();

    const queryParams = queryString.parse(this.props.location.search);

    if (queryParams.token) {
      this.setState({ recoveryToken: queryParams.token });
      // this.openModal(ENTER_RECOVERY_TOKEN);
      this.openRecoveryTokenModal();
    }

    /*
    if (queryParams.emailVerificationSecurityCode) {
      const { emailVerificationSecurityCode } = queryParams;
      requester.verifyEmailSecurityCode({ emailVerificationSecurityCode })
        .then(res => res.body)
        .then(data => {
          if (data.isEmailVerified) {
            NotificationManager.success(EMAIL_VERIFIED, '', LONG);
            this.setUserInfo();
          }
        });

      this.removeVerificationCodeFromURL();
    }
    */
  }

  /*
  removeVerificationCodeFromURL() {
    const path = this.props.location.pathname;
    const search = this.props.location.search;
    const indexOfSecurityCode = search.indexOf('&emailVerificationSecurityCode=');
    const pushURL = path + search.substring(0, indexOfSecurityCode);
    this.props.history.push(pushURL);
  }
*/
  requestStates(id) {
    requester
      .getStates(id)
      .then(response => response.body)
      .then(data => this.setState({ states: data }));
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleChangeCountry(e) {
    if (!e.target.value) {
      this.setState({ country: null });
    } else {
      const countryHasMandatoryState = [
        "Canada",
        "India",
        "United States of America"
      ].includes(JSON.parse(e.target.value).name);
      this.setState({ country: JSON.parse(e.target.value) });
      if (countryHasMandatoryState) {
        this.requestStates(JSON.parse(e.target.value).id);
      }
    }
  }

  openModal(modal, e) {
    if (e) {
      e.preventDefault();
    }
    this.props.openModal(modal);
  }

  closeModal(modal, e) {
    if (e) {
      e.preventDefault();
    }

    this.props.closeModal(modal);
  }

  handleLoginClick() {
    this.setState({ isLogging: true }, () => {
      executeWithToken(this.login);
    });
  }

  login(captchaToken) {
    let user = {
      email: this.state.loginEmail,
      password: this.state.loginPassword
    };

    if (this.state.isUpdatingCountry && this.state.country) {
      user.country = this.state.country.id;
      if (this.state.countryState) {
        user.countryState = Number(this.state.countryState);
      }

      this.closeModal(UPDATE_COUNTRY);
      this.setState({
        isUpdatingCountry: false,
        country: null,
        countryState: ""
      });
    }

    requester.login(user, captchaToken).then(res => {
      if (res.success) {
        res.body.then(data => {
          localStorage[Config.getValue("domainPrefix") + ".auth.locktrip"] =
            data.Authorization;
          localStorage[Config.getValue("domainPrefix") + ".auth.username"] =
            user.email;
          this.setUserInfo();
          this.closeModal(LOGIN);
          this.setState({
            loginEmail: "",
            loginPassword: "",
            isLogging: false
          });
        });
      } else {
        this.handleLoginErrors(res);
      }
    });
  }

  handleWebAuthorization() {
    if (
      localStorage[Config.getValue("domainPrefix") + ".auth.username"] &&
      localStorage[Config.getValue("domainPrefix") + ".auth.locktrip"]
    ) {
      this.setUserInfo();
    }
  }

  handleMobileAuthorization() {
    const queryStringParameters = queryString.parse(this.props.location.search);
    const { authEmail, authToken } = queryStringParameters;
    if (authEmail && authToken) {
      localStorage[
        Config.getValue("domainPrefix") + ".auth.username"
      ] = authEmail;
      localStorage[
        Config.getValue("domainPrefix") + ".auth.locktrip"
      ] = decodeURI(authToken);
      this.setUserInfo();
      const url = this.props.location.pathname;
      const search = LoginManager.getQueryStringForMobile(queryStringParameters);
      this.props.history.push(url + search);
    }
  }

  static getQueryStringForMobile(queryStringParameters) {
    let queryString = "?";

    const {region,currency,startDate,endDate,rooms,guests} = queryStringParameters;
    if (region)    queryString += "region="     + encodeURI(region);
    if (currency)  queryString += "&currency="  + encodeURI(currency);
    if (startDate) queryString += "&startDate=" + encodeURI(startDate);
    if (endDate)   queryString += "&endDate="   + encodeURI(endDate);
    if (rooms)     queryString += "&rooms="     + encodeURI(rooms);
    if (guests)    queryString += "&guests="    + encodeURI(guests);

    return queryString;
  }

  handleLoginErrors(res) {
    res.errors
      .then(res => {
        const errors = res.errors;
        if (errors.hasOwnProperty("CountryNull")) {
          NotificationManager.warning(errors["CountryNull"].message, "", LONG);
          this.setState({ isUpdatingCountry: true, isLogging: false }, () => {
            this.closeModal(LOGIN);
            // this.openModal(UPDATE_COUNTRY);
            this.openUpdateCountryModal();
          });
        } else {
          for (let key in errors) {
            if (typeof errors[key] !== "function") {
              NotificationManager.warning(errors[key].message, "", LONG);
            }
          }

          this.setState({
            loginEmail: "",
            loginPassword: "",
            isLogging: false
          });
        }
      })
      .catch(errors => {
        for (var e in errors) {
          NotificationManager.warning(errors[e].message, "", LONG);
        }

        this.setState({ loginEmail: "", loginPassword: "" });
      });
  }

  handleUpdateCountry() {
    if (this.state.country) {
      if (
        ["Canada", "India", "United States of America"].includes(
          this.state.country.name
        ) &&
        !this.state.countryState
      ) {
        NotificationManager.error("Please select a valid state.", "", LONG);
      } else {
        this.setState({ isLogging: true }, () => {
          executeWithToken(this.login);
        });
      }
    } else {
      NotificationManager.error("Please select a valid country.", "", LONG);
    }
  }

  setUserInfo() {
    requester.getUserInfo().then(res => {
      res.body.then(_data => {
        let data = _.pick(
          [
            "firstName",
            "lastName",
            "phoneNumber",
            "email",
            "locAddress",
            "gender",
            "isEmailVerified",
            "id"
          ],
          _data
        );
        const isAdmin = _data.roles.findIndex(r => r.name === "ADMIN") !== -1;

        if (data.locAddress) {
          Wallet.getBalance(data.locAddress).then(eth => {
            const ethBalance = eth / Math.pow(10, 18);
            Wallet.getTokenBalance(data.locAddress).then(loc => {
              const locBalance = loc / Math.pow(10, 18);
              this.props.setUserInfo({
                ...data,
                ethBalance,
                locBalance,
                isAdmin
              });
            });
          });
        } else {
          const ethBalance = 0;
          const locBalance = 0;
          this.props.setUserInfo({
            ...data,
            ethBalance,
            locBalance,
            isAdmin
          });
        }
      });
    });
  }

  requestVerificationEmail() {
    const emailVerificationRedirectURL =
      this.props.location.pathname + this.props.location.search;
    requester
      .sendVerificationEmail({ emailVerificationRedirectURL })
      .then(res => res.body)
      .then(data => {
        if (data.isVerificationEmailSent) {
          NotificationManager.success(VERIFICATION_EMAIL_SENT, "", LONG);
        } else {
          NotificationManager.error(INVALID_SECURITY_CODE, "", LONG);
        }
      });

    this.closeModal(EMAIL_VERIFICATION);
  }

  render() {
    return (
      <React.Fragment>
        <LoginModal
          isActive={this.props.isActive[LOGIN]}
          onRecoverPasswordClicked={() => {
            this.closeModal(LOGIN);
            this.openModal(SEND_RECOVERY_EMAIL);
          }}
          onSignupClicked={() => {
            this.closeModal(LOGIN);
            this.openModal(REGISTER);
          }}
          onHide={() => this.closeModal(LOGIN)}
          onClose={() => this.closeModal(LOGIN)}
          closeModal={this.closeModal}
          loginEmail={this.state.loginEmail}
          loginPassword={this.state.loginPassword}
          onChange={this.onChange}
          handleLogin={this.handleLoginClick}
          isLogging={this.state.isLogging}
        />
        <UpdateCountryModal
          isActive={this.props.isActive[UPDATE_COUNTRY]}
          closeModal={this.closeModal}
          onChange={this.onChange}
          country={this.state.country}
          states={this.state.states}
          countryState={this.state.countryState}
          handleUpdateCountry={this.handleUpdateCountry}
          handleChangeCountry={this.handleChangeCountry}
          isLogging={this.state.isLogging}
        />
        <EmailVerificationModal
          isActive={this.props.isActive[EMAIL_VERIFICATION]}
          closeModal={this.closeModal}
          onChange={this.onChange}
          requestVerificationEmail={this.requestVerificationEmail}
        />
        <EnterEmailVerificationTokenModal
          isActive={
            this.props.isActive[ENTER_EMAIL_VERIFICATION_SECURITY_TOKEN]
          }
          closeModal={this.closeModal}
          onChange={this.onChange}
          handleLogin={() => executeWithToken(this.login)}
          emailVerificationToken={this.state.emailVerificationToken}
        />
      </React.Fragment>
    );
  }
}

LoginManager.propTypes = {
  // start Router props
  location: PropTypes.object,
  history: PropTypes.object,

  // start Redux props
  isActive: PropTypes.object,
  openRecoveryOnMount: PropTypes.bool
};

function mapStateToProps(state) {
  const { modalsInfo } = state;
  return {
    isActive: isActive(modalsInfo)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    openRecoveryEmailModal: () => dispatch(openModal(SEND_RECOVERY_EMAIL)),
    openRecoveryTokenModal: () => dispatch(openModal(ENTER_RECOVERY_TOKEN)),
    openUpdateCountryModal: () => dispatch(openModal(UPDATE_COUNTRY)),
    onRecoverPasswordClicked: () => {},
    openModal: modal => dispatch(openModal(modal)),
    closeModal: modal => dispatch(closeModal(modal)),
    setUserInfo: info => dispatch(setUserInfo(info))
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LoginManager)
);
