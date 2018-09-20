import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import ReCAPTCHA from 'react-google-recaptcha';

import { Config } from '../../../../config';
import CancellationModal from '../../../common/modals/CancellationModal';
import Pagination from '../../../common/pagination/Pagination';
import requester from '../../../../requester';
import HomeTripsList from './HomeTripsList';

import { withRouter } from 'react-router-dom';

import { BOOKING_REQUEST_SENT } from '../../../../constants/successMessages.js';
import { LONG } from '../../../../constants/notificationDisplayTimes.js';

class HomeTripsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      trips: [],
      loading: true,
      totalTrips: 0,
      currentPage: 1,
      currentTripId: null,
      selectedTripId: 0,
      cancellationText: '',
      showCancelTripModal: false,
    };

    this.onPageChange = this.onPageChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onTripCancel = this.onTripCancel.bind(this);
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
    requester.getMyTrips(['page=0']).then(res => {
      res.body.then(data => {
        this.setState({ trips: data.content, totalTrips: data.totalElements, loading: false, currentTripId: id });
        if (id) {
          NotificationManager.success(BOOKING_REQUEST_SENT, 'Reservation Operations', LONG);
        }
      });
    });
  }

  onTripCancel() {
    this.cancelCaptcha.execute();
  }

  cancelTrip(captchaToken) {
    const id = this.state.selectedTripId;
    const message = this.state.cancellationText;
    let messageObj = { message: message };
    requester.cancelTrip(id, messageObj, captchaToken).then(res => {
      res.body.then(data => {
        if (res.success) {
          this.componentDidMount();
          NotificationManager.success(data.message, 'Reservation Operations', LONG);
        } else {
          NotificationManager.error(data.message, 'Reservation Operations', LONG);
        }
      });
    });
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

    this.setState({
      currentPage: page,
      loading: true
    });

    requester.getMyTrips([`page=${page - 1}`]).then(res => {
      res.body.then(data => {
        this.setState({
          trips: data.content,
          totalTrips: data.totalElements,
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

  onTripSelect(id) {
    this.setState({ selectedTripId: id });
  }

  render() {
    if (this.state.loading) {
      return <div className="loader"></div>;
    }

    return (
      <div className="my-reservations">
        <ReCAPTCHA
          ref={el => this.cancelCaptcha = el}
          size="invisible"
          sitekey={Config.getValue('recaptchaKey')}
          onChange={token => { this.cancelTrip(token); this.cancelCaptcha.reset(); }} />

        <CancellationModal
          name={'showCancelTripModal'}
          value={this.state.cancellationText}
          title={'Cancel Trip'}
          text={'Tell your host why do you want to cancel your trip.'}
          onChange={this.onChange}
          isActive={this.state.showCancelTripModal}
          onClose={this.closeModal}
          onSubmit={this.onTripCancel} />

        <section id="profile-my-reservations">
          <div>
            <h2>Upcoming Trips ({this.state.totalTrips})</h2>
            <hr />

            <HomeTripsList
              trips={this.state.trips}
              currentTripId={this.state.currentTripId}
              onTripSelect={this.onTripSelect}
              handleCancelReservation={() => this.openModal('showCancelTripModal')}
              loading={this.state.loading}
            />

            <Pagination
              loading={this.state.totalListings === 0}
              onPageChange={this.onPageChange}
              currentPage={this.state.currentPage}
              totalElements={this.state.totalTrips}
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

HomeTripsPage.propTypes = {
  location: PropTypes.object
};

export default withRouter(HomeTripsPage);