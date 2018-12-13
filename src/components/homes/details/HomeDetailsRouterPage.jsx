import { Route, Switch } from 'react-router-dom';

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import HomeDetailsPage from './HomeDetailsPage';
import HomesBookingPage from '../booking/HomesBookingPage';
import requester from '../../../requester';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { parse } from 'query-string';
import { asyncSetStartDate, asyncSetEndDate } from '../../../actions/searchDatesInfo';
import { setHomesSearchInfo } from '../../../actions/homesSearchInfo';
import { getCurrency } from '../../../selectors/paymentInfo';
import _ from 'lodash';
import HomesBookingConfirmPage from '../booking/HomesBookingConfirmPage';

class HomeDetailsRouterPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listing: null,
      calendar: null,
      bookingDetails: null
    };

    this.requestListing = this.requestListing.bind(this);
    this.requestListingCalendar = this.requestListingCalendar.bind(this);
    this.requestListingBookingDetails = this.requestListingBookingDetails.bind(this);
  }

  componentDidMount() {
    this.setHomesSearchInfoFromURL();

    const { id } = this.props.match.params;
    this.requestListing(id);
    this.requestListingCalendar(id);
    this.requestListingBookingDetails(id);
  }

  requestListing(id) {
    requester.getListing(id).then(res => {
      res.body.then(listing => {
        this.setState({ listing });
      });
    });
  }

  requestListingCalendar(id) {
    const DAY_INTERVAL = 365;
    const calendarByListingRequestParams = [
      `listing=${id}`,
      `startDate=${moment().format('DD/MM/YYYY')}`,
      `endDate=${moment().add(DAY_INTERVAL, 'days').format('DD/MM/YYYY')}`,
      `page=${0}`,
      `toCode=${this.props.currency}`,
      `size=${DAY_INTERVAL}`];

    requester.getCalendarByListingIdAndDateRange(calendarByListingRequestParams).then(res => {
      res.body.then(data => {
        let calendar = data.content;
        calendar = _.sortBy(calendar, function (x) {
          return moment(x.date, 'DD/MM/YYYY');
        });
        
        this.setState({ calendar });
      });
    });
  }

  requestListingBookingDetails(id) {
    requester.getHomeBookingDetails(id).then(res => res.body).then(bookingDetails => {
      this.setState({ bookingDetails });
    });
  }

  setHomesSearchInfoFromURL() {
    if (this.props.location.search) {
      const searchParams = parse(this.props.location.search);
      const country = searchParams.countryId;
      const startDate = moment(searchParams.startDate, 'DD/MM/YYYY');
      const endDate = moment(searchParams.endDate, 'DD/MM/YYYY');
      const guests = searchParams.guests;

      this.props.dispatch(asyncSetStartDate(startDate));
      this.props.dispatch(asyncSetEndDate(endDate));
      this.props.dispatch(setHomesSearchInfo(country, guests));
    }
  }

  render() {
    const { listing, calendar, bookingDetails } = this.state;
    return (
      <div>
        <Switch>
          <Route exact path="/homes/listings/:id" render={() => <HomeDetailsPage listing={listing} calendar={calendar} bookingDetails={bookingDetails} />} />
          <Route exact path="/homes/listings/:id/book" render={() => <HomesBookingPage listing={listing} calendar={calendar} bookingDetails={bookingDetails} />} />
          <Route exact path="/homes/listings/:id/confirm" render={() => <HomesBookingConfirmPage listing={listing} calendar={calendar} bookingDetails={bookingDetails} />} />
        </Switch>
      </div>
    );
  }
}

HomeDetailsRouterPage.propTypes = {
  listings: PropTypes.array,
  hotels: PropTypes.array,

  // Router props
  location: PropTypes.object,
  history: PropTypes.object,
  match: PropTypes.object,

  // Redux props
  dispatch: PropTypes.func,
  currency: PropTypes.string,
  searchDatesInfo: PropTypes.object
};

function mapStateToProps(state) {
  const { paymentInfo, searchDatesInfo } = state;
  return {
    currency: getCurrency(paymentInfo),
    searchDatesInfo
  };
}

export default withRouter(connect(mapStateToProps)(HomeDetailsRouterPage));
