import { closeModal, openModal } from '../../../../actions/modalsInfo.js';
import { isActive } from '../../../../selectors/modalsInfo.js';

import { BOOKING_REQUEST_SENT } from '../../../../constants/successMessages.js';
import { CANCELLATION_NOT_POSSIBLE } from '../../../../constants/warningMessages.js';
import HotelTripsList from './HotelTripsList';
import { LONG } from '../../../../constants/notificationDisplayTimes.js';
import { NotificationManager } from 'react-notifications';
import { PASSWORD_PROMPT } from '../../../../constants/modals.js';
import Pagination from '../../../common/pagination/Pagination';
import WalletPasswordModal from '../../../common/modals/WalletPasswordModal';
import PropTypes from 'prop-types';
import { RESERVATION_CANCELLED, CANCELLING_RESERVATION } from '../../../../constants/infoMessages.js';
import React from 'react';
import { connect } from 'react-redux';
import requester from '../../../../requester';
import { withRouter } from 'react-router-dom';
import RecoverWallerPassword from '../../../common/utility/RecoverWallerPassword';

class HotelTripsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      trips: [],
      loading: true,
      totalTrips: 0,
      currentPage: 1,
      currentTripId: null,
      bookingPrepareId: 0,
      password: '',
    };

    this.onPageChange = this.onPageChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleCancelTrip = this.handleCancelTrip.bind(this);
    this.onTripSelect = this.onTripSelect.bind(this);
  }

  componentDidMount() {
    let search = this.props.location.search.split('?');
    let id = null;
    if (search.length > 1) {
      let pairs = search[1].split('&');
      for (let pair of pairs) {
        let tokens = pair.split('=');
        if (tokens[0] === 'id') {
          id = Number(tokens[1]);
          break;
        }
      }
    }
    requester.getMyHotelBookings(['page=0']).then(res => {
      res.body.then(data => {
        this.setState({ trips: data.content, totalTrips: data.totalElements, loading: false, currentTripId: id });
        if (id) {
          NotificationManager.success(BOOKING_REQUEST_SENT, 'Reservation Operations', LONG);
        }
      });
    });
  }

  openModal(modal, e) {
    if (e) {
      e.preventDefault();
    }

    this.props.dispatch(openModal(modal));
  }

  closeModal(modal, e) {
    if (e) {
      e.preventDefault();
    }

    this.props.dispatch(closeModal(modal));
  }

  handleCancelTrip() {
    requester.cancelBooking({ bookingId: this.state.bookingPrepareId })
      //.then(res => res.body)
      //.then(data => {
      .then(res => {
        /*
        var data = res.body;
        if (data.isCancellationRequested) {
          NotificationManager.info(RESERVATION_CANCELLED, '', LONG);
        } else {
          NotificationManager.warning(CANCELLATION_NOT_POSSIBLE, '', LONG);
        }
        */
        NotificationManager.info(CANCELLING_RESERVATION, '', LONG);
      });

    this.closeModal(PASSWORD_PROMPT);
  }

  setTripIsAccepted(tripId, isAccepted) {
    const trips = this.state.trips.map(trip => {
      if (trip.id === tripId) {
        trip.accepted = isAccepted;
      }
      return trip;
    });
    this.setState({ trips: trips });
  }

  onPageChange(page) {
    window.scrollTo(0, 0);
    this.setState({ currentPage: page, loading: true }, () => {
      requester.getMyHotelBookings([`page=${page - 1}`]).then(res => {
        res.body.then(data => {
          this.setState({
            trips: data.content,
            totalTrips: data.totalElements,
            loading: false
          });
        });
      });
    });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onTripSelect(bookingPrepareId) {
    this.setState({ bookingPrepareId });
  }

  render() {
    if (this.state.loading) {
      return <div className="loader"></div>;
    }

    return (
      <div className="my-reservations">
        <section id="profile-my-reservations">
          <div>
            <h2>Upcoming Trips ({this.state.totalTrips})</h2>
            <hr />

            <HotelTripsList
              trips={this.state.trips}
              currentTripId={this.state.currentTripId}
              onTripSelect={this.onTripSelect}
              handleCancelReservation={() => this.openModal(PASSWORD_PROMPT)}
              loading={this.state.loading}
            />

            <Pagination
              loading={this.state.totalListings === 0}
              onPageChange={this.onPageChange}
              currentPage={this.state.currentPage}
              totalElements={this.state.totalTrips}
            />
          </div>
        </section>

        <WalletPasswordModal
          isActive={this.props.isActive[PASSWORD_PROMPT]}
          text={'Enter your wallet password'}
          placeholder={'Wallet password'}
          handleSubmit={() => this.handleCancelTrip()}
          openModal={this.openModal}
          closeModal={this.closeModal}
          password={this.state.password}
          onChange={this.onChange}
        />
        <RecoverWallerPassword />
      </div>
    );
  }
}

HotelTripsPage.propTypes = {
  location: PropTypes.object,
  dispatch: PropTypes.func,
  isActive: PropTypes.object
};

function mapStateToProps(state) {
  const { modalsInfo } = state;
  return {
    isActive: isActive(modalsInfo),
  };
}

export default withRouter(connect(mapStateToProps)(HotelTripsPage));
