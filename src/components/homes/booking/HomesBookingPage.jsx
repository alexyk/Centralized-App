import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { parse } from 'query-string';
import BookingSteps from '../../common/utility/BookingSteps';
import HomesBookingRoomDetailsInfo from './HomesBookingRoomDetailsInfo';
import HomesBookingListingDetailsInfo from './HomesBookingListingDetailsInfo';
import requester from '../../../initDependencies';

import '../../../styles/css/components/homes/booking/homes-booking-page.css';

class HomesBookingPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      listing: null,
      checkInStart: null,
      checkInEnd: null,
      checkOutStart: null,
      checkOutEnd: null,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    requester.getListing(this.props.match.params.id).then(res => {
      res.body.then((data) => {
        console.log(data);
        this.setState({
          listing: data,
          checkInStart: Number(data.checkinStart.substring(0, 2)),
          checkInEnd: data.checkinEnd && data.checkinEnd !== '00:00:00' ? Number(data.checkinEnd.substring(0, 2)) : 24,
          checkOutStart: data.checkOutStart ? Number(data.checkOutStart.substring(0, 2)) : 0,
          checkOutEnd: data.checkOutEnd ? Number(data.checkOutEnd.substring(0, 2)) : 12,
        }); //, () => this.setCheckInOutHours());
      });
    });

    requester.getCurrencyRates().then(res => {
      res.body.then(data => {
        this.setState({ rates: data });
      });
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timerCheckInOut);
  }

  setCheckInOutHours() {
    const { checkInStart, checkInEnd, checkOutStart, checkOutEnd } = this.state;
    const checkInBeforeStartWidth = ((100 / 24) * (checkInStart));
    const checkInAfterEndWidth = ((100 / 24) * (24 - checkInEnd));
    const checkInLength = ((100 / 24) * (checkInEnd - checkInStart));
    const checkOutBeforeStartWidth = ((100 / 24) * (checkOutStart));
    const checkOutAfterEndWidth = ((100 / 24) * (24 - checkOutEnd));
    const checkOutLength = (100 / 24) * (checkOutEnd - checkOutStart);

    this.timerCheckInOut = setTimeout(() => {
      document.getElementById('check_in_hour').style.width = `calc(${checkInBeforeStartWidth}% + 40px)`;
      document.getElementById('check_out_hour').style.width = `calc(${checkOutBeforeStartWidth + checkOutLength}% + 40px)`;

      document.getElementById('check_in_line_1').style.width = `${checkInBeforeStartWidth}%`;
      document.getElementById('check_in_line_2').style.width = `${checkInLength}%`;
      document.getElementById('check_in_line_3').style.width = `${checkInAfterEndWidth}%`;
      document.getElementById('check_out_line_1').style.width = `${checkOutBeforeStartWidth}%`;
      document.getElementById('check_out_line_2').style.width = `${checkOutLength}%`;
      document.getElementById('check_out_line_3').style.width = `${checkOutAfterEndWidth}%`;

      document.getElementById('check_in_tooltip').style.marginLeft = `calc(${checkInBeforeStartWidth}% - 15px)`;
      document.getElementById('check_out_tooltip').style.marginLeft = `calc(${checkOutBeforeStartWidth + checkOutLength}% - 95px)`;
    }, 100);
  }

  handleSubmit() {
    const id = this.props.match.params.id;
    const isWebView = this.props.location.pathname.indexOf('/mobile') !== -1;
    const rootURL = !isWebView ? '/homes/listings/book/confirm' : '/mobile/book/confirm';
    this.props.history.push(`${rootURL}/${id}${this.props.location.search}`);
  }

  render() {
    const { listing, checkInStart, checkInEnd, checkOutStart, checkOutEnd, rates } = this.state;

    if (!listing) {
      return <div className="loader"></div>;
    }

    return (
      <Fragment>
        <BookingSteps steps={['Select your Room', 'Review Room Details', 'Confirm & Pay']} currentStepIndex={1} />
        <div id="homes-booking-page-container">
          <div className="container">
            <HomesBookingListingDetailsInfo
              listing={listing}
              searchParams={parse(this.props.location.search)}
              rates={rates}
            />
            <HomesBookingRoomDetailsInfo
              listing={listing}
              checkInStart={checkInStart}
              checkInEnd={checkInEnd}
              checkOutStart={checkOutStart}
              checkOutEnd={checkOutEnd}
              handleSubmit={this.handleSubmit}
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

HomesBookingPage.propTypes = {
  match: PropTypes.object,
  
  // Router props
  location: PropTypes.object,
  history: PropTypes.object,
};

export default withRouter(HomesBookingPage);
