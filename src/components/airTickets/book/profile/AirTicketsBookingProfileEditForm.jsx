import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from '../../../common/google/GooglePlacesAutocomplete';
import requester from '../../../../requester';
import { LONG } from '../../../../constants/notificationDisplayTimes.js';
import { NotificationManager } from 'react-notifications';
import { PROFILE_UPDATE_ERROR } from '../../../../constants/errorMessages.js';
import moment from 'moment';
import '../../../../styles/css/components/airTickets/book/profile/air-tickets-booking-profile-edit-form.css';

class AirTicketsBookingProfileEditForm extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.handleCitySelect = this.handleCitySelect.bind(this);
    this.handleNextStep = this.handleNextStep.bind(this);
  }

  onChange(e) {
    this.props.onChange(e.target.name, e.target.value);
  }

  handleCitySelect(place) {
    this.props.onChange('city', place.formatted_address);
  }

  handleNextStep(hasFlightServices) {
    const { contactInfo } = this.props;

    requester.getUserInfo().then(res => {
      if (res.success) {
        res.body.then(data => {
          data.firstName = contactInfo.firstName;
          data.lastName = contactInfo.lastName;
          data.phoneNumber = contactInfo.phoneNumber;
          data.country = contactInfo.country.id;
          data.city = contactInfo.city;
          data.zipCode = contactInfo.zipCode;
          data.address = contactInfo.address;
          data.preferredCurrency = data.preferredCurrency.id;

          const params = {};
          if (data.birthday) {
            let bday = moment(new Date(data.birthday)).utc();
            params.birthday = `${bday.format('D')}/${bday.format('MM')}/${bday.format('YYYY')}`;
          }

          params.firstName = contactInfo.firstName;
          params.lastName = contactInfo.lastName;
          params.phoneNumber = contactInfo.phoneNumber;
          params.country = contactInfo.country.id;
          params.city = contactInfo.city;
          params.zipCode = contactInfo.zipCode;
          params.address = contactInfo.address;
          params.preferredCurrency = data.preferredCurrency.id || 1;
          params.gender = data.gender;
          params.jsonFile = data.jsonFile;
          params.locAddress = data.locAddress;

          requester.updateUserInfo(params).then(res => {
            if (res.success) {
              this.props.enableNextSection( hasFlightServices ? 'services' : 'passengers');
            } else {
              NotificationManager.warning(PROFILE_UPDATE_ERROR, 'Warning', LONG);
            }
          }).catch(err => console.log(err));
        });
      }
    });
  }

  render() {
    const { countries, hasFlightServices } = this.props;
    const { title, firstName, lastName, email, phoneNumber, country, zipCode, city, address } = this.props.contactInfo;

    return (
      <div className="air-tickets-contact-edit-form">
        <h2>Profile</h2>
        <hr />
        <form onSubmit={(e) => { e.preventDefault(); this.handleNextStep(hasFlightServices)}}>
          <div className="contact-name-wrapper">
            <div className="contact-title">
              <label htmlFor="title">Title <span className="mandatory">*</span></label>
              <div className="select">
                <select id="title" name="title" value={title || ''} onChange={this.onChange}>
                  <option defaultValue="" disabled hidden></option>
                  <option value="Mr" onChange={this.onChange}>Mr</option>
                  <option value="Mrs" onChange={this.onChange}>Mrs</option>
                </select>
              </div>
            </div>
            <div className="contact-name">
              <label htmlFor="firstName">First name <span className="mandatory">*</span></label>
              <input id="firstName" name="firstName" value={firstName || ''} onChange={this.onChange} type="text" required />
            </div>
            <div className="contact-name">
              <label htmlFor="lastName">Last name <span className="mandatory">*</span></label>
              <input id="lastName" name="lastName" value={lastName || ''} onChange={this.onChange} type="text" required />
            </div>
          </div>

          {!email &&
          <div className="email">
            <label htmlFor="contactEmail">Email <span className="mandatory">*</span></label>
            <input id="contactEmail" name="email" value={email || ''} onChange={this.onChange} type="email" required />
          </div>}

          <div className="phone-number">
            <label htmlFor="contactPhone">Phone Number <span className="mandatory">*</span></label>
            <input id="contactPhone" name="phoneNumber" value={phoneNumber || ''} onChange={this.onChange} type="number" required />
          </div>
          <div className="address-info">
            <div className="country-code">
              <label htmlFor="contactCountryCode">Country <span className="mandatory">*</span></label>
              <div className="select">
                <select id="contactCountryCode" name="country" defaultValue={country.code} onChange={this.onChange}>
                  {countries && countries.map((countryItem, countryIndex) => {
                    return <option key={countryIndex} value={countryItem.code} >{countryItem.name}</option>;
                  })}
                </select>
              </div>
            </div>
            <div className="zip-code">
              <label htmlFor="contactZip">Zip Code <span className="mandatory">*</span></label>
              <div>
                <input id="contactZip" name="zipCode" value={zipCode || ''} onChange={this.onChange} type="text" required />
              </div>
            </div>
            <div className="city">
              <label htmlFor="cityName">Which city <span className="mandatory">*</span></label>
              <Select
                value={city || ''}
                onChange={this.onChange}
                name="city"
                onPlaceSelected={this.handleCitySelect}
                types={['(cities)']}
                disabled={!country}
                placeholder=""
                required
              />
            </div>
          </div>
          <div className="address">
            <label htmlFor="contactAddress">Address <span className="mandatory">*</span></label>
            <input id="contactAddress" name="address" value={address || ''} onChange={this.onChange} type="text" />
          </div>
          <div className="button-wrapper">
            <button type="submit" className="button">Next</button>
          </div>
        </form>
      </div>
    );
  }
}

AirTicketsBookingProfileEditForm.propTypes = {
  contactInfo: PropTypes.object,
  countries: PropTypes.array,
  onChange: PropTypes.func,
  enableNextSection: PropTypes.func,
  hasFlightServices: PropTypes.bool
};

export default AirTicketsBookingProfileEditForm;
