import React, { Component, Fragment } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import PropTypes from 'prop-types';
import BookingSteps from '../../../common/bookingSteps';
import { Config } from '../../../../config';
import { CREATE_WALLET } from '../../../../constants/modals.js';
import { CurrencyConverter } from '../../../../services/utilities/currencyConverter';
import LocPrice from '../../../common/utility/LocPrice';
import { LONG } from '../../../../constants/notificationDisplayTimes';

import '../../../../styles/css/components/airTickets/book/confirm/air-tickets-booking-confirm-page.css';

const PASSENGER_TYPES = {
  ADT: 'Adult',
  CHD: 'Child',
  INF: 'Infant'
};

class AirTicketsBookingConfirmPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bookingDetails: ''
    };

    this.handlePayWithLOC = this.handlePayWithLOC.bind(this);
    this.requestBookingDetails = this.requestBookingDetails.bind(this);
    this.searchAirTickets = this.searchAirTickets.bind(this);
  }

  componentDidMount() {
    this.requestBookingDetails();
  }

  searchAirTickets(queryString) {
    this.props.history.push('/tickets/results' + queryString);
  }

  requestBookingDetails() {
    fetch(`${Config.getValue('apiHost')}flight/bookings/${this.props.match.params.id}`)
      .then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            if (data.success === false) {
              this.searchAirTickets(this.props.location.search);
              NotificationManager.warning(data.message, '', LONG);
            } else {
              this.setState({
                bookingDetails: data
              });
            }
          });
        } else {
          console.log(res);
        }
      });
  }

  convertMinutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${hours}h ${remainingMinutes}min`;
  }

  handlePayWithLOC() {
    fetch(`${Config.getValue('apiHost')}flight/bookings/issue`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ flightId: this.props.match.params.id })
    })
      .then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            console.log(data);
            if (data.success) {
              console.log(data);
              NotificationManager.success(data.documentStatus, '', LONG);
              this.props.history.push('/profile/tickets');
            } else {
              NotificationManager.warning(data.message, '', LONG);
            }
          });
        } else {
          console.log(res);
        }
      });
  }

  render() {
    const { bookingDetails } = this.state;
    const hasLocAddress = !!this.props.userInfo.locAddress;
    const currentCurrency = this.props.paymentInfo.currency;
    const { currencyExchangeRates } = this.props.exchangeRatesInfo;
    const userConfirmedPaymentWithLOC = false;

    if (!bookingDetails) {
      return <div className="loader"></div>;
    }

    console.log(bookingDetails);

    const flightProperties = bookingDetails.entities[0];
    const flightPriceInfo = flightProperties.properties.price;
    const departureInfo = flightProperties.segments.filter(s => s.group === '0');
    const returnInfo = flightProperties.segments.filter(s => s.group === '1');
    const bookingProperties = bookingDetails.properties;
    const passengersInfo = bookingProperties.passengers;

    const netTotalPriceInUserCurrency = currencyExchangeRates && CurrencyConverter.convert(currencyExchangeRates, flightPriceInfo.currency, currentCurrency, flightPriceInfo.basePrice);
    const servicesPriceInUserCurrency = currencyExchangeRates && CurrencyConverter.convert(currencyExchangeRates, flightPriceInfo.currency, currentCurrency, flightPriceInfo.optionalServices);
    const taxPriceInUserCurrency = currencyExchangeRates && CurrencyConverter.convert(currencyExchangeRates, flightPriceInfo.currency, currentCurrency, flightPriceInfo.tax);
    const totalFiatPriceInUserCurrency = currencyExchangeRates && CurrencyConverter.convert(currencyExchangeRates, flightPriceInfo.currency, currentCurrency, flightPriceInfo.total);


    return (
      <Fragment>
        <BookingSteps steps={['Search', 'Details', 'Prepare Booking', 'Confirm & Pay']} currentStepIndex={3} />
        <section className="air-tickets-booking-confirm">
          <div className="container">
            <div className="booking-details">
              <div className="booking-details-header">
                <h2>Confirm and Pay</h2>
                <h2>Hristo Skipernov</h2>
              </div>
              <hr />
              <div className="flight-details">
                <h4>Flight details</h4>
                <hr />
                <div className="flight-details-info">
                  <div className="departure-title">Departure</div>
                  <div className="departure-header">
                    <div className="carrier-title">Carrier info</div>
                    <div className="class-flight-title">Class flight info</div>
                    <div className="origin-title">Origin info</div>
                    <div className="destination-title">Destination info</div>
                    <div className="additional-info-title">Additional info</div>
                  </div>
                  {departureInfo.map((segment, segmentIndex) => {
                    return (
                      <Fragment key={segmentIndex}>
                        <div className="segment-title">{`${segment.origin.name} -> ${segment.destination.name}`}</div>
                        <div className="departure-details-info">
                          <div className="carrier">
                            <div className="carrier-item">
                              <div className="carrier-item-label">Name</div>
                              <div className="carrier-item-value">{segment.carrier.name}</div>
                            </div>
                            <div className="carrier-item">
                              <div className="carrier-item-label">Code</div>
                              <div className="carrier-item-value">{segment.carrier.code}</div>
                            </div>
                            <div className="carrier-item">
                              <div className="carrier-item-label">Flight number</div>
                              <div className="carrier-item-value">{segment.carrier.flightNumber}</div>
                            </div>
                          </div>
                          <div className="class-flight">
                            <div className="class-flight-item">
                              <div className="class-flight-item-label">Name</div>
                              <div className="class-flight-item-value">{segment.classInfo.name}</div>
                            </div>
                          </div>
                          <div className="origin">
                            <div className="origin-item">
                              <div className="origin-item-label">Name</div>
                              <div className="origin-item-value">{segment.origin.name}</div>
                            </div>
                            <div className="origin-item">
                              <div className="origin-item-label">Code</div>
                              <div className="origin-item-value">{segment.origin.code}</div>
                            </div>
                            <div className="origin-item">
                              <div className="origin-item-label">Date</div>
                              <div className="origin-item-value">{segment.origin.date}</div>
                            </div>
                            <div className="origin-item">
                              <div className="origin-item-label">Time</div>
                              <div className="origin-item-value">{segment.origin.time}</div>
                            </div>
                            <div className="origin-item">
                              <div className="origin-item-label">Timezone</div>
                              <div className="origin-item-value">{segment.origin.timezone}</div>
                            </div>
                            <div className="origin-item">
                              <div className="origin-item-label">Terminal</div>
                              <div className="origin-item-value">{segment.origin.terminal}</div>
                            </div>
                          </div>
                          <div className="destination">
                            <div className="destination-item">
                              <div className="destination-item-label">Name</div>
                              <div className="destination-item-value">{segment.destination.name}</div>
                            </div>
                            <div className="destination-item">
                              <div className="destination-item-label">Code</div>
                              <div className="destination-item-value">{segment.destination.code}</div>
                            </div>
                            <div className="destination-item">
                              <div className="destination-item-label">Date</div>
                              <div className="destination-item-value">{segment.destination.date}</div>
                            </div>
                            <div className="destination-item">
                              <div className="destination-item-label">Time</div>
                              <div className="destination-item-value">{segment.destination.time}</div>
                            </div>
                            <div className="destination-item">
                              <div className="destination-item-label">Timezone</div>
                              <div className="destination-item-value">{segment.destination.timezone}</div>
                            </div>
                            <div className="destination-item">
                              <div className="destination-item-label">Terminal</div>
                              <div className="destination-item-value">{segment.destination.terminal}</div>
                            </div>
                          </div>
                          <div className="additional-info">
                            <div className="additional-info-item">
                              <div className="additional-info-item-label">Flight time</div>
                              <div className="additional-info-item-value">{this.convertMinutesToTime(segment.flightTime)}</div>
                            </div>
                            <div className="additional-info-item">
                              <div className="additional-info-item-label">Wait time</div>
                              <div className="additional-info-item-value">{this.convertMinutesToTime(segment.waitTime)}</div>
                            </div>
                            <div className="additional-info-item">
                              <div className="additional-info-item-label">Tech stops</div>
                              <div className="additional-info-item-value">{segment.techStops}</div>
                            </div>
                            {segment.equipment &&
                              <div className="additional-info-item">
                                <div className="additional-info-item-label">Plane</div>
                                <div className="additional-info-item-value">{segment.equipment.name}</div>
                              </div>}
                          </div>
                        </div>
                      </Fragment>
                    );
                  })}
                  {returnInfo.length > 0 &&
                    <Fragment>
                      <div className="return-title">Return</div>
                      <div className="return-header">
                        <div className="carrier-title">Carrier info</div>
                        <div className="class-flight-title">Class flight info</div>
                        <div className="origin-title">Origin info</div>
                        <div className="destination-title">Destination info</div>
                        <div className="additional-info-title">Additional info</div>
                      </div>
                      {returnInfo.map((segment, segmentIndex) => {
                        return (
                          <Fragment key={segmentIndex}>
                            <div className="segment-title">{`${segment.origin.name} -> ${segment.destination.name}`}</div>
                            <div className="return-details-info">
                              <div className="carrier">
                                <div className="carrier-item">
                                  <div className="carrier-item-label">Name</div>
                                  <div className="carrier-item-value">{segment.carrier.name}</div>
                                </div>
                                <div className="carrier-item">
                                  <div className="carrier-item-label">Code</div>
                                  <div className="carrier-item-value">{segment.carrier.code}</div>
                                </div>
                                <div className="carrier-item">
                                  <div className="carrier-item-label">Flight number</div>
                                  <div className="carrier-item-value">{segment.carrier.flightNumber}</div>
                                </div>
                              </div>
                              <div className="class-flight">
                                <div className="class-flight-item">
                                  <div className="class-flight-item-label">Name</div>
                                  <div className="class-flight-item-value">{segment.classInfo.name}</div>
                                </div>
                              </div>
                              <div className="origin">
                                <div className="origin-item">
                                  <div className="origin-item-label">Name</div>
                                  <div className="origin-item-value">{segment.origin.name}</div>
                                </div>
                                <div className="origin-item">
                                  <div className="origin-item-label">Code</div>
                                  <div className="origin-item-value">{segment.origin.code}</div>
                                </div>
                                <div className="origin-item">
                                  <div className="origin-item-label">Date</div>
                                  <div className="origin-item-value">{segment.origin.date}</div>
                                </div>
                                <div className="origin-item">
                                  <div className="origin-item-label">Time</div>
                                  <div className="origin-item-value">{segment.origin.time}</div>
                                </div>
                                <div className="origin-item">
                                  <div className="origin-item-label">Timezone</div>
                                  <div className="origin-item-value">{segment.origin.timezone}</div>
                                </div>
                                <div className="origin-item">
                                  <div className="origin-item-label">Terminal</div>
                                  <div className="origin-item-value">{segment.origin.terminal}</div>
                                </div>
                              </div>
                              <div className="destination">
                                <div className="destination-item">
                                  <div className="destination-item-label">Name</div>
                                  <div className="destination-item-value">{segment.destination.name}</div>
                                </div>
                                <div className="destination-item">
                                  <div className="destination-item-label">Code</div>
                                  <div className="destination-item-value">{segment.destination.code}</div>
                                </div>
                                <div className="destination-item">
                                  <div className="destination-item-label">Date</div>
                                  <div className="destination-item-value">{segment.destination.date}</div>
                                </div>
                                <div className="destination-item">
                                  <div className="destination-item-label">Time</div>
                                  <div className="destination-item-value">{segment.destination.time}</div>
                                </div>
                                <div className="destination-item">
                                  <div className="destination-item-label">Timezone</div>
                                  <div className="destination-item-value">{segment.destination.timezone}</div>
                                </div>
                                <div className="destination-item">
                                  <div className="destination-item-label">Terminal</div>
                                  <div className="destination-item-value">{segment.destination.terminal}</div>
                                </div>
                              </div>
                              <div className="additional-info">
                                <div className="additional-info-item">
                                  <div className="additional-info-item-label">Flight time</div>
                                  <div className="additional-info-item-value">{this.convertMinutesToTime(segment.flightTime)}</div>
                                </div>
                                <div className="additional-info-item">
                                  <div className="additional-info-item-label">Wait time</div>
                                  <div className="additional-info-item-value">{this.convertMinutesToTime(segment.waitTime)}</div>
                                </div>
                                <div className="additional-info-item">
                                  <div className="additional-info-item-label">Tech stops</div>
                                  <div className="additional-info-item-value">{segment.techStops}</div>
                                </div>
                                {segment.equipment &&
                                  <div className="additional-info-item">
                                    <div className="additional-info-item-label">Plane</div>
                                    <div className="additional-info-item-value">{segment.equipment.name}</div>
                                  </div>}
                              </div>
                            </div>
                          </Fragment>
                        );
                      })}
                    </Fragment>}
                </div>
              </div>
              <div className="profile-details">
                <h4>Profile details</h4>
                <hr />
                <div className="profile-details-info">
                  {/* <div className="contact-info">
                    <h5>Contact info</h5>
                    <div className="contact-info-details">
                      <div className="contact-info-item">
                        <div className="contact-info-label">Name</div>
                        <div className="contact-info-value">{`${contactInfo.title} ${contactInfo.firstName} ${contactInfo.lastName}`}</div>
                      </div>
                      <div className="contact-info-item">
                        <div className="contact-info-label">Email</div>
                        <div className="contact-info-value">{contactInfo.email}</div>
                      </div>
                      <div className="contact-info-item">
                        <div className="contact-info-label">Phone</div>
                        <div className="contact-info-value">{contactInfo.phone}</div>
                      </div>
                      <div className="contact-info-item">
                        <div className="contact-info-label">Country</div>
                        <div className="contact-info-value">{contactInfo.country}</div>
                      </div>
                      <div className="contact-info-item">
                        <div className="contact-info-label">City</div>
                        <div className="contact-info-value">{contactInfo.city}</div>
                      </div>
                      <div className="contact-info-item">
                        <div className="contact-info-label">Zip</div>
                        <div className="contact-info-value">{contactInfo.zip}</div>
                      </div>
                      <div className="contact-info-item">
                        <div className="contact-info-label">Address</div>
                        <div className="contact-info-value">{contactInfo.address}</div>
                      </div>
                    </div>
                  </div> */}
                  {/* <div className="invoice-info">
                    <h5>Invoice info</h5>
                    <div className="invoice-info-details">
                      <div className="invoice-info-item">
                        <div className="invoice-info-label">Company</div>
                        <div className="invoice-info-value">{invoiceInfo.name}</div>
                      </div>
                      <div className="invoice-info-item">
                        <div className="invoice-info-label">Country</div>
                        <div className="invoice-info-value">{invoiceInfo.country}</div>
                      </div>
                      <div className="invoice-info-item">
                        <div className="invoice-info-label">City</div>
                        <div className="invoice-info-value">{invoiceInfo.city}</div>
                      </div>
                      <div className="invoice-info-item">
                        <div className="invoice-info-label">Zip</div>
                        <div className="invoice-info-value">{invoiceInfo.zip}</div>
                      </div>
                      <div className="invoice-info-item">
                        <div className="invoice-info-label">Address</div>
                        <div className="invoice-info-value">{invoiceInfo.address}</div>
                      </div>
                    </div>
                  </div> */}
                  {/* <div className="flight-services-info">
                    <h5>Flight Services Info</h5>
                    <div className="flight-services-info-details">

                    </div>
                  </div> */}
                  <div className="passengers-info">
                    <h5>Passengers Info</h5>
                    <div className="passengers-info-details-holder">
                      {passengersInfo.map((passenger, passengerIndex) => {
                        return (
                          <div key={passengerIndex} className="passenger-info-details">
                            <h6>Passenger - {passengerIndex + 1}</h6>
                            <div className="passenger-info-item">
                              <div className="passenger-info-label">Name</div>
                              <div className="passenger-info-value">{`${passenger.title} ${passenger.firstName} ${passenger.lastName}`}</div>
                            </div>
                            <div className="passenger-info-item">
                              <div className="passenger-info-label">Birthdate</div>
                              <div className="passenger-info-value">{passenger.birthDate}</div>
                            </div>
                            <div className="passenger-info-item">
                              <div className="passenger-info-label">Type</div>
                              <div className="passenger-info-value">{PASSENGER_TYPES[passenger.type]}</div>
                            </div>
                            <div className="passenger-info-item">
                              <div className="passenger-info-label">Nationality</div>
                              <div className="passenger-info-value">{passenger.nationality}</div>
                            </div>
                            <div className="passenger-info-item">
                              <div className="passenger-info-label">Passport number</div>
                              <div className="passenger-info-value">{passenger.passport.number}</div>
                            </div>
                            <div className="passenger-info-item">
                              <div className="passenger-info-label">Passport country</div>
                              <div className="passenger-info-value">{passenger.passport.issueCountry}</div>
                            </div>
                            <div className="passenger-info-item">
                              <div className="passenger-info-label">Passport expired</div>
                              <div className="passenger-info-value">{passenger.passport.expiry}</div>
                            </div>
                            {/* <div className="passenger-info-item">
                              <div className="passenger-info-label">Services</div>
                              <div className="passenger-info-value">
                                {passenger.options.map((option) => {
                                  return `${serviceOption.bags ? `Bags - ${serviceOption.bags}.` : ''}${serviceOption.maxWeight ? ` Max weight - ${serviceOption.maxWeight}.` : ''}${serviceOption.price ? ` Price - ${this.getCurrencySign(this.props.currency)}${serviceOption.price}.` : ''}`;
                                })}
                              </div>
                            </div> */}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="payment-methods">
                <div className="payment-methods-loc">
                  <div className="details">
                    <div className="air-tickets-price">
                      <div className="price-label">Base price:</div>
                      <div className="price-amount important">
                        <div>{this.props.paymentInfo.currencySign}{currencyExchangeRates && (netTotalPriceInUserCurrency).toFixed(2)}</div>
                        <div><LocPrice fiat={netTotalPriceInUserCurrency} /></div>
                      </div>
                    </div>
                    <div className="air-tickets-price">
                      <div className="price-label">Services price:</div>
                      <div className="price-amount important">
                        <div>{this.props.paymentInfo.currencySign}{currencyExchangeRates && (servicesPriceInUserCurrency).toFixed(2)}</div>
                        <div><LocPrice fiat={servicesPriceInUserCurrency} /></div>
                      </div>
                    </div>
                    <div className="air-tickets-price">
                      <div className="price-label">Tax price:</div>
                      <div className="price-amount important">
                        <div>{this.props.paymentInfo.currencySign}{currencyExchangeRates && (taxPriceInUserCurrency).toFixed(2)}</div>
                        <div><LocPrice fiat={taxPriceInUserCurrency} /></div>
                      </div>
                    </div>
                    <div className="air-tickets-price">
                      <div className="price-label">Total price:</div>
                      <div className="price-amount important">
                        <div>{this.props.paymentInfo.currencySign}{currencyExchangeRates && (totalFiatPriceInUserCurrency).toFixed(2)}</div>
                        <div><LocPrice fiat={totalFiatPriceInUserCurrency} /></div>
                      </div>
                    </div>
                    <p>(Click <a href="">here</a> to learn how you can buy LOC directly to enjoy cheaper travel)</p>
                    {userConfirmedPaymentWithLOC
                      ? <button className="btn btn-primary" disabled>Processing Payment...</button>
                      : hasLocAddress
                        ? <button className="btn btn-primary" onClick={this.handlePayWithLOC}>Pay with LOC Tokens</button>
                        : <button className="btn btn-primary" onClick={(e) => this.openModal(CREATE_WALLET, e)}>Create Wallet</button>
                    }
                    <p>You can pay <Link to="/profile/tickets">later</Link>, until {flightProperties.properties.deadline}.</p>
                  </div>
                  <div className="logos">
                    <div className="logo loc">
                      <img src={Config.getValue('basePath') + 'images/logos/loc.jpg'} alt="Visa Logo" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Fragment>
    );
  }
}

AirTicketsBookingConfirmPage.propTypes = {
  // Router props
  match: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object,

  // Redux props
  userInfo: PropTypes.object,
  exchangeRatesInfo: PropTypes.object,
  paymentInfo: PropTypes.object
};

const mapStateToProps = (state) => {
  const { userInfo, exchangeRatesInfo, paymentInfo } = state;
  return {
    userInfo,
    exchangeRatesInfo,
    paymentInfo
  };
};

export default withRouter(connect(mapStateToProps)(AirTicketsBookingConfirmPage));