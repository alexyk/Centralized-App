import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from '../../../common/google/GooglePlacesAutocomplete';

import '../../../../styles/css/components/airTickets/initBook/book/air-tickets-booking-profile-invoice-form.css';

class AirTicketsBookingProfileInvoiceForm extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.handleCitySelect = this.handleCitySelect.bind(this);
  }

  onChange(e) {
    this.props.onChange(e.target.name, e.target.value);
  }

  handleCitySelect(place) {
    this.props.onChange('companyCity', place.formatted_address);
  }

  render() {
    const { invoiceInfo, countries } = this.props;
    const { companyName, companyCountryCode, companyCity, companyAddress, companyCityZipCode } = invoiceInfo;

    return (
      <div className="air-tickets-invoice-form">
        <h2>Invoice</h2>
        <hr />
        <form onSubmit={(e) => { e.preventDefault(); this.props.enableNextSection('services'); }}>
          <div className="company-name">
            <label htmlFor="companyName">Company name <span className="mandatory">*</span></label>
            <input id="companyName" name="companyName" value={companyName} onChange={this.onChange} type="text" required />
          </div>
          <div className="company-city">
            <div className="country-code">
              <label htmlFor="countryCode">Country <span className="mandatory">*</span></label>
              <div className="select">
                <select id="country-code" name="companyCountryCode" value={companyCountryCode} onChange={this.onChange} required>
                  <option defaultValue="" disabled hidden></option>
                  {countries && countries.map((country, countryIndex) => {
                    return <option key={countryIndex} value={country.code} onChange={this.onChange}>{country.name}</option>;
                  })}
                </select>
              </div>
            </div>
            <div className="zip-code">
              <label htmlFor="zipCode">Zip Code <span className="mandatory">*</span></label>
              <div>
                <input id="zipCode" name="companyCityZipCode" value={companyCityZipCode} onChange={this.onChange} type="number" required />
              </div>
            </div>
            <div className="city-name">
              <label htmlFor="cityName">Which city <span className="mandatory">*</span></label>
              <Select
                value={companyCity}
                onChange={this.onChange}
                name="companyCity"
                onPlaceSelected={this.handleCitySelect}
                types={['(cities)']}
                componentRestrictions={{ country: companyCountryCode.toLowerCase() }}
                disabled={!companyCountryCode}
                placeholder=""
                required
              />
            </div>
          </div>
          <div className="company-address">
            <label htmlFor="companyAddress">Company address <span className="mandatory">*</span></label>
            <input id="companyAddress" name="companyAddress" value={companyAddress} onChange={this.onChange} type="text" required />
          </div>
          <div className="buttons-wrapper">
            <button type="submit" className="btn">Next</button>
          </div>
        </form>
      </div>
    );
  }
}

AirTicketsBookingProfileInvoiceForm.propTypes = {
  invoiceInfo: PropTypes.object,
  countries: PropTypes.array,
  onChange: PropTypes.func,
  enableNextSection: PropTypes.func
};

export default AirTicketsBookingProfileInvoiceForm;
