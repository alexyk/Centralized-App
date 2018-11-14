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
    return (
      <div className="air-tickets-services-form">
        <h2>Services</h2>
        <hr />
        <form onSubmit={(e) => { e.preventDefault(); this.props.enableNextSection('passengers'); }}>
          
          <div className="buttons-wrapper">
            <button type="submit" className="btn">Next</button>
          </div>
        </form>
      </div>
    );
  }
}

AirTicketsBookingProfileServicesForm.propTypes = {
  servicesInfo: PropTypes.object,
  onChange: PropTypes.func,
  enableNextSection: PropTypes.func
};

export default AirTicketsBookingProfileServicesForm;
