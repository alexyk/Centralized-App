import 'react-notifications/lib/notifications.css';
import '../../../styles/css/components/profile/me/my-profile-edit-form.css';

import { Config } from '../../../config';
import { LONG } from '../../../constants/notificationDisplayTimes.js';
import { NotificationManager } from 'react-notifications';
import { PROFILE_SUCCESSFULLY_UPDATED } from '../../../constants/successMessages.js';
import { PROFILE_UPDATE_ERROR } from '../../../constants/errorMessages.js';
import ReCAPTCHA from 'react-google-recaptcha';
import React from 'react';
import Select from '../../common/google/GooglePlacesAutocomplete';
import moment from 'moment';
import requester from '../../../initDependencies';

class ProfileEditForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      preferredLanguage: '',
      preferredCurrency: '',
      month: '',
      day: '',
      year: '',
      gender: '',
      country: '',
      city: '',
      countryState: '',
      address: '',
      locAddress: '',
      zipCode: '',
      jsonFile: '',
      currencies: [],
      cities: [],
      countries: [],
      states: [],
      loading: true
    };


    this.onChange = this.onChange.bind(this);
    this.changeDropdownValue = this.changeDropdownValue.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.updateCountry = this.updateCountry.bind(this);
    this.handleCitySelect = this.handleCitySelect.bind(this);
  }

  async componentDidMount() {
    requester.getCountries()
      .then(res => res.body)
      .then(data => this.setState({ countries: data }))
      .catch(error => console.log(error));

    requester.getUserInfo()
      .then(res => res.body)
      .then(data => {
        let day = '';
        let month = '';
        let year = '';

        if (data.birthday !== null) {
          let birthday = moment.utc(data.birthday);
          day = birthday.add(1, 'days').format('D');
          month = birthday.format('MM');
          year = birthday.format('YYYY');
        }

        this.setState({
          firstName: data.firstName ? data.firstName : '',
          lastName: data.lastName ? data.lastName : '',
          phoneNumber: data.phoneNumber ? data.phoneNumber : '',
          preferredLanguage: data.preferredLanguage ? data.preferredLanguage : '',
          preferredCurrency: data.preferredCurrency ? data.preferredCurrency.id : '',
          gender: data.gender ? data.gender : '',
          country: data.country ? data.country : '',
          city: data.city ? data.city : '',
          countryState: data.countryState ? data.countryState.id : '',
          address: data.address ? data.address : '',
          locAddress: data.locAddress !== null ? data.locAddress : '',
          jsonFile: data.jsonFile !== null ? data.jsonFile : '',
          zipCode: data.zipCode !== null ? data.zipCode : '',
          currencies: data.currencies,
          day: day,
          month: month,
          year: year
        });

        if (data.country && ['Canada', 'India', 'United States of America'].includes(data.country.name)) {
          requester.getStates(this.state.country.id)
            .then(res => res.body)
            .then(data => this.setState({ states: data }));
        }
      }).then(() => {
        this.setState({ loading: false });
      });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  changeDropdownValue(a, event) {
    let stateKey = event.target.parentElement.parentElement.getAttribute('aria-labelledby');
    this.setState({ [stateKey]: event.target.innerText });
  }

  updateUser(captchaToken) {
    let birthday = `${this.state.day}/${this.state.month}/${this.state.year}`;
    let userInfo = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      phoneNumber: this.state.phoneNumber,
      preferredLanguage: this.state.preferredLanguage,
      preferredCurrency: parseInt(this.state.preferredCurrency, 10),
      gender: this.state.gender,
      country: parseInt(this.state.country.id, 10),
      city: this.state.city,
      countryState: parseInt(this.state.countryState, 10),
      address: this.state.address,
      birthday: birthday,
      locAddress: this.state.locAddress,
      jsonFile: this.state.jsonFile,
      zipCode: this.state.zipCode,
    };

    Object.keys(userInfo).forEach((key) => (userInfo[key] === null || userInfo[key] === '') && delete userInfo[key]);

    requester.updateUserInfo(userInfo, captchaToken).then(res => {
      if (res.success) {
        NotificationManager.success(PROFILE_SUCCESSFULLY_UPDATED, '', LONG);
        this.componentDidMount();
      }
      else {
        NotificationManager.error(PROFILE_UPDATE_ERROR, '', LONG);
      }
    }).catch(errors => {
      for (var e in errors) {
        NotificationManager.warning(errors[e].message, '', LONG);
      }
    });
  }

  updateCountry(e) {
    let value = JSON.parse(e.target.value);

    if (['Canada', 'India', 'United States of America'].includes(value.name)) {
      requester.getStates(value.id)
        .then(res => res.body)
        .then(data => this.setState({ states: data }));
    }

    this.setState({
      country: value,
      city: ''
    });
  }

  handleCitySelect(place) {
    // console.log(place);
    this.setState({ city: place.formatted_address });
  }

  render() {
    if (this.state.loading) {
      return <div className="loader"></div>;
    }

    let years = [];

    for (let i = (new Date()).getFullYear(); i >= 1940; i--) {
      years.push(<option key={i} value={i}>{i}</option>);
    }
    // console.log(this.state.country);
    return (
      <div id="my-profile-edit-form">
        <h2>Edit Profile</h2>
        <hr />
        <form onSubmit={(e) => { e.preventDefault(); this.captcha.execute(); }}>
          <div className="name">
            <div className="first">
              <label htmlFor="fname">First name <span className="mandatory">*</span></label>
              <input id="fname" name="firstName" value={this.state.firstName} onChange={this.onChange} type="text" required />
            </div>
            <div className="last">
              <label htmlFor="lname">Last name <span className="mandatory">*</span></label>
              <input id="lname" name="lastName" value={this.state.lastName} onChange={this.onChange} type="text" required />
            </div>
            <br className="clear-both" />
          </div>
          <div className="text"><span>Your public profile only shows your first name.<br />When you request a booking, your host will see your first and last name.</span></div>
          <div className="birth-sex">
            <div className="bmonth option-field">
              <label htmlFor="bmonth">Birthdate <img src={Config.getValue('basePath') + 'images/icon-lock.png'} className="lock" alt="lock-o" /></label>
              <div className='select select-profile-edit-form'>
                <select name="month" id="bmonth" onChange={this.onChange} value={this.state.month}>
                  <option disabled value="">Month</option>
                  <option value="01">January</option>
                  <option value="02">February</option>
                  <option value="03">March</option>
                  <option value="04">April</option>
                  <option value="05">May</option>
                  <option value="06">June</option>
                  <option value="07">July</option>
                  <option value="08">August</option>
                  <option value="09">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
              </div>
            </div>
            <div className="bday option-field">
              <label htmlFor="bday">&nbsp;</label>
              <div className='select'>
                <select name="day" id="bday" onChange={this.onChange} value={this.state.day}>
                  <option disabled value="">Day</option>
                  {Array.apply(null, Array(32)).map(function (item, i) {
                    return i > 0 && <option key={i} value={i}>{i}</option>;
                  })}
                </select>
              </div>
            </div>
            <div className="byear option-field">
              <label htmlFor="byear">&nbsp;</label>
              <div className='select'>
                <select name="year" id="byear" onChange={this.onChange} value={this.state.year}>
                  <option disabled value="">Year</option>
                  {years}
                </select>
              </div>
            </div>
            <div className="sex option-field">
              <label htmlFor="sex">Gender <img src={Config.getValue('basePath') + 'images/icon-lock.png'} className="lock" alt="lock-o" /></label>
              <div className='select'>
                <select name="gender" id="sex" onChange={this.onChange} value={this.state.gender}>
                  <option disabled value="">Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Rather not say</option>
                </select>
              </div>
            </div>
            <br className="clear-both" />
          </div>
          <div className="text"><span>We user this data for analysis and never share it with other users.</span></div>
          <div className="phone">
            <label htmlFor="phone">Phone number <span className="mandatory">*</span><img src={Config.getValue('basePath') + 'images/icon-lock.png'} className="lock" alt="lock-o" /></label>
            <input id="phone" name="phoneNumber" value={this.state.phoneNumber} onChange={this.onChange} type="text" />
          </div>
          <div className="text"><span>We won&#39;t share your phone number with other LockTrip users.</span></div>

          <div className="loc-address">
            <label htmlFor="loc-address">ETH/LOC address <img src={Config.getValue('basePath') + 'images/icon-lock.png'} className="lock" alt="lock-o" /></label>
            <input id="loc-address" name="locAddress" value={this.state.locAddress} onChange={this.onChange} type="text" disabled="disabled" />
          </div>

          <div className="language-currency">
            <div className="language">

              <label htmlFor="language">Preferred language</label>
              <div className='select'>
                <select name="preferredLanguage" id="language" onChange={this.onChange} value={this.state.preferredLanguage}>
                  <option value="1">English</option>
                </select>
              </div>
            </div>
            <div className="currency">

              <label htmlFor="currency">Preferred currency</label>
              <div className='select'>
                <select name="preferredCurrency" id="currency" onChange={this.onChange} value={this.state.preferredCurrency}>
                  <option disabled value="">Currency</option>
                  {this.state.currencies.map((item, i) => {
                    return <option key={i} value={item.id}>{item.code}</option>;
                  })}
                </select>
              </div>
            </div>
            <br className="clear-both" />
          </div>
          <div className="address-city">
            <div className="address">
              <label htmlFor="address">Where do you live <span className="mandatory">*</span></label>
              <div className='select'>
                <select name="country" id="address" onChange={this.updateCountry} value={JSON.stringify(this.state.country)}>
                  <option disabled value="">Country</option>
                  {this.state.countries.map((item, i) => {
                    return <option key={i} value={JSON.stringify(item)}>{item.name}</option>;
                  })}
                </select>
              </div>
            </div>
            <div className="city">
              <label htmlFor="city">Which city <span className="mandatory">*</span></label>
              <Select
                style={{ width: '100%' }}
                value={this.state.city}
                onChange={this.onChange}
                name="city"
                onPlaceSelected={this.handleCitySelect}
                types={['(cities)']}
                componentRestrictions={{ country: this.state.country.code.toLowerCase() }}
                disabled={!this.state.country}
                placeholder='Choose your city'
              />
            </div>
            <br className="clear-both" />
          </div>

          {['Canada', 'India', 'United States of America'].includes(this.state.country.name) ? <div className="countryState">
            <label htmlFor="countryState">State <span className="mandatory">*</span></label>
            <div className='select'>
              <select name="countryState" id="countryState" onChange={this.onChange} value={this.state.countryState}>
                <option disabled value="">State</option>
                {this.state.states.map((item, i) => {
                  return <option key={i} value={item.id}>{item.name}</option>;
                })}
              </select>
            </div>
          </div> : null}

          <div className="address">
            <label htmlFor="address">Address <span className="mandatory">*</span></label>
            <input id="address" name="address" value={this.state.address} onChange={this.onChange} type="text" placeholder='Enter your address' />
          </div>

          <div className="zip-code">
            <label htmlFor="zip-code">Zip Code <span className="mandatory">*</span></label>
            <input id="zip-code" name="zipCode" value={this.state.zipCode} onChange={this.onChange} type="text" placeholder='Enter your zip code' />
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
      </div>
    );
  }
}

export default ProfileEditForm;
