import React, { Component } from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import Select from '../../../common/google/GooglePlacesAutocomplete';

import '../../../../styles/css/components/airTickets/initBook/bookProfile/air-tickets-booking-profile-invoice-form.css';

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
    this.props.onChange('invoiceCompanyCity', place.formatted_address);
  }

  render() {
    const { invoiceInfo, countries, isFlightServices } = this.props;
    const { invoiceCompanyName, invoiceCompanyCountry, invoiceCompanyCity, invoiceCompanyAddress, invoiceCompanyZip } = invoiceInfo;

    return (
      <div className="air-tickets-invoice-form">
        <h2>Invoice</h2>
        <hr />
        <form onSubmit={(e) => { e.preventDefault(); this.props.enableNextSection(isFlightServices ? 'services' : 'passengers'); }}>
          <div className="company-name">
            <label htmlFor="invoiceCompanyName">Company name</label>
            <input id="invoiceCompanyName" name="invoiceCompanyName" value={invoiceCompanyName || ''} onChange={this.onChange} type="text" />
          </div>
          <div className="company-city">
            <div className="country-code">
              <label htmlFor="invoiceCompanyCountry">Country</label>
              <div className="select">
                <select id="invoiceCompanyCountry" name="invoiceCompanyCountry" value={invoiceCompanyCountry || ''} onChange={this.onChange}>
                  <option defaultValue="" disabled hidden></option>
                  {countries && countries.map((country, countryIndex) => {
                    return <option key={countryIndex} value={country.code} onChange={this.onChange}>{country.name}</option>;
                  })}
                </select>
              </div>
            </div>
            <div className="zip-code">
              <label htmlFor="invoiceCompanyZip">Zip Code</label>
              <div>
                <input id="invoiceCompanyZip" name="invoiceCompanyZip" value={invoiceCompanyZip || ''} onChange={this.onChange} type="number" />
              </div>
            </div>
            <div className="city-name">
              <label htmlFor="invoiceCompanyCity">Which city</label>
              <Select
                value={invoiceCompanyCity || ''}
                onChange={this.onChange}
                name="invoiceCompanyCity"
                onPlaceSelected={this.handleCitySelect}
                types={['(cities)']}
                componentRestrictions={{ country: (invoiceCompanyCountry && invoiceCompanyCountry.toLowerCase()) || '' }}
                disabled={!invoiceCompanyCountry}
                placeholder=""
              />
            </div>
          </div>
          <div className="company-address">
            <label htmlFor="invoiceCompanyAddress">Company address</label>
            <input id="invoiceCompanyAddress" name="invoiceCompanyAddress" value={invoiceCompanyAddress || ''} onChange={this.onChange} type="text" />
          </div>
          <div className="buttons-wrapper">
            <NavLink to={{ pathname: `/tickets/results/initBook/${this.props.match.params.id}/profile`, search: this.props.location.search }} className="btn-back" id="btn-continue">
              <i className="fa fa-long-arrow-left" aria-hidden="true"></i>
              &nbsp;Back</NavLink>
            <button type="submit" className="btn">Next</button>
          </div>
        </form>
      </div>
    );
  }
}

AirTicketsBookingProfileInvoiceForm.propTypes = {
  invoiceInfo: PropTypes.object,
  isFlightServices: PropTypes.bool,
  countries: PropTypes.array,
  onChange: PropTypes.func,
  enableNextSection: PropTypes.func,

  // Router props
  match: PropTypes.object,
  location: PropTypes.object
};

export default withRouter(AirTicketsBookingProfileInvoiceForm);
