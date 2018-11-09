import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import BookingSteps from '../../../common/bookingSteps';
import AirTicketsBookingProfileEditNav from './AirTicketsBookingProfileEditNav';
import AirTicketsBookingProfileEditForm from './AirTicketsBookingProfileEditForm';
import AirTicketsBookingProfileInvoiceForm from './AirTicketsBookingProfileInvoiceForm';
import ProfilePhotosPage from './ProfilePhotosPage';
import ProfileVerificationPage from './ProfileVerificationPage';

import '../../../../styles/css/components/airTickets/initBook/book/air-tickets-booking-profile-router-page.css';

class AirTicketsBookingProfileRouterPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contactInfo: ''
    };

    this.saveContactInfo = this.saveContactInfo.bind(this);
  }

  saveContactInfo(contactInfo) {
    this.setState({
      contactInfo
    }, () => this.props.history.push(`/tickets/results/${this.props.match.params.id}/profile/invoice${this.props.location.search}`));
  }

  render() {
    return (
      <div>
        <div className="container">
          <BookingSteps steps={['Search', 'Details', 'Prepare Booking', 'Confirm & Pay']} currentStepIndex={2} />
          <section>
            <div className="air-tickets-profile">
              <div className="air-tickets-profile-nav">
                <AirTicketsBookingProfileEditNav />
              </div>
              <div className="air-tickets-profile-content">
                <Switch>
                  <Route exact path="/tickets/results/:id/profile" render={() => <AirTicketsBookingProfileEditForm saveContactInfo={this.saveContactInfo} />} />
                  <Route exact path="/tickets/results/:id/profile/invoice" render={() => <AirTicketsBookingProfileInvoiceForm />} />
                  <Route exact path="/tickets/results/:id/profile/photos" render={() => <ProfilePhotosPage />} />
                  <Route exact path="/tickets/results/:id/profile/verification" render={() => <ProfileVerificationPage />} />
                </Switch>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

AirTicketsBookingProfileRouterPage.propTypes = {
  match: PropTypes.object,

  // Router props
  history: PropTypes.object,
  location: PropTypes.object
};

function mapStateToProps() {
  return {
  };
}

export default withRouter(connect(mapStateToProps)(AirTicketsBookingProfileRouterPage));
