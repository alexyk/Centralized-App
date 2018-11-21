import CancellationModal from '../../common/modals/CancellationModal';
import { Link } from 'react-router-dom';
import MyGuestsTable from './MyGuestsTable';
import { NotificationManager } from 'react-notifications';
import Pagination from '../../common/pagination/Pagination';
import PropTypes from 'prop-types';
import React from 'react';
import requester from '../../../requester';
import { withRouter } from 'react-router-dom';

import { RESERVATION_ACCEPTED, RESERVATION_DELETED, RESERVATION_CANCELLED } from '../../../constants/successMessages.js';
import { LONG } from '../../../constants/notificationDisplayTimes.js';

class MyGuestsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reservations: [],
      loading: true,
      totalReservations: 0,
      currentPage: 1,
      selectedReservationId: 0,
      showRejectReservationModal: false,
    };

    this.onPageChange = this.onPageChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onReservationSelect = this.onReservationSelect.bind(this);

    this.acceptReservation = this.acceptReservation.bind(this);
    this.cancelReservation = this.cancelReservation.bind(this);
    this.rejectReservation = this.rejectReservation.bind(this);
  }

  componentDidMount() {
    requester.getMyReservations(['page=0']).then(res => {
      res.body.then(data => {
        this.setState({ reservations: data.content, totalReservations: data.totalElements, loading: false });
      });
    });

    requester.getMyListings().then(res => {
      res.body.then(data => {
        if (data.totalElements === 0) {
          this.props.history.push('/profile/listings/create/landing');
        }
      });
    });
  }

  acceptReservation() {
    const id = this.state.selectedReservationId;
    requester.acceptReservation(id).then(res => {
      if (res.success) {
        this.setReservationIsAccepted(id, true);
        NotificationManager.success(RESERVATION_ACCEPTED, 'Reservation Operations', LONG);
      } else {
        res.errors.then(e => {
          NotificationManager.error(e.message, 'Reservation Operations', LONG);
        });
      }
    });
  }

  cancelReservation() {
    const id = this.state.selectedReservationId;
    requester.cancelReservation(id).then(res => {
      if (res.success) {
        this.setReservationIsAccepted(id, false);
        NotificationManager.success(RESERVATION_CANCELLED, 'Reservation Operations', LONG);
      } else {
        res.errors.then(e => {
          NotificationManager.error(e.message, 'Reservation Operations', LONG);
        });
      }
    });
  }

  rejectReservation() {
    const id = this.state.selectedReservationId;
    const message = this.state.cancellationText;
    let messageObj = { message: message };
    requester.cancelTrip(id, messageObj).then(res => {
      if (res.success) {
        this.deleteReservationFromState(id);
        NotificationManager.success(RESERVATION_DELETED, 'Reservation Operations', LONG);
      } else {
        res.errors.then(e => {
          NotificationManager.error(e.message, 'Reservation Operations', LONG);
        });
      }
    });
  }

  deleteReservationFromState(reservationId) {
    const reservations = this.state.reservations.filter(reservation => reservation.id !== reservationId);
    this.setState({ reservations: reservations });
  }

  setReservationIsAccepted(reservationId, isAccepted) {
    const reservations = this.state.reservations.map(reservation => {
      if (reservation.id === reservationId) {
        reservation.accepted = isAccepted;
      }
      return reservation;
    });
    this.setState({ reservations: reservations });
  }

  onPageChange(page) {
    this.setState({
      currentPage: page,
      loading: true
    });

    requester.getMyReservations([`page=${page - 1}`]).then(res => {
      res.body.then(data => {
        this.setState({
          reservations: data.content,
          totalReservations: data.totalElements,
          loading: false
        });
      });
    });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  openModal(name) {
    this.setState({ [name]: true });
  }

  closeModal(name) {
    this.setState({ [name]: false });
  }

  onReservationSelect(id) {
    this.setState({ selectedReservationId: id });
  }

  render() {

    if (this.state.loading) {
      return <div className="loader"></div>;
    }

    return (
      <div className="my-reservations">

        <CancellationModal
          name={'showRejectReservationModal'}
          value={this.state.cancellationText}
          title={'Delete Reservation'}
          text={'Tell your guest why do you want to reject his reservation.'}
          onChange={this.onChange}
          isActive={this.state.showRejectReservationModal}
          onClose={this.closeModal}
          onSubmit={this.rejectReservation} />

        <section id="profile-my-reservations">
          <div className="container">
            <h2>Upcoming Reservations ({this.state.totalReservations})</h2>
            <hr />
            <MyGuestsTable
              reservations={this.state.reservations}
              onReservationAccept={this.acceptReservation}
              onReservationCancel={this.cancelReservation}
              onReservationSelect={this.onReservationSelect}
              onReservationReject={() => { this.openModal('showRejectReservationModal'); }} />

            <Pagination
              loading={this.state.totalReservations === 0}
              onPageChange={this.onPageChange}
              currentPage={this.state.currentPage}
              totalElements={this.state.totalReservations}
            />

            <div className="my-listings">
              <Link className="btn btn-primary create-listing" to="#">Print this page</Link>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

MyGuestsPage.propTypes = {
  // start Router props
  history: PropTypes.object,
};

export default withRouter(MyGuestsPage);