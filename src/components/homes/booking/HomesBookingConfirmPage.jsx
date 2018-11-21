import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { parse } from 'query-string';
import requester from '../../../requester';
import { LONG } from '../../../constants/notificationDisplayTimes.js';
import { MISSING_NAMES } from '../../../constants/warningMessages.js';

import '../../../styles/css/components/homes/booking/homes-booking-confirm-page.css';

class HomesBookingConfirmPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sending: false,
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
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

  handleSubmit(e) {
    if (e) {
      e.preventDefault();
    }

    this.setState({ sending: true });
    if (!this.isValidNames()) {
      return;
    }
    const { firstName, lastName, phoneNumber, email } = this.state;
    const { listing } = this.props;
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

    requester.requestBooking(requestInfo).then(res => {
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
      this.setState({ sending: false });
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
    return (
      <div className="confirm-and-pay-details">
        {this.state.sending === false ?
          <Fragment>
            <h2 className="title">Request Booking</h2>
            <hr />
            <form onSubmit={(e) => { this.handleSubmit(e); }}
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
              <button type="submit" className="btn">Request Booking</button>
            </form>
          </Fragment> : <div className="loader"></div>}
      </div>
    );
  }
}

HomesBookingConfirmPage.propTypes = {
  match: PropTypes.object,
  listing: PropTypes.object,
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
