import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { NotificationManager } from 'react-notifications';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { parse } from 'query-string';
import BookingSteps from '../../common/utility/BookingSteps';
import HomesBookingListingDetailsInfo from './HomesBookingListingDetailsInfo';
import requester from '../../../requester';
import { Config } from '../../../config';
import { LONG } from '../../../constants/notificationDisplayTimes.js';
import { MISSING_NAMES } from '../../../constants/warningMessages.js';

import '../../../styles/css/components/homes/booking/homes-booking-confirm-page.css';

class HomesBookingConfirmPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      listing: null,
      sending: false,
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    requester.getListing(this.props.match.params.id).then(res => {
      res.body.then((data) => {
        this.setState({
          listing: data,
        });
      });
    });

    requester.getCurrencyRates().then(res => {
      res.body.then(data => {
        this.setState({ exchangeRates: data });
      });
    });

    requester.getUserInfo()
      .then(res => res.body)
      .then(userInfo => this.setState({
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        phoneNumber: userInfo.phoneNumber,
        email: userInfo.email
      }));
  }

  handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    this.setState({
      [name]: value,
    });
  }

  handleSubmit(captchaToken) {
    this.setState({ sending: true });

    const { listing, firstName, lastName, phoneNumber, email } = this.state;

    const queryParams = parse(this.props.location.search);

    const requestInfo = {
      listingId: listing.id,
      checkin: queryParams.startDate,
      checkout: queryParams.endDate,
      guests: queryParams.guests,
      name: firstName + ' ' + lastName,
      email: email,
      phone: phoneNumber,
    };

    requester.requestBooking(requestInfo, captchaToken).then(res => {
      this.setState({ sending: false });
      if (!res.success) {
        res.errors.then(e => {
          NotificationManager.warning(e.message, '', LONG);
        });
      } else {
        res.body.then(data => {
          if (data.success) {
            this.props.history.push('/profile/trips/homes');
          } else {
            NotificationManager.error(data.message, '', LONG);
          }
        });
      }
    });
  }

  isValidNames() {
    const { firstName, lastName } = this.state;

    if (firstName === '' || lastName === '') {
      NotificationManager.warning(MISSING_NAMES, '', LONG);
      return false;
    }

    return true;
  }

  render() {
    const { listing, exchangeRates } = this.state;

    if (!listing || this.state.sending) {
      return <div className="loader"></div>;
    }

    return (
      <Fragment>
        <BookingSteps steps={['Select your Room', 'Review Room Details', 'Confirm & Pay']} currentStepIndex={2} />
        <div id="homes-booking-confirm-page-container">
          <div className="container">
            <HomesBookingListingDetailsInfo
              listing={listing}
              searchParams={parse(this.props.location.search)}
              exchangeRates={exchangeRates}
            />
            <div className="confirm-and-pay-details">
              <h2 className="title">Request Booking</h2>
              <hr />
              <form onSubmit={(e) => {
                e.preventDefault();
                if (this.isValidNames()) {
                  this.captcha.execute();
                }
              }}
              >
                <div className="customer-first-name">
                  <label>First name</label>
                  <input type="text" name="firstName" value={this.state.firstName} onChange={this.handleChange} required />
                </div>
                <div className="customer-last-name">
                  <label>Last name</label>
                  <input type="text" name="lastName" value={this.state.lastName} onChange={this.handleChange} required />
                </div>
                <div className="customer-phone">
                  <label>Phone number</label>
                  <input type="text" name="phoneNumber" value={this.state.phoneNumber} onChange={this.handleChange} required />
                </div>
                <div className="customer-email">
                  <label>Email</label>
                  <input type="email" name="email" value={this.state.email} onChange={this.handleChange} required />
                </div>
                <button className="btn">Request Booking</button>
              </form>
              <ReCAPTCHA
                ref={el => this.captcha = el}
                size="invisible"
                sitekey={Config.getValue('recaptchaKey')}
                onChange={token => { this.handleSubmit(token); this.captcha.reset(); }}
              />
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

HomesBookingConfirmPage.propTypes = {
  match: PropTypes.object,

  // Router props
  location: PropTypes.object,
  history: PropTypes.object,

  // Redux props
  userInfo: PropTypes.object,
};

function mapStateToProps(state) {
  const { userInfo } = state;
  return {
    userInfo
  };
}

export default withRouter(connect(mapStateToProps)(HomesBookingConfirmPage));
