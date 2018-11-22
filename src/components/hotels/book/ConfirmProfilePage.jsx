import React from 'react';
import { withRouter } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Config } from '../../../config.js';
import requester from '../../../requester';
import { LONG } from '../../../constants/notificationDisplayTimes';
import BookingSteps from '../../common/utility/BookingSteps';
import Select from '../../common/google/GooglePlacesAutocomplete';
import StringUtils from '../../../services/utilities/stringUtilities';

import '../../../styles/css/components/hotels/book/profile-confirm-form.scss';

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
        zipCode: ''
      },
    };

    this.onChange = this.onChange.bind(this);
    this.handleCitySelect = this.handleCitySelect.bind(this);
    this.updateCountry = this.updateCountry.bind(this);
    this.updateUserProfile = this.updateUserProfile.bind(this);
    this.payWithCard = this.payWithCard.bind(this);
    this.requestUserInfo = this.requestUserInfo.bind(this);
    this.requestCountries = this.requestCountries.bind(this);
    this.requestStates = this.requestStates.bind(this);
  }

  componentDidMount() {
    this.requestUserInfo();
    this.requestCountries();
  }

  requestUserInfo() {
    requester.getUserInfo()
      .then(res => res.body)
      .then(userInfo => {
        if (userInfo.birthday !== null) {
          let birthday = moment(userInfo.birthday).utc();
          const day = birthday.format('D');
          const month = birthday.format('MM');
          const year = birthday.format('YYYY');
          userInfo.birthday = `${day}/${month}/${year}`;
        }

        if (['Canada', 'India', 'United States of America'].includes(userInfo.country.name)) {
          this.requestStates(userInfo.country.id);
        }

        if (userInfo.countryState) {
          userInfo.countryState = userInfo.countryState.id;
        }

        this.setState({ userInfo, loading: false });
      });
  }

  requestCountries() {
    requester.getCountries()
      .then(res => res.body)
      .then(data => this.setState({ countries: data }))
      .catch(error => console.log(error));
  }

  requestStates(countryId) {
    requester.getStates(countryId)
      .then(res => res.body)
      .then(data => { this.setState({ states: data }); });
  }


  payWithCreditCard(path) {
    const form = document.createElement('form');
    form.method = 'post';
    form.action = path;
    form.style = 'display: none';

    document.body.appendChild(form);
    form.submit();
  }

  payWithCard() {
    this.props.requestLockOnQuoteId('safecharge').then(() => {
      const { paymentInfo } = this.props.location.state;
      requester.verifyCreditCardPayment(paymentInfo)
        .then(res => {
          if (res.success) {
            res.body.then((data) => {
              const env = Config.getValue('env');
              if (env === 'staging' || env === 'development') {
                window.location.href = data.url;
              } else {
                this.payWithCreditCard(data.url);
              }
            });
          } else {
            res.errors.then((error) => {
              NotificationManager.warning(error.message, '', LONG);
            });
          }
        });
    });
  }

  onChange(event) {
    const userInfo = { ...this.state.userInfo };
    userInfo[event.target.name] = event.target.value;
    this.setState({ userInfo });
  }

  updateUserProfile() {
    const userInfo = { ...this.state.userInfo };
    userInfo.preferredCurrency = userInfo.preferredCurrency ? userInfo.preferredCurrency.id : 1;
    userInfo.country = userInfo.country && userInfo.country.id;
    userInfo.countryState = userInfo.countryState && parseInt(userInfo.countryState, 10);
    requester.updateUserInfo(userInfo).then(res => {
      if (res.success) {
        this.payWithCard();
      } else {
        res.errors.then(e => console.log(e));
        NotificationManager.error('Invalid user information.', '', LONG);
      }
    });
  }

  updateCountry(e) {
    let value = JSON.parse(e.target.value);

    if (['Canada', 'India', 'United States of America'].includes(value.name)) {
      requester.getStates(value.id)
        .then(res => res.body)
        .then(data => { console.log(data); this.setState({ states: data }); });
    }

    const userInfo = { ...this.state.userInfo };
    userInfo.country = value;
    userInfo.city = '';
    userInfo.countryState = '';

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
        <div className="sm-none">
          <BookingSteps steps={['Provide Guest Information', 'Review Room Details', 'Confirm and Pay']} currentStepIndex={2} />
        </div>


        <div className="container" id="booking-profile-confirm">
          <h2>Review Billing Information</h2>
          <form onSubmit={(e) => { e.preventDefault(); this.updateUserProfile(); }}>
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
              <input id="phone" name="phoneNumber" value={this.state.userInfo.phoneNumber} onChange={this.onChange} type="text" required />
            </div>

            <div className="address-city">
              <div className="address">
                <label htmlFor="address">Country <span className="mandatory">*</span></label>
                <div className='select'>
                  <select name="country" onChange={this.updateCountry} value={JSON.stringify(this.state.userInfo.country)} required>
                    <option disabled value="">Country</option>
                    {this.state.countries.map((item, i) => {
                      return <option key={i} value={JSON.stringify(item)}>{StringUtils.shorten(item.name, 30)}</option>;
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
                  required
                />
              </div>
              <br className="clear-both" />
            </div>

            {['Canada', 'India', 'United States of America'].includes(this.state.userInfo.country.name) ? <div className="countryState">
              <label htmlFor="countryState">State <span className="mandatory">*</span></label>
              <div className='select'>
                <select name="countryState" onChange={this.onChange} value={this.state.userInfo.countryState} required>
                  <option disabled value="">State</option>
                  {this.state.states.map((item, i) => {
                    return <option key={i} value={item.id}>{item.name}</option>;
                  })}
                </select>
              </div>
            </div> : null}

            <div className="address">
              <label htmlFor="address">Address <span className="mandatory">*</span></label>
              <input id="address" name="address" value={this.state.userInfo.address} onChange={this.onChange} type="text" placeholder='Enter your address' required />
            </div>

            <div className="zip-code">
              <label htmlFor="zip-code">Zip Code <span className="mandatory">*</span></label>
              <input id="zip-code" name="zipCode" value={this.state.userInfo.zipCode} onChange={this.onChange} type="text" placeholder='Enter your zip code' required />
            </div>

            <p className="text"><span className="mandatory">*</span> Fields mandatory for payment with Credit Card</p>
            <button type="submit" className="btn">Proceed</button>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

ConfirmProfilePage.propTypes = {
  // Redux
  paymentInfo: PropTypes.object,

  // Router
  location: PropTypes.object,
  match: PropTypes.object,

  requestLockOnQuoteId: PropTypes.func
};

export default withRouter(ConfirmProfilePage);