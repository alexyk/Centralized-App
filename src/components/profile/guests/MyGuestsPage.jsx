import { Config } from '../../../config';
import CancellationModal from '../../common/modals/CancellationModal';
import Pagination from '../../common/pagination/Pagination';
import { Link } from 'react-router-dom';
import MyGuestsTable from './MyGuestsTable';
import { NotificationManager } from 'react-notifications';
import ReCAPTCHA from 'react-google-recaptcha';
import React from 'react';
import { withRouter } from 'react-router-dom';
import requester from '../../../initDependencies';

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
    this.onReservationAccept = this.onReservationAccept.bind(this);
    this.onReservationCancel = this.onReservationCancel.bind(this);
    this.onReservationReject = this.onReservationReject.bind(this);
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

  onReservationAccept() {
    this.acceptCaptcha.execute();
  }

  onReservationCancel() {
    this.cancelCaptcha.execute();
  }

  onReservationReject() {
    this.rejectCaptcha.execute();
  }

  acceptReservation(captchaToken) {
    const id = this.state.selectedReservationId;
    requester.acceptReservation(id, captchaToken).then(res => {
      res.body.then(data => {
        if (res.success) {
          this.setReservationIsAccepted(id, true);
          NotificationManager.success(data.message, 'Reservation Operations');
        } else {
          NotificationManager.error(data.message, 'Reservation Operations');
        }
      });
    });
  }

  cancelReservation(captchaToken) {
    const id = this.state.selectedReservationId;
    requester.cancelReservation(id, captchaToken).then(res => {
      res.body.then(data => {
        if (res.success) {
          this.setReservationIsAccepted(id, false);
          NotificationManager.success(data.message, 'Reservation Operations');
        } else {
          NotificationManager.error(data.message, 'Reservation Operations');
        }
      });
    });
  }

  rejectReservation(captchaToken) {
    const id = this.state.selectedReservationId;
    const message = this.state.cancellationText;
    let messageObj = { message: message };
    requester.cancelTrip(id, messageObj, captchaToken)
      .then(res => {
        res.body.then(data => {
          if (res.success) {
            this.deleteReservationFromState(id);
            NotificationManager.success(data.message, 'Reservation Operations');
          } else {
            NotificationManager.error(data.message, 'Reservation Operations');
          }
        });
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
        <ReCAPTCHA
          ref={el => this.acceptCaptcha = el}
          size="invisible"
          sitekey={Config.getValue('recaptchaKey')}
          onChange={token => { this.acceptReservation(token); this.acceptCaptcha.reset(); }} />
        <ReCAPTCHA
          ref={el => this.cancelCaptcha = el}
          size="invisible"
          sitekey={Config.getValue('recaptchaKey')}
          onChange={token => { this.cancelReservation(token); this.cancelCaptcha.reset(); }} />
        <ReCAPTCHA
          ref={el => this.rejectCaptcha = el}
          size="invisible"
          sitekey={Config.getValue('recaptchaKey')}
          onChange={token => { this.rejectReservation(token); this.rejectCaptcha.reset(); }} />

        <CancellationModal
          name={'showRejectReservationModal'}
          value={this.state.cancellationText}
          title={'Delete Reservation'}
          text={'Tell your guest why do you want to reject his reservation.'}
          onChange={this.onChange}
          isActive={this.state.showRejectReservationModal}
          onClose={this.closeModal}
          onSubmit={this.onReservationReject} />

        <section id="profile-my-reservations">
          <div className="container">
            <h2>Upcoming Reservations ({this.state.totalReservations})</h2>
            <hr />
            <MyGuestsTable
              reservations={this.state.reservations}
              onReservationAccept={this.onReservationAccept}
              onReservationCancel={this.onReservationCancel}
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

export default withRouter(MyGuestsPage);