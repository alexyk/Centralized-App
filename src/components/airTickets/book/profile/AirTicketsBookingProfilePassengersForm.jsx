import React, { Component, Fragment } from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import '../../../../styles/css/components/airTickets/book/profile/air-tickets-booking-profile-passengers-form.css';
import { NotificationManager } from 'react-notifications';
import { LONG } from '../../../../constants/notificationDisplayTimes';

const PASSENGER_TYPES_CODES = {
  adult: 'ADT',
  child: 'CHD',
  infant: 'INF'
};

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

class AirTicketsBookingProfilePassengersForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPassengerIndex: 0
    };

    this.onChange = this.onChange.bind(this);
    this.onChangeService = this.onChangeService.bind(this);
    this.validatePassengersInfo = this.validatePassengersInfo.bind(this);
  }

  onChange(e) {
    this.props.onChange(this.state.currentPassengerIndex, e.target.name, e.target.value);
  }

  onChangeService(e) {
    this.props.onChangeService(this.state.currentPassengerIndex, e.target.name, e.target.value);
  }

  togglePassenger(passengerIndex) {
    this.setState({
      currentPassengerIndex: passengerIndex
    });
  }

  getCurrencySign(currency) {
    let currencySign = '$';
    if (currency === 'GBP') currencySign = '£';
    if (currency === 'EUR') currencySign = '€';
    return currencySign;
  }

  getSelectionNameByServiceType(serviceTypeName, serviceOption) {
    switch (serviceTypeName) {
      case 'Baggage':
        return `${serviceOption.bags ? `Bags - ${serviceOption.bags}.` : ''}${serviceOption.maxWeight ? ` Max weight - ${serviceOption.maxWeight}.` : ''}${serviceOption.price ? ` Price - ${this.getCurrencySign(this.props.currency)}${serviceOption.price}.` : ''}`;
      case 'Checkin bag for outward':
        return `${serviceOption.bags ? `Bags - ${serviceOption.bags}.` : ''}${serviceOption.maxWeight ? ` Max weight - ${serviceOption.maxWeight}.` : ''}${serviceOption.price ? ` Price - ${this.getCurrencySign(this.props.currency)}${serviceOption.price}.` : ''}`;
      case 'Checking bag for return':
        return `${serviceOption.bags ? `Bags - ${serviceOption.bags}.` : ''}${serviceOption.maxWeight ? ` Max weight - ${serviceOption.maxWeight}.` : ''}${serviceOption.price ? ` Price - ${this.getCurrencySign(this.props.currency)}${serviceOption.price}.` : ''}`;
      case 'Hand baggage':
        return 'Hand baggage is not formatted.';
      case 'Checkin':
        return 'Checkin is not formatted.';
      case 'Priority boarding':
        return `${serviceOption.bags ? `Bags - ${serviceOption.bags}.` : ''}${serviceOption.maxWeight ? ` Max weight - ${serviceOption.maxWeight}.` : ''}${serviceOption.price ? ` Price - ${this.getCurrencySign(this.props.currency)}${serviceOption.price}.` : ''}`;
      case 'Dining/meal':
        return 'Dining/meal is not formatted.';
      case 'Cabins':
        return 'Cabins is not formatted.';
      default:
        return '';
    }
  }

  validatePassengersInfo() {
    const { passengersInfo } = this.props;

    let isValidPassengerInfo = true;

    for (let i = 0; i < passengersInfo.length; i++) {
      for (let key in passengersInfo[i]) {
        if (key !== 'title' && key !== 'options' && !passengersInfo[i][key]) {
          NotificationManager.warning(`Passenger ${i + 1} - ${key} is required!`, '', LONG);
          this.setState({
            currentPassengerIndex: i
          });
          isValidPassengerInfo = false;
          break;
        }
      }
      if (!isValidPassengerInfo) {
        break;
      }
    }

    this.props.initBooking();
  }

  render() {
    const { passengersInfo, countries, services, isFlightServices, isBookingProccess } = this.props;
    const { currentPassengerIndex } = this.state;

    let years = [];
    let passportExpYears = [];
    const currentYear = (new Date()).getFullYear();

    for (let i = currentYear; i >= 1940; i--) {
      years.push(<option key={i} value={i}>{i}</option>);
    }

    for (let i = currentYear; i < currentYear + 10; i++) {
      passportExpYears.push(<option key={i} value={i}>{i}</option>);
    }

    let passengersServices;
    if (services && services.filter(service => service.perPassenger).length > 0) {
      passengersServices = services.filter(service => service.perPassenger);
    }

    return (
      <div className="air-tickets-passengers-form">
        <h2>Passengers Details</h2>
        <hr />
        <form onSubmit={(e) => { e.preventDefault(); this.validatePassengersInfo(); }}>
          {passengersInfo.map((passenger, passengerIndex) => {
            return (
              <Fragment key={passengerIndex}>
                <div className="passenger-form-title">
                  <h4>Passenger</h4>
                  {currentPassengerIndex === passengerIndex ? <div className="toggle"><span className="fa fa-angle-down" onClick={() => this.togglePassenger(-1)} /></div> : <div className="toggle"><span className="fa fa-angle-right" onClick={() => this.togglePassenger(passengerIndex)} /></div>}
                </div>
                <hr />
                {currentPassengerIndex === passengerIndex &&
                  <div className="passenger">
                    <div className="passenger-name-wrapper">
                      <div className="passenger-title">
                        <label htmlFor="title">Title <span className="mandatory">*</span></label>
                        <div className="select">
                          <select id="title" name="title" value={passenger.title} onChange={this.onChange}>
                            <option defaultValue="" disabled hidden></option>
                            <option value="Mr" onChange={this.onChange}>Mr</option>
                            <option value="Mrs" onChange={this.onChange}>Mrs</option>
                          </select>
                        </div>
                      </div>
                      <div className="passenger-name">
                        <label htmlFor="firstName">First name <span className="mandatory">*</span></label>
                        <input id="firstName" name="firstName" value={passenger.firstName} onChange={this.onChange} type="text" required />
                      </div>
                      <div className="passenger-name">
                        <label htmlFor="lastName">Last name <span className="mandatory">*</span></label>
                        <input id="lastName" name="lastName" value={passenger.lastName} onChange={this.onChange} type="text" required />
                      </div>
                    </div>
                    <div className="birthdate">
                      <div className="birthdate-month">
                        <label htmlFor="birthdateMonth">Birthdate <span className="mandatory">*</span></label>
                        <div className='select'>
                          <select name="birthdateMonth" id="birthdateMonth" onChange={this.onChange} value={passenger.birthdateMonth} required>
                            <option disabled value="">Month</option>
                            <option value="01">January</option>
                            <option value="02">February</option>
                            <option value="03">March</option>
                            <option value="04">April</option>
                            <option value="05">May</option>
                            <option value="06">June</option>
                            <option value="07">July</option>
                            <option value="08">August</option>
                            <option value="09">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                          </select>
                        </div>
                      </div>
                      <div className="birthdate-day">
                        <label htmlFor="birthdateDay">&nbsp;</label>
                        <div className='select'>
                          <select name="birthdateDay" id="birthdateDay" onChange={this.onChange} value={passenger.birthdateDay} required>
                            <option disabled value="">Day</option>
                            {Array.apply(null, Array(32)).map(function (item, i) {
                              return i > 0 && <option key={i} value={i < 10 ? `0${i}` : i}>{i}</option>;
                            })}
                          </select>
                        </div>
                      </div>
                      <div className="birthdate-year">
                        <label htmlFor="birthdateYear">&nbsp;</label>
                        <div className='select'>
                          <select name="birthdateYear" id="birthdateYear" onChange={this.onChange} value={passenger.birthdateYear} required>
                            <option disabled value="">Year</option>
                            {years}
                          </select>
                        </div>
                      </div>
                      <div className="passenger-type">
                        <label htmlFor="passengerType">Type <span className="mandatory">*</span></label>
                        <div className='select'>
                          <select name="type" id="passengerType" onChange={this.onChange} value={passenger.type} required>
                            <option defaultValue="" disabled hidden></option>
                            <option value={PASSENGER_TYPES_CODES.adult}>Adult</option>
                            <option value={PASSENGER_TYPES_CODES.child}>Child</option>
                            <option value={PASSENGER_TYPES_CODES.infant}>Infant</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="passport-number-wrapper">
                      <div className="nationality-code">
                        <label htmlFor="nationalityCode">Nationality <span className="mandatory">*</span></label>
                        <div className="select">
                          <select id="nationalityCode" name="nationality" value={passenger.nationality} onChange={this.onChange} required>
                            <option defaultValue="" disabled hidden></option>
                            {countries && countries.map((country, countryIndex) => {
                              return <option key={countryIndex} value={country.code} onChange={this.onChange}>{country.name}</option>;
                            })}
                          </select>
                        </div>
                      </div>
                      <div className="passport-number">
                        <label htmlFor="passportNumber">Passport No <span className="mandatory">*</span></label>
                        <input id="passportNumber" name="passportNumber" value={passenger.passportNumber} onChange={this.onChange} type="text" required />
                      </div>
                      <div className="country-code">
                        <label htmlFor="countryCode">Passport Country <span className="mandatory">*</span></label>
                        <div className="select">
                          <select id="countryCode" name="passportIssueCountry" value={passenger.passportIssueCountry} onChange={this.onChange} required>
                            <option defaultValue="" disabled hidden></option>
                            {countries && countries.map((country, countryIndex) => {
                              return <option key={countryIndex} value={country.code} onChange={this.onChange}>{country.name}</option>;
                            })}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="passport-exp">
                      <div className="passport-exp-month">
                        <label htmlFor="passportExpMonth">Passport expired <span className="mandatory">*</span></label>
                        <div className='select'>
                          <select name="passportExpMonth" id="passportExpMonth" onChange={this.onChange} value={passenger.passportExpMonth} required>
                            <option disabled value="">Month</option>
                            <option value="01">January</option>
                            <option value="02">February</option>
                            <option value="03">March</option>
                            <option value="04">April</option>
                            <option value="05">May</option>
                            <option value="06">June</option>
                            <option value="07">July</option>
                            <option value="08">August</option>
                            <option value="09">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                          </select>
                        </div>
                      </div>
                      <div className="passport-exp-day">
                        <label htmlFor="passportExpDay">&nbsp;</label>
                        <div className='select'>
                          <select name="passportExpDay" id="passportExpDay" onChange={this.onChange} value={passenger.passportExpDay} required>
                            <option disabled value="">Day</option>
                            {Array.apply(null, Array(32)).map(function (item, i) {
                              return i > 0 && <option key={i} value={i}>{i}</option>;
                            })}
                          </select>
                        </div>
                      </div>
                      <div className="passport-exp-year">
                        <label htmlFor="passportExpYear">&nbsp;</label>
                        <div className='select'>
                          <select name="passportExpYear" id="passportExpYear" onChange={this.onChange} value={passenger.passportExpYear} required>
                            <option disabled value="">Year</option>
                            {passportExpYears}
                          </select>
                        </div>
                      </div>
                    </div>
                    {passengersServices &&
                      <div className="services">
                        <h5>Services</h5>
                        {passengersServices.map((service, serviceIndex) => {
                          const selectedService = passenger.options.filter(x => x.id === service.id)[0];
                          const selectedServiceValue = selectedService ? selectedService.serviceValue : '';
                          return (
                            <div key={serviceIndex} className="service">
                              <div className="service-title">{SERVICES_TYPES_CODES[service.type]}</div>
                              <div className="select">
                                <select name={service.id} value={selectedServiceValue} onChange={this.onChangeService}>
                                  <option defaultValue="" disabled hidden></option>
                                  {service.options.map((option, selectionIndex) => {
                                    return <option key={selectionIndex} value={option.value} onChange={this.onChangeService}>{this.getSelectionNameByServiceType(SERVICES_TYPES_CODES[service.type], option)}</option>;
                                  })}
                                </select>
                              </div>
                            </div>
                          );
                        })}
                      </div>}
                  </div>
                }
              </Fragment>
            );
          })}
          <div className="buttons-wrapper">
            <NavLink to={{ pathname: `/tickets/results/initBook/${this.props.match.params.id}/profile/${isFlightServices ? 'services' : 'invoice'}`, search: this.props.location.search }} className="btn-back" id="btn-continue">
              <i className="fa fa-long-arrow-left" aria-hidden="true"></i>
              &nbsp;Back</NavLink>
            <button type="submit" disabled={isBookingProccess} className="button">{isBookingProccess ? 'Processing...' : 'Proceed'}</button>
          </div>
        </form>
      </div>
    );
  }
}

AirTicketsBookingProfilePassengersForm.propTypes = {
  passengersInfo: PropTypes.array,
  countries: PropTypes.array,
  services: PropTypes.array,
  isFlightServices: PropTypes.bool,
  currency: PropTypes.string,
  isBookingProccess: PropTypes.bool,
  onChange: PropTypes.func,
  onChangeService: PropTypes.func,
  initBooking: PropTypes.func,

  // Router props
  match: PropTypes.object,
  location: PropTypes.object
};

export default withRouter(AirTicketsBookingProfilePassengersForm);
