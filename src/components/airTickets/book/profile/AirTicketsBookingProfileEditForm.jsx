import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from '../../../common/google/GooglePlacesAutocomplete';

import '../../../../styles/css/components/airTickets/book/profile/air-tickets-booking-profile-edit-form.css';

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
    this.props.onChange('city', place.formatted_address);
  }

  render() {
    const { contactInfo, countries } = this.props;
    const { title, firstName, lastName, email, phone, country, zip, city, address } = contactInfo;

    return (
      <div className="air-tickets-contact-edit-form">
        <h2>Profile</h2>
        <hr />
        <form onSubmit={(e) => { e.preventDefault(); this.props.enableNextSection('invoice'); }}>
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
          <div className="email">
            <label htmlFor="contactEmail">Email <span className="mandatory">*</span></label>
            <input id="contactEmail" name="email" value={email || ''} onChange={this.onChange} type="email" required />
          </div>
          <div className="phone-number">
            <label htmlFor="contactPhone">Phone Number <span className="mandatory">*</span></label>
            <input id="contactPhone" name="phone" value={phone || ''} onChange={this.onChange} type="number" required />
          </div>
          <div className="address-info">
            <div className="country-code">
              <label htmlFor="contactCountryCode">Country <span className="mandatory">*</span></label>
              <div className="select">
                <select id="contactCountryCode" name="country" value={country || ''} onChange={this.onChange}>
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
                <input id="contactZip" name="zip" value={zip || ''} onChange={this.onChange} type="number" required />
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
                componentRestrictions={{ country: (country && country.toLowerCase()) || '' }}
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
  enableNextSection: PropTypes.func
};

export default AirTicketsBookingProfileEditForm;
