import React from 'react';
import requester from '../../requester';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import { LONG } from '../../constants/notificationDisplayTimes.js';
import { closeModal, openModal } from '../../actions/modalsInfo';
import { isActive } from '../../selectors/modalsInfo';
import RegisterModal from './modals/RegisterModal';
import { executeWithToken } from '../../services/grecaptcha/grecaptcha';
import referralIdPersister from "../profile/affiliates/service/persist-referral-id";
import {REGISTER} from '../../constants/modals.js';
import {PROFILE_SUCCESSFULLY_CREATED, SEND_EMAIL_VERIFICATION} from '../../constants/successMessages.js';
import {LOGIN} from '../../constants/modals.js';

class RegisterManager extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      signUpEmail: '',
      signUpFirstName: '',
      signUpLastName: '',
      signUpPassword: '',
      signUpLocAddress: '',
      signUpPhoneNumber: '',
      country: null,
      states: []
    };

    this.onChange = this.onChange.bind(this);
    this.handleChangeCountry = this.handleChangeCountry.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.requestStates = this.requestStates.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
  }

  requestStates(id) {
    requester.getStates(id)
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
      const countryHasMandatoryState = ['Canada', 'India', 'United States of America'].includes(JSON.parse(e.target.value).name);
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

    this.props.dispatch(openModal(modal));
  }

  closeModal(modal, e) {
    if (e) {
      e.preventDefault();
    }

    this.setState({ loginEmail: '', loginPassword: '' });
    this.props.dispatch(closeModal(modal));
  }

  handleRegister(captchaToken) {
    let user = {
      email: this.state.signUpEmail,
      firstName: this.state.signUpFirstName,
      lastName: this.state.signUpLastName,
      password: this.state.signUpPassword,
      phoneNumber: this.state.signUpPhoneNumber,
      country: this.state.country.id,
      countryState: this.state.countryState,
      image: 'images/default.png',
      refId: referralIdPersister.getIdToRegister()
    };

    this.clearLocalStorage();
    requester.register(user, captchaToken).then(res => {
      if (res.success) {
        this.closeModal(REGISTER);
        this.setState({
          confirmedRegistration: false,
        });
        this.openModal(LOGIN);
        NotificationManager.success(PROFILE_SUCCESSFULLY_CREATED, '', LONG);
        NotificationManager.success(SEND_EMAIL_VERIFICATION, '', LONG);
      } else {
        res.errors.then(res => {
          const errors = res.errors;
          for (let key in errors) {
            if (typeof errors[key] !== 'function') {
              NotificationManager.warning(errors[key].message, 'Field: ' + key.toUpperCase(), LONG);
            }
          }
        });
      }
    });
  }

  clearLocalStorage() {
    localStorage['walletAddress'] = '';
    localStorage['walletMnemonic'] = '';
    localStorage['walletJson'] = '';
  }

  render() {
    return (
      <React.Fragment>
        <RegisterModal 
          isActive={this.props.isActive[REGISTER]} 
          openModal={this.openModal} 
          closeModal={this.closeModal} 
          signUpEmail={this.state.signUpEmail} 
          signUpFirstName={this.state.signUpFirstName} 
          signUpLastName={this.state.signUpLastName} 
          signUpPassword={this.state.signUpPassword}
          signUpPhoneNumber={this.state.signUpPhoneNumber}
          country={this.state.country} 
          states={this.state.states} 
          onChange={this.onChange} 
          handleChangeCountry={this.handleChangeCountry} 
          handleRegister={() => executeWithToken(this.handleRegister)} 
        />
      </React.Fragment>
    );
  }
}

RegisterManager.propTypes = {
  // start Router props
  location: PropTypes.object,
  history: PropTypes.object,

  // start Redux props
  dispatch: PropTypes.func,
  isActive: PropTypes.object,
};

function mapStateToProps(state) {
  const { modalsInfo } = state;
  return {
    isActive: isActive(modalsInfo),
  };
}

export default withRouter(connect(mapStateToProps)(RegisterManager));
