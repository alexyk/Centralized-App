import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';

import { Config } from '../../../config.js';
import requester from '../../../initDependencies';
import StringUtils from '../../../services/utilities/stringUtilities';
import ReCAPTCHA from 'react-google-recaptcha';
import Select from '../../common/google/GooglePlacesAutocomplete';
import moment from 'moment';

import { PASSWORD_PROMPT } from '../../../constants/modals.js';
import '../../../styles/css/components/profile/me/my-profile-edit-form.css';

class ConfirmProfilePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      countries: [],
      userInfo: {}
    };

    this.onChange = this.onChange.bind(this);
    this.executeCaptcha = this.executeCaptcha.bind(this);
  }

  componentDidMount() {
    requester.getUserInfo()
      .then(res => res.body)
      .then(userInfo => {
        if (userInfo.birthday !== null) {
          let birthday = moment.utc(userInfo.birthday);
          const day = birthday.add(1, 'days').format('D');
          const month = birthday.format('MM');
          const year = birthday.format('YYYY');
          userInfo.birthday = `${day}/${month}/${year}`;
        }

        this.setState({ userInfo });
      });

    requester.getCountries()
      .then(res => res.body)
      .then(data => this.setState({ countries: data }))
      .catch(error => console.log(error));
  }

  onChange(event) {
    console.log(event.target.value);
    const userInfo = { ...this.state.userInfo };
    userInfo[event.target.name] = event.target.name === 'country' ? JSON.parse(event.target.value) : event.target.value;
    this.setState({ userInfo });
  }

  executeCaptcha() {
    this.captcha.execute();
  }

  updateUserProfile(captchaToken) {
    const userInfo = { ...this.state.userInfo };
    userInfo.preferredCurrency = userInfo.preferredCurrency ? userInfo.preferredCurrency.id : 1;
    userInfo.country = userInfo.country && userInfo.country.id;
    userInfo.state = userInfo.state && userInfo.state.id;
    console.log(userInfo);
    requester.updateUserInfo(userInfo, captchaToken).then(res => {
      console.log('success');
    });
  }

  render() {
    return (
      <React.Fragment>
        <form onSubmit={(e) => { e.preventDefault(); this.captcha.execute(); }}>
          <div className="name">
            <div className="first">
              <label htmlFor="fname">First name <span className="mandatory">*</span></label>
              <input id="fname" name="firstName" value={this.state.userInfo.firstName} onChange={this.onChange} type="text" required />
            </div>
            <div className="last">
              <label htmlFor="lname">Last name <span className="mandatory">*</span></label>
              <input id="lname" name="lastName" value={this.state.userInfo.lastName} onChange={this.onChange} type="text" required />
            </div>
            <br className="clear-both" />
          </div>
          <div className="text"><span>Your public profile only shows your first name.<br />When you request a booking, your host will see your first and last name.</span></div>

          <div className="text"><span>We user this data for analysis and never share it with other users.</span></div>
          <div className="phone">
            <label htmlFor="phone">Phone number <span className="mandatory">*</span><img src={Config.getValue('basePath') + 'images/icon-lock.png'} className="lock" alt="lock-o" /></label>
            <input id="phone" name="phoneNumber" value={this.state.userInfo.phoneNumber} onChange={this.onChange} type="text" />
          </div>
          <div className="text"><span>We won&#39;t share your phone number with other LockTrip users.</span></div>
          
          <div className="address-city">
            <div className="address">
              <label htmlFor="address">Where do you live <span className="mandatory">*</span></label>
              <div className='select'>
                <select name="country" id="address" onChange={this.onChange} value={JSON.stringify(this.state.userInfo.country)}>
                  <option disabled value="">Country</option>
                  {this.state.countries.map((item, i) => {
                    return <option key={i} value={JSON.stringify(item)}>{item.name}</option>;
                  })}
                </select>
              </div>
            </div>
            <div className="city">
              <label htmlFor="city">Which city <span className="mandatory">*</span></label>
              {/* <Select
                style={{ width: '100%' }}
                value={this.state.userInfo.city}
                onChange={this.onChange}
                name="city"
                onPlaceSelected={this.handleCitySelect}
                types={['(cities)']}
                componentRestrictions={{ country: this.state.userInfo.country.code.toLowerCase() }}
                disabled={!this.state.userInfo.country}
                placeholder='Choose your city'
              /> */}
            </div>
            <br className="clear-both" />
          </div>

          {/* {['Canada', 'India', 'United States of America'].includes(this.state.userInfo.country.name) ? <div className="countryState">
            <label htmlFor="countryState">State <span className="mandatory">*</span></label>
            <div className='select'>
              <select name="countryState" id="countryState" onChange={this.onChange} value={this.state.userInfo.countryState}>
                <option disabled value="">State</option>
                {this.state.userInfo.states.map((item, i) => {
                  return <option key={i} value={item.id}>{item.name}</option>;
                })}
              </select>
            </div>
          </div> : null} */}

          <div className="address">
            <label htmlFor="address">Address <span className="mandatory">*</span></label>
            <input id="address" name="address" value={this.state.userInfo.address} onChange={this.onChange} type="text" placeholder='Enter your address' />
          </div>

          <p className="text"><span className="mandatory">*</span> Fields mandatory for payment with Credit Card</p>

          <ReCAPTCHA
            ref={el => this.captcha = el}
            size="invisible"
            sitekey={Config.getValue('recaptchaKey')}
            onChange={token => { this.updateUser(token); this.captcha.reset(); }}
          />

          <button type="submit" className="btn">Save</button>
        </form>


        <ReCAPTCHA
          ref={el => this.captcha = el}
          size="invisible"
          sitekey={Config.getValue('recaptchaKey')}
          onChange={token => { this.updateUserProfile(token); this.captcha.reset(); }}
        />
      </React.Fragment>
    );
  }
}

ConfirmProfilePage.propTypes = {
};

export default ConfirmProfilePage;