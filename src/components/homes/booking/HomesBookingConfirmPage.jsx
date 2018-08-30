import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { NotificationManager } from 'react-notifications';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { parse } from 'query-string';
import BookingSteps from '../../common/utility/BookingSteps';
import HomesBookingListingDetailsInfo from './HomesBookingListingDetailsInfo';
import requester from '../../../initDependencies';
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
      firstName: props.userInfo.firstName,
      lastName: props.userInfo.lastName,
    };

    console.log(this.state);

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
        this.setState({ rates: data });
      });
    });
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

    const { listing, firstName, lastName } = this.state;

    const queryParams = parse(this.props.location.search);
    console.log(queryParams);

    const requestInfo = {
      listingId: listing.id,
      checkin: queryParams.startDate,
      checkout: queryParams.endDate,
      guests: parseInt(queryParams.guests, 10),
      name: firstName + ' ' + lastName,
      email: this.props.userInfo.email,
      phone: this.props.userInfo.phoneNumber,
    };
    console.log(requestInfo);

    requester.requestBooking(requestInfo, captchaToken).then(res => {
      this.setState({ sending: false });
      if (!res.success) {
        NotificationManager.warning('Please sign-in/register to able to make bookings', '', LONG);
      } else {
        res.body.then(data => {
          if (data.success) {
            this.props.history.push('/profile/trips?id=' + data.id);
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
    const { listing, rates } = this.state;

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
              rates={rates}
            />
            <div className="confirm-and-pay-details">
              <h2 className="title">Confirm &amp; Pay</h2>
              <h3 className="billing-address">Billing Address</h3>
              <hr />
              <div className="form">
                <div className="form-group">
                  <label>First name</label>
                  <div>
                    <input type="text" name="firstName" value={this.state.firstName} onChange={this.handleChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Last name</label>
                  <div>
                    <input type="text" name="lastName" value={this.state.lastName} onChange={this.handleChange} />
                  </div>
                </div>
              </div>
              <ReCAPTCHA
                ref={el => this.captcha = el}
                size="invisible"
                sitekey={Config.getValue('recaptchaKey')}
                onChange={token => { this.handleSubmit(token); this.captcha.reset(); }}
              />
              <button
                className="btn"
                onClick={(e) => {
                  e.preventDefault();
                  if (this.isValidNames()) {
                    this.captcha.execute();
                  }
                }}>Confirm &amp; Pay</button>
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
