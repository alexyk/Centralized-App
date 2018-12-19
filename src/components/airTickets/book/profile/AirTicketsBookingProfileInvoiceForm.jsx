import React, { Component } from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import ReactSelect from 'react-select';
import Select from '../../../common/google/GooglePlacesAutocomplete';

import '../../../../styles/css/components/airTickets/book/profile/air-tickets-booking-profile-invoice-form.css';

const customStyles = {
  container: (styles) => ({
    ...styles,
    flex: '1 1 0',
    outline: 'none',
    cursor: 'pointer',
    border: '1px solid #cfcfcf',
    borderRadius: '5px',
    backgroundColor: 'white',
    padding: '5.5px 15px',
    width: '100%',
  }),
  valueContainer: (styles) => ({
    ...styles,
    fontSize: '1.2em'
  }),
  input: (styles) => ({
    ...styles,
    outline: 'none',
  }),
  control: (styles) => ({
    ...styles,
    cursor: 'pointer',
    boxShadow: 'none',
    border: 0,
  }),
  indicatorSeparator: (styles) => ({
    ...styles,
    display: 'none'
  }),
  menu: (styles) => ({
    ...styles,
    marginTop: '20px'
  }),
  option: (styles, { data, isFocused, isSelected }) => {
    const color = isSelected ? '#d87a61' : 'black';
    return {
      ...styles,
      fontSize: '1.2em',
      textAlign: 'left',
      cursor: 'pointer',
      backgroundColor: isFocused
        ? '#f0f1f3'
        : 'none',
      color: isSelected
        ? color
        : data.color,
      fontWeight: isSelected && '400',
      paddingLeft: isSelected && '30px',
    };
  },
};

class AirTicketsBookingProfileInvoiceForm extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.handleCitySelect = this.handleCitySelect.bind(this);
    this.handleChangeCountry = this.handleChangeCountry.bind(this);
  }

  onChange(e) {
    this.props.onChange(e.target.name, e.target.value);
  }

  handleCitySelect(place) {
    this.props.onChange('city', place.formatted_address);
  }

  handleChangeCountry(selectedOption) {
    this.props.onChange('country', selectedOption);
  }

  render() {
    const { invoiceInfo, countries, hasFlightServices } = this.props;
    const { name, country, city, address, zip } = invoiceInfo;

    return (
      <div className="air-tickets-invoice-form">
        <h2>Invoice</h2>
        <hr />
        <form onSubmit={(e) => { e.preventDefault(); this.props.enableNextSection(hasFlightServices ? 'services' : 'passengers'); }}>
          <div className="company-name">
            <label htmlFor="invoiceCompanyName">Company name</label>
            <input id="invoiceCompanyName" name="name" value={name || ''} onChange={this.onChange} type="text" />
          </div>
          <div className="company-city">
            <div className="country-code">
              <label htmlFor="invoiceCompanyCountry">Country</label>
              <ReactSelect
                styles={customStyles}
                value={country}
                onChange={this.handleChangeCountry}
                options={countries}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.code}
                placeholder=""
              />
            </div>
            <div className="zip-code">
              <label htmlFor="invoiceCompanyZip">Zip Code</label>
              <div>
                <input id="invoiceCompanyZip" name="zip" value={zip || ''} onChange={this.onChange} type="number" />
              </div>
            </div>
            <div className="city-name">
              <label htmlFor="invoiceCompanyCity">Which city</label>
              <Select
                value={city || ''}
                onChange={this.onChange}
                name="city"
                onPlaceSelected={this.handleCitySelect}
                types={['(cities)']}
                componentRestrictions={{ country: (country && country.code.toLowerCase()) || '' }}
                disabled={!country}
                placeholder=""
              />
            </div>
          </div>
          <div className="company-address">
            <label htmlFor="invoiceCompanyAddress">Company address</label>
            <input id="invoiceCompanyAddress" name="address" value={address || ''} onChange={this.onChange} type="text" />
          </div>
          <div className="buttons-wrapper">
            <NavLink to={{ pathname: `/tickets/results/book/${this.props.match.params.id}/profile`, search: this.props.location.search }} className="btn-back" id="btn-continue">
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
  hasFlightServices: PropTypes.bool,
  countries: PropTypes.array,
  onChange: PropTypes.func,
  enableNextSection: PropTypes.func,

  // Router props
  match: PropTypes.object,
  location: PropTypes.object
};

export default withRouter(AirTicketsBookingProfileInvoiceForm);
