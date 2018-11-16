import React, { Component } from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import Loader from '../../../common/loader';

import '../../../../styles/css/components/airTickets/initBook/bookProfile/air-tickets-booking-profile-services-form.css';

const SERVICES_TYPES_CODES = {
  3: 'Baggage',
  4: 'Checkin bag for outward',
  5: 'Checking bag for return',
  6: 'Hand baggage',
  7: 'Checkin',
  8: 'Priority boarding',
  9: 'Dining/meal',
  10: 'Cabins'
};

class AirTicketsBookingProfileServicesForm extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.props.onChange(e.target.name, e.target.value);
  }

  getSelectionNameByServiceType(serviceTypeName, serviceOption) {
    switch (serviceTypeName) {
      case 'Checkin bag for outward':
        return `${serviceOption.bags} bag. Price - ${serviceOption.price}`;
      case 'Checking bag for return':
        return `${serviceOption.bags} bag. Price - ${serviceOption.price}`;
      default:
        return '';
    }
  }

  render() {
    const { services, servicesInfo } = this.props;

    if (!services) {
      return <Loader />;
    }

    return (
      <div className="air-tickets-services-form">
        <h2>Services</h2>
        <hr />
        <form onSubmit={(e) => { e.preventDefault(); this.props.enableNextSection('passengers'); }}>
          {services.map((service, serviceIndex) => {
            const selectedService = servicesInfo.filter(x => x.id === service.serviceId)[0];
            const selectedServiceValue = selectedService ? selectedService.serviceValue : '';
            return (
              <div key={serviceIndex} className="service">
                <div className="service-title">{SERVICES_TYPES_CODES[service.serviceType]}</div>
                <div className="select">
                  <select name={service.serviceId} value={selectedServiceValue} onChange={this.onChange}>
                    <option defaultValue="" disabled hidden></option>
                    {service.serviceSelections.map((selection, selectionIndex) => {
                      return <option key={selectionIndex} value={selection.value} onChange={this.onChange}>{this.getSelectionNameByServiceType(SERVICES_TYPES_CODES[service.serviceType], selection)}</option>;
                    })}
                  </select>
                </div>
              </div>
            );
          })}
          <div className="buttons-wrapper">
            <NavLink to={{ pathname: `/tickets/results/initBook/${this.props.match.params.id}/profile/invoice`, search: this.props.location.search }} className="btn-back" id="btn-continue">
              <i className="fa fa-long-arrow-left" aria-hidden="true"></i>
              &nbsp;Back</NavLink>
            <button type="submit" className="btn">Next</button>
          </div>
        </form>
      </div >
    );
  }
}

AirTicketsBookingProfileServicesForm.propTypes = {
  services: PropTypes.array,
  servicesInfo: PropTypes.array,
  onChange: PropTypes.func,
  enableNextSection: PropTypes.func,

  // Router props
  match: PropTypes.object,
  location: PropTypes.object
};

export default withRouter(AirTicketsBookingProfileServicesForm);
