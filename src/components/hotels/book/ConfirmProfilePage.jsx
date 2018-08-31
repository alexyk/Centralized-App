import '../../../styles/css/components/hotels/book/profile-confirm-form.css';
import '../../../styles/css/components/captcha/captcha-container.css';

import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';

import { Config } from '../../../config.js';
import requester from '../../../initDependencies';
import StringUtils from '../../../services/utilities/stringUtilities';
import ReCAPTCHA from 'react-google-recaptcha';
import Select from '../../common/google/GooglePlacesAutocomplete';
import moment from 'moment';
import queryString from 'query-string';

import { PASSWORD_PROMPT } from '../../../constants/modals.js';
import '../../../styles/css/components/profile/me/my-profile-edit-form.css';

class ConfirmProfilePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      countries: [],
      loading: true,
      states: [],
      userInfo: {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        country: {},
        city: '',
        state: {},
        address: '',
      },
    };

    this.onChange = this.onChange.bind(this);
    this.handleCitySelect = this.handleCitySelect.bind(this);
    this.updateCountry = this.updateCountry.bind(this);
    this.updateUserProfile = this.updateUserProfile.bind(this);
    this.payWithCard = this.payWithCard.bind(this);
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

        if (['Canada', 'India', 'United States of America'].includes(userInfo.country.name)) {
          requester.getStates(userInfo.country.id)
            .then(res => res.body)
            .then(data => { this.setState({ states: data }) });
        }

        console.log(userInfo);

        this.setState({ userInfo, loading: false });
      });

    requester.getCountries()
      .then(res => res.body)
      .then(data => this.setState({ countries: data }))
      .catch(error => console.log(error));
  }



  payWithCreditCard(path) {
    const form = document.createElement('form');
    form.method = 'post';
    form.action = path;
    form.style = 'display: none';

    document.body.appendChild(form);
    form.submit();
  }

  createBackUrl() {
    const currency = this.props.paymentInfo.currency;
    const queryParams = queryString.parse(this.props.location.search);
    const decodeBooking = JSON.parse(decodeURI(queryParams.booking));
    let rooms = decodeBooking.rooms;
    rooms.forEach((room) => {
      room.adults = room.adults.length;
    });

    const id = this.props.match.params.id;
    rooms = encodeURI(JSON.stringify(rooms));

    return `hotels/listings/${id}?region=${queryParams.region}&currency=${currency}&startDate=${queryParams.startDate}&endDate=${queryParams.endDate}&rooms=${rooms}`;
  }

  payWithCard() {
    const { paymentInfo } = this.props.location.state;
    console.log(paymentInfo);
    requester.verifyCreditCardPayment(paymentInfo)
      .then(res => {
        res.body.then((data) => {
          const env = Config.getValue('env');
          if (env === 'staging' || env === 'development') {
            window.location.href = data.url;
          } else {
            this.payWithCreditCard(data.url);
          }
        });
      });
  }

  onChange(event) {
    const userInfo = { ...this.state.userInfo };
    userInfo[event.target.name] = event.target.value;
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
      if (res.success) {
        this.payWithCard();
      } else {
        console.log("Error");
      }
    });
  }

  updateCountry(e) {
    let value = JSON.parse(e.target.value);

    if (['Canada', 'India', 'United States of America'].includes(value.name)) {
      requester.getStates(value.id)
        .then(res => res.body)
        .then(data => { console.log(data); this.setState({ states: data }) });
    }

    const userInfo = { ...this.state.userInfo };
    userInfo.country = value;
    userInfo.city = '';

    this.setState({ userInfo });
  }

  handleCitySelect(place) {
    const userInfo = { ...this.state.userInfo };
    userInfo.city = place.formatted_address;
    this.setState({ userInfo });
  }

  render() {
    if (this.state.loading) {
      return <div className="loader"></div>;
    }

    return (
      <React.Fragment>
        <div className="booking-steps sm-none">
          <div className="container">
            <p>1. Provide Guest Information</p>
            <p>2. Review Room Details</p>
            <p>3. Confirm and Pay</p>
          </div>
        </div>


        <div className="container" id="booking-profile-confirm">
          <h2>Review your billing information</h2>
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

            <div className="phone">
              <label htmlFor="phone">Phone number <span className="mandatory">*</span><img src={Config.getValue('basePath') + 'images/icon-lock.png'} className="lock" alt="lock-o" /></label>
              <input id="phone" name="phoneNumber" value={this.state.userInfo.phoneNumber} onChange={this.onChange} type="text" />
            </div>

            <div className="address-city">
              <div className="address">
                <label htmlFor="address">Country <span className="mandatory">*</span></label>
                <div className='select'>
                  <select name="country" onChange={this.updateCountry} value={JSON.stringify(this.state.userInfo.country)}>
                    <option disabled value="">Country</option>
                    {this.state.countries.map((item, i) => {
                      return <option key={i} value={JSON.stringify(item)}>{item.name}</option>;
                    })}
                  </select>
                </div>
              </div>
              <div className="city">
                <label htmlFor="city">City <span className="mandatory">*</span></label>
                <Select
                  style={{ width: '100%' }}
                  value={this.state.userInfo.city}
                  onChange={this.onChange}
                  name="city"
                  onPlaceSelected={this.handleCitySelect}
                  types={['(cities)']}
                  componentRestrictions={{ country: this.state.userInfo.country.code.toLowerCase() }}
                  disabled={!this.state.userInfo.country}
                  placeholder='Choose your city'
                />
              </div>
              <br className="clear-both" />
            </div>

            {['Canada', 'India', 'United States of America'].includes(this.state.userInfo.country.name) ? <div className="countryState">
              <label htmlFor="countryState">State <span className="mandatory">*</span></label>
              <div className='select'>
                <select name="countryState" onChange={this.onChange} value={this.state.userInfo.countryState}>
                  <option disabled value="">State</option>
                  {this.state.states.map((item, i) => {
                    return <option key={i} value={item.id}>{item.name}</option>;
                  })}
                </select>
              </div>
            </div> : null}

            <div className="address">
              <label htmlFor="address">Address <span className="mandatory">*</span></label>
              <input id="address" name="address" value={this.state.userInfo.address} onChange={this.onChange} type="text" placeholder='Enter your address' />
            </div>

            <div className="zip-code">
              <label htmlFor="zip-code">Zip Code <span className="mandatory">*</span></label>
              <input id="zip-code" name="zipCode" value={this.state.zipCode} onChange={this.onChange} type="text" placeholder='Enter your zip code' />
            </div>

            <p className="text"><span className="mandatory">*</span> Fields mandatory for payment with Credit Card</p>
            <div className="captcha-container">
              <ReCAPTCHA
                ref={el => this.captcha = el}
                size="invisible"
                sitekey={Config.getValue('recaptchaKey')}
                onChange={token => { this.updateUserProfile(token); this.captcha.reset(); }}
              />
            </div>
            <button type="submit" className="btn">Proceed</button>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

ConfirmProfilePage.propTypes = {
};

export default withRouter(ConfirmProfilePage);