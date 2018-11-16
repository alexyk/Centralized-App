import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from '../../../common/google/GooglePlacesAutocomplete';

import '../../../../styles/css/components/airTickets/initBook/bookProfile/air-tickets-booking-profile-edit-form.css';

class AirTicketsBookingProfileEditForm extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.handleCitySelect = this.handleCitySelect.bind(this);
  }

  onChange(e) {
    this.props.onChange(e.target.name, e.target.value);
  }

  handleCitySelect(place) {
    this.props.onChange('contactCityName', place.formatted_address);
  }

  render() {
    const { contactInfo, countries } = this.props;
    const { contactTitle, firstName, lastName, contactEmail, contactPhone, contactCountryCode, contactZip, contactCityName, contactAddress } = contactInfo;

    return (
      <div className="air-tickets-contact-edit-form">
        <h2>Profile</h2>
        <hr />
        <form onSubmit={(e) => { e.preventDefault(); this.props.enableNextSection('invoice'); }}>
          <div className="contact-name-wrapper">
            <div className="contact-title">
              <label htmlFor="title">Title <span className="mandatory">*</span></label>
              <div className="select">
                <select id="title" name="contactTitle" value={contactTitle || ''} onChange={this.onChange}>
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
          <div className="email">
            <label htmlFor="contactEmail">Email <span className="mandatory">*</span></label>
            <input id="contactEmail" name="contactEmail" value={contactEmail || ''} onChange={this.onChange} type="email" required />
          </div>
          <div className="phone-number">
            <label htmlFor="contactPhone">Phone Number <span className="mandatory">*</span></label>
            <input id="contactPhone" name="contactPhone" value={contactPhone || ''} onChange={this.onChange} type="number" required />
          </div>
          <div className="address-info">
            <div className="country-code">
              <label htmlFor="contactCountryCode">Country <span className="mandatory">*</span></label>
              <div className="select">
                <select id="contactCountryCode" name="contactCountryCode" value={contactCountryCode || ''} onChange={this.onChange}>
                  <option defaultValue="" disabled hidden></option>
                  {countries && countries.map((country, countryIndex) => {
                    return <option key={countryIndex} value={country.code} onChange={this.onChange}>{country.name}</option>;
                  })}
                </select>
              </div>
            </div>
            <div className="zip-code">
              <label htmlFor="contactZip">Zip Code <span className="mandatory">*</span></label>
              <div>
                <input id="contactZip" name="contactZip" value={contactZip || ''} onChange={this.onChange} type="number" required />
              </div>
            </div>
            <div className="city">
              <label htmlFor="cityName">Which city <span className="mandatory">*</span></label>
              <Select
                value={contactCityName || ''}
                onChange={this.onChange}
                name="contactCityName"
                onPlaceSelected={this.handleCitySelect}
                types={['(cities)']}
                componentRestrictions={{ country: (contactCountryCode && contactCountryCode.toLowerCase()) || '' }}
                disabled={!contactCountryCode}
                placeholder=""
                required
              />
            </div>
          </div>
          <div className="address">
            <label htmlFor="contactAddress">Address <span className="mandatory">*</span></label>
            <input id="contactAddress" name="contactAddress" value={contactAddress || ''} onChange={this.onChange} type="text" />
          </div>
          <div className="buttons-wrapper">
            <button type="submit" className="btn">Next</button>
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
  enableNextSection: PropTypes.func
};

export default AirTicketsBookingProfileEditForm;
