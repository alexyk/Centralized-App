import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import BookingSteps from '../../common/utility/BookingSteps';
import HomesBookingListingDetailsInfo from './HomesBookingListingDetailsInfo';
import { QueryParser } from '../../../services/utilities/queryParser.js';
import requester from '../../../initDependencies';

import '../../../styles/css/components/homes/booking/homes-booking-page.css';

class HomesBookingConfirmPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      listing: null,
    };
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

  render() {
    const { listing, rates } = this.state;

    if (!listing) {
      return <div className="loader"></div>;
    }

    return (
      <Fragment>
        <BookingSteps steps={['Select your Room', 'Review Room Details', 'Confirm & Pay']} currentStepIndex={2} />
        <div id="homes-booking-page-container">
          <div className="container">
            <HomesBookingListingDetailsInfo
              listing={listing}
              searchParams={QueryParser.parse(this.props.location.search)}
              rates={rates}
            />
            <div className="confirm-and-pay-details">

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
};

export default withRouter(HomesBookingConfirmPage);
