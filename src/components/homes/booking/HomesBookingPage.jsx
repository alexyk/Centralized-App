import React, { Fragment } from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';
import HomesBookingConfirmPage from './HomesBookingConfirmPage';
import BookingSteps from '../../common/utility/BookingSteps';
import HomesBookingListingDetailsInfo from './HomesBookingListingDetailsInfo';
import _ from 'lodash';
import { parse } from 'query-string';
import PropTypes from 'prop-types';
import HomesBookingRoomDetailsInfo from './HomesBookingRoomDetailsInfo';
import requester from '../../../requester';
import { setCheckInOutHours, calculateCheckInOuts } from '../common/detailsPageUtils.js';
import moment from 'moment';
import '../../../styles/css/components/homes/booking/homes-booking-page.css';
import { connect } from 'react-redux';

class HomesBookingPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      listing: null,
      calendar: null,
      checks: null,
      stepsNumber: 1
    };

    this.handleSubmit = this.handleSubmit.bind(this);

    this.setCheckInOutHours = setCheckInOutHours.bind(this);
    this.calculateCheckInOuts = calculateCheckInOuts.bind(this);
  }

  componentDidMount() {
    const DAY_INTERVAL = 365;
    requester.getListing(this.props.match.params.id).then(res => {
      res.body.then((listing) => {
        const checks = this.calculateCheckInOuts(listing);
        this.setState({ listing: listing, checks });
      });
    });

    requester.getHomeBookingDetails(this.props.match.params.id).then(res => res.body).then(roomDetails => {
      this.setState({ roomDetails });
    });

    const searchTermMap = [
      `listing=${this.props.match.params.id}`,
      `startDate=${moment().format('DD/MM/YYYY')}`,
      `endDate=${moment().add(DAY_INTERVAL, 'days').format('DD/MM/YYYY')}`,
      `page=${0}`,
      `toCode=${this.props.paymentInfo.currency}`,
      `size=${DAY_INTERVAL}`];

    requester.getCalendarByListingIdAndDateRange(searchTermMap).then(res => {
      res.body.then(data => {
        let calendar = data.content;
        calendar = _.sortBy(calendar, function (x) {
          return new moment(x.date, 'DD/MM/YYYY');
        });
        console.log(calendar);
        this.setState({ calendar: calendar });
      });
    });
  }

  handleSubmit() {
    const id = this.props.match.params.id;
    const isWebView = this.props.location.pathname.indexOf('/mobile') !== -1;
    const rootURL = !isWebView ? '/homes/listings/book' : '/mobile/book';
    this.props.history.push(`${rootURL}/${id}/confirm${this.props.location.search}`);
    this.setState({ stepsNumber: 2 });
  }

  render() {
    let { listing, calendar, roomDetails, checks } = this.state;

    if (!listing || !calendar) {
      return <div className="loader"></div>;
    }

    return (
      <Fragment>
        <BookingSteps steps={['Select your Room', 'Review Room Details', 'Confirm & Pay']} currentStepIndex={this.state.stepsNumber} />
        <div id={`${this.props.location.pathname.indexOf('/confirm') !== -1 ? 'homes-booking-confirm-page-container' : 'homes-booking-page-container'}`}>
          <div className="container">
            <HomesBookingListingDetailsInfo
              listing={listing}
              searchParams={parse(this.props.location.search)}
              calendar={calendar}
            />
            <Switch>
              <Route path="/homes/listings/book/:id/confirm" render={() => <HomesBookingConfirmPage listing={listing} />} />
              <Route path="/homes/listings/book/:id" render={() => <HomesBookingRoomDetailsInfo
                listing={listing}
                roomDetails={roomDetails}
                checks={checks}
                handleSubmit={this.handleSubmit} />} />
            </Switch>
          </div>
        </div>

      </Fragment>
    );
  }
}

HomesBookingPage.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object,
  paymentInfo: PropTypes.object
};

function mapStateToProps(state) {
  const { paymentInfo } = state;
  return {
    paymentInfo
  };
}

export default withRouter(connect(mapStateToProps)(HomesBookingPage));
