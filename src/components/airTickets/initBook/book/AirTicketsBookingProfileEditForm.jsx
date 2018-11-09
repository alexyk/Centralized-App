import React from 'react';
import PropTypes from 'prop-types';
import Select from '../../../common/google/GooglePlacesAutocomplete';
import { Config } from '../../../../config';

import '../../../../styles/css/components/airTickets/initBook/book/air-tickets-booking-profile-edit-form.css';

class AirTicketsBookingProfileEditForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      contactTitle: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      countryCode: '',
      zipCode: '',
      cityName: '',
      address: '',
      countries: ''
    };

    this.onChange = this.onChange.bind(this);
    this.handleCitySelect = this.handleCitySelect.bind(this);
    this.handleNext = this.handleNext.bind(this);
  }

  componentDidMount() {
    fetch(`${Config.getValue('apiHost')}flight/country/all`)
      .then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            this.setState({
              countries: data
            });
          });
        } else {
          console.log(res);
        }
      });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleCitySelect(place) {
    this.setState({ cityName: place.formatted_address });
  }

  handleNext(e) {
    if (e) {
      e.preventDefault();
    }

    const { contactTitle, firstName, lastName, email, phoneNumber, countryCode, zipCode, cityName, address } = this.state;

    const contactInfo = {
      contactTitle,
      firstName,
      lastName,
      email,
      phoneNumber,
      countryCode,
      zipCode,
      cityName,
      address
    };

    this.props.saveContactInfo(contactInfo);
  }

  render() {
    const { contactTitle, firstName, lastName, email, phoneNumber, countryCode, zipCode, cityName, address, countries } = this.state;

    return (
      <div className="air-tickets-contact-edit-form">
        <h2>Profile</h2>
        <hr />
        <form onSubmit={this.handleNext}>
          <div className="contact-name-wrapper">
            <div className="contact-title">
              <label htmlFor="title">Title <span className="mandatory">*</span></label>
              <div className="select">
                <select id="title" name="contactTitle" value={contactTitle} onChange={this.onChange}>
                  <option value="" selected disabled hidden></option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                </select>
              </div>
            </div>
            <div className="contact-name">
              <label htmlFor="firstName">First name <span className="mandatory">*</span></label>
              <input id="firstName" name="firstName" value={firstName} onChange={this.onChange} type="text" required />
            </div>
            <div className="contact-name">
              <label htmlFor="lastName">Last name <span className="mandatory">*</span></label>
              <input id="lastName" name="lastName" value={lastName} onChange={this.onChange} type="text" required />
            </div>
          </div>
          <div className="email">
            <label htmlFor="email">Email <span className="mandatory">*</span></label>
            <input id="email" name="email" value={email} onChange={this.onChange} type="email" required />
          </div>
          <div className="phone-number">
            <label htmlFor="phoneNumber">Phone Number <span className="mandatory">*</span></label>
            <input id="phoneNumber" name="phoneNumber" value={phoneNumber} onChange={this.onChange} type="number" required />
          </div>
          <div className="address-info">
            <div className="country-code">
              <label htmlFor="countryCode">Country <span className="mandatory">*</span></label>
              <div className="select">
                <select id="country-code" name="countryCode" value={countryCode} onChange={this.onChange}>
                  <option value="" selected disabled hidden></option>
                  {countries && countries.map((country, countryIndex) => {
                    return <option key={countryIndex} value={country.code}>{country.name}</option>;
                  })}
                </select>
              </div>
            </div>
            <div className="zip-code">
              <label htmlFor="zipCode">Zip Code <span className="mandatory">*</span></label>
              <div>
                <input id="zipCode" name="zipCode" value={zipCode} onChange={this.onChange} type="number" required />
              </div>
            </div>
            <div className="city">
              <label htmlFor="cityName">Which city <span className="mandatory">*</span></label>
              <Select
                value={cityName}
                onChange={this.onChange}
                name="cityName"
                onPlaceSelected={this.handleCitySelect}
                types={['(cities)']}
                componentRestrictions={{ country: this.state.countryCode.toLowerCase() }}
                disabled={!countryCode}
                placeholder=""
              />
            </div>
          </div>
          <div className="address">
            <label htmlFor="address">Address <span className="mandatory">*</span></label>
            <input id="address" name="address" value={address} onChange={this.onChange} type="text" />
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
  saveContactInfo: PropTypes.func
};

export default AirTicketsBookingProfileEditForm;
