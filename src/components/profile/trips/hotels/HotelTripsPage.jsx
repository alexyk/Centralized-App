import { closeModal, openModal } from '../../../../actions/modalsInfo.js';
import { isActive } from '../../../../selectors/modalsInfo.js';

import { BOOKING_REQUEST_SENT } from '../../../../constants/successMessages.js';
import { CANCELLATION_NOT_POSSIBLE } from '../../../../constants/warningMessages.js';
import HotelTripsList from './HotelTripsList';
import { LONG } from '../../../../constants/notificationDisplayTimes.js';
import { NotificationManager } from 'react-notifications';
import { PASSWORD_PROMPT, CANCEL_TRIP_MODAL } from '../../../../constants/modals.js';
import Pagination from '../../../common/pagination/Pagination';
import PropTypes from 'prop-types';
import { RESERVATION_CANCELLED, CANCELLING_RESERVATION } from '../../../../constants/infoMessages.js';
import React from 'react';
import { connect } from 'react-redux';
import requester from '../../../../requester';
import { withRouter } from 'react-router-dom';
import CancelTripModal from '../../../common/modals/CancelTripModal';

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
      cancellationText: '',
      count: 0,
      showModal: false
    };

    this.onPageChange = this.onPageChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleCancelTrip = this.handleCancelTrip.bind(this);
    this.onTripSelect = this.onTripSelect.bind(this);
    this.getBookings = this.getBookings.bind(this);
    this.sendCancellationRequest = this.sendCancellationRequest.bind(this);
  }

  componentDidMount() {

    this.getBookings();
  }

  getBookings(){
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
        this.setState({ trips: data.content, totalTrips: data.totalElements, loading: false, currentTripId: id, count: this.state.count++ }, );
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

    this.setState({
      showModal: true
    });
    this.props.dispatch(openModal(modal));
  }

  closeModal(modal, e) {
    if (e) {
      e.preventDefault();
    }

    this.setState({
      showModal: false
    });
    this.props.dispatch(closeModal(modal));
  }

  handleCancelTrip(bookingId) {
    this.setState({
      showModal: true,
      bookingPrepareId: bookingId
    });

    this.openModal(CANCEL_TRIP_MODAL);
  }

  sendCancellationRequest(bookingId, callback) {
    requester.cancelBooking({ bookingId: bookingId || this.state.bookingPrepareId, confirmed: true })
      .then(res => {
        NotificationManager.info(CANCELLING_RESERVATION, '', LONG);

        if (callback) {
          callback();
        }
      }).then(()=>{
        return this.getBookings();
    })
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
              handleCancelReservation={this.handleCancelTrip}
              loading={this.state.loading}
              sendCancelRequest={this.sendCancellationRequest}
            />

            <Pagination
              loading={this.state.totalListings === 0}
              onPageChange={this.onPageChange}
              currentPage={this.state.currentPage}
              totalElements={this.state.totalTrips}
            />
          </div>
        </section>

        <CancelTripModal
          cancellationText={this.state.cancellationText}
          onChange={this.onChange}
          isActive={this.state.showModal}
          onClose={this.closeModal}
          handleCancelTrip={this.handleCancelTrip}
          sendCancelRequest={this.sendCancellationRequest}
          />
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
