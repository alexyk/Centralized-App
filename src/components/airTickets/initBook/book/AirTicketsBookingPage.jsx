import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Switch } from 'react-router-dom';
// import PropTypes from 'prop-types';
// import moment from 'moment';
// import queryString from 'query-string';
// import { Config } from '../../../../config';
// import { setOrigin, setDestination, setAirTicketsSearchInfo } from '../../../../actions/airTicketsSearchInfo';
// import { asyncSetStartDate, asyncSetEndDate } from '../../../../actions/searchDatesInfo';
// import AirTicketsDetailsInfoSection from './AirTicketsDetailsInfoSection';
// import AirTicketsSearchBar from '../../search/AirTicketsSearchBar';
import BookingSteps from '../../../common/bookingSteps';

import ProfileAdditionalInfo from '../../../profile/me/ProfileAdditionalInfo';
import ProfileEditForm from '../../../profile/me/ProfileEditForm';
import AirTicketsBookingProfileEditNav from './AirTicketsBookingProfileEditNav';
import ProfilePhotosPage from '../../../profile/me/ProfilePhotosPage';
import ProfileVerificationPage from '../../../profile/me/ProfileVerificationPage';

import '../../../../styles/css/components/carousel-component.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

class AirTicketsBookingPage extends Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <div>
        <div className="container">
          <BookingSteps steps={['Search', 'Details', 'Prepare Booking', 'Confirm & Pay']} currentStepIndex={2} />
          <section id="profile-edit">
            <div className="container">
              <div className="row">
                <div className="col-md-3">
                  <AirTicketsBookingProfileEditNav />
                </div>
                <div className="col-md-8">
                  <Switch>
                    <Route exact path="/tickets/results/:id/profile" render={() => <ProfileEditForm />} />
                    <Route exact path="/profile/me/edit/photos" render={() => <ProfilePhotosPage />} />
                    <Route exact path="/profile/me/additional-info" render={() => <ProfileAdditionalInfo />} />
                    <Route exact path="/profile/me/verification" render={() => <ProfileVerificationPage />} />
                  </Switch>
                </div>
                <div className="before-footer clear-both" />
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

AirTicketsBookingPage.propTypes = {
};

function mapStateToProps() {
  return {
  };
}

export default withRouter(connect(mapStateToProps)(AirTicketsBookingPage));
