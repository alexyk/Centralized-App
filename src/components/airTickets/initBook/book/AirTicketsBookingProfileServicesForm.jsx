import React, { Component } from 'react';
import PropTypes from 'prop-types';

import '../../../../styles/css/components/airTickets/initBook/book/air-tickets-booking-profile-services-form.css';

class AirTicketsBookingProfileServicesForm extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.props.onChange(e.target.name, e.target.value);
  }

  render() {
    const { services, servicesInfo } = this.props;
    console.log(services);

    return (
      <div className="air-tickets-services-form">
        <h2>Services</h2>
        <hr />
        <form onSubmit={(e) => { e.preventDefault(); this.props.enableNextSection('passengers'); }}>

          <div className="buttons-wrapper">
            <div>
              {/* <div className="country-code">
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
              </div> */}
            </div>
            <button type="submit" className="btn">Next</button>
          </div>
        </form>
      </div>
    );
  }
}

AirTicketsBookingProfileServicesForm.propTypes = {
  services: PropTypes.array,
  servicesInfo: PropTypes.array,
  onChange: PropTypes.func,
  enableNextSection: PropTypes.func
};

export default AirTicketsBookingProfileServicesForm;
