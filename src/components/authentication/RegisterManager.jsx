import React from 'react';
import requester from '../../requester';
import { Config } from '../../config';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import { LONG } from '../../constants/notificationDisplayTimes.js';
import { closeModal, openModal } from '../../actions/modalsInfo';
import ReCAPTCHA from 'react-google-recaptcha';
import RegisterModal from './modals/RegisterModal';

import {
  REGISTER
} from '../../constants/modals.js';
import {
  PROFILE_SUCCESSFULLY_CREATED,
} from '../../constants/successMessages.js';
import {
  LOGIN,
} from '../../constants/modals.js';

class RegisterManager extends React.Component {
  constructor(props) {
    super(props);

    this.registerCaptcha = React.createRef();

    this.state = {
      signUpEmail: '',
      signUpFirstName: '',
      signUpLastName: '',
      signUpPassword: '',
      signUpLocAddress: '',
      country: '',
      countries: [],
      states: []
    };

    this.onChange = this.onChange.bind(this);
    this.handleChangeCountry = this.handleChangeCountry.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.requestCountries = this.requestCountries.bind(this);
    this.requestStates = this.requestStates.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
  }

  componentDidMount() {
    this.requestCountries();
  }

  requestCountries() {
    requester.getCountries()
      .then(response => response.body)
      .then(data => this.setState({ countries: data }));
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
      this.setState({ country: '' });
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
      country: this.state.country.id,
      countryState: this.state.countryState,
      image: 'images/default.png'
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
          isActive={this.props.modalsInfo.isActive[REGISTER]} 
          openModal={this.openModal} 
          closeModal={this.closeModal} 
          signUpEmail={this.state.signUpEmail} 
          signUpFirstName={this.state.signUpFirstName} 
          signUpLastName={this.state.signUpLastName} 
          signUpPassword={this.state.signUpPassword} 
          countries={this.state.countries} 
          country={this.state.country} 
          states={this.state.states} 
          onChange={this.onChange} 
          handleChangeCountry={this.handleChangeCountry} 
          handleRegister={() => this.registerCaptcha.execute()} 
        />
        <ReCAPTCHA
          ref={el => this.registerCaptcha = el}
          size="invisible"
          sitekey={Config.getValue('recaptchaKey')}
          onChange={(token) => {
            this.handleRegister(token);
            this.registerCaptcha.reset();
          }}
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
  userInfo: PropTypes.object,
  modalsInfo: PropTypes.object,
};

function mapStateToProps(state) {
  const { userInfo, modalsInfo, airdropInfo } = state;
  return {
    userInfo,
    modalsInfo,
    airdropInfo
  };
}

export default withRouter(connect(mapStateToProps)(RegisterManager));