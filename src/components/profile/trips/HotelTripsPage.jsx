import { closeModal, openModal } from '../../../actions/modalsInfo.js';

import { Config } from '../../../config';
import { HotelReservation } from '../../../services/blockchain/hotelReservation';
import HotelTripsTable from './HotelTripsTable';
import { Link } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import { PASSWORD_PROMPT } from '../../../constants/modals.js';
import Pagination from '../../common/pagination/Pagination';
import PasswordModal from '../../common/modals/PasswordModal';
import PropTypes from 'prop-types';
import ReCAPTCHA from 'react-google-recaptcha';
import React from 'react';
import { connect } from 'react-redux';
import requester from '../../../initDependencies';
import { withRouter } from 'react-router-dom';

class HotelTripsPage extends React.Component {
  constructor(props) {
    super(props);

    this.captcha = null;

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
    this.onTripCancel = this.handleCancelTrip.bind(this);
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
          NotificationManager.success('Booking Request Sent Successfully, your host will get back to you with additional questions.', 'Reservation Operations');
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
    let bookingForCancellation = {};
    bookingForCancellation.bookingId = this.state.bookingPrepareId;
    console.log(bookingForCancellation);
    requester.cancelBooking(bookingForCancellation).then(res => {
      if (res.success === true) {
        requester.getMyJsonFile().then(res => {
          res.body.then(data => {
            NotificationManager.info('Your reservation is being cancelled...', 'Transactions', 10000);
            this.closeModal(PASSWORD_PROMPT);

            HotelReservation.cancelReservation(data.jsonFile, this.state.password, this.state.bookingPrepareId.toString()).then(response => {
              // console.log(response);
            }).catch(error => {
              if (error.hasOwnProperty('message')) {
                NotificationManager.warning(error.message, 'Cancel Reservation');
              } else if (error.hasOwnProperty('err') && error.err.hasOwnProperty('message')) {
                NotificationManager.warning(error.err.message, 'Cancel Reservation');
              } else if (typeof x === 'string') {
                NotificationManager.warning(error, 'Cancel Reservation');
              } else {
                NotificationManager.warning(error);
              }

              this.closeModal(PASSWORD_PROMPT);
            });
          });
        });

      } else {
        NotificationManager.warning('We cannot cancel your reservation');
        this.closeModal(PASSWORD_PROMPT);
      }
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

            <HotelTripsTable
              trips={this.state.trips}
              currentTripId={this.state.currentTripId}
              onTripSelect={this.onTripSelect}
              handleCancelReservation={(e) => this.openModal(PASSWORD_PROMPT)}
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

        <PasswordModal
          isActive={this.props.modalsInfo.isActive[PASSWORD_PROMPT]}
          text={'Enter your wallet password'}
          placeholder={'Wallet password'}
          handleSubmit={() => this.handleCancelTrip()}
          closeModal={this.closeModal}
          password={this.state.password}
          onChange={this.onChange}
        />

        <ReCAPTCHA
          ref={el => this.captcha = el}
          size="invisible"
          sitekey={Config.getValue('recaptchaKey')}
          onChange={token => {
            this.handleCancelTrip(token);
            this.captcha.reset();
          }}
        />
      </div>
    );
  }
}

HotelTripsPage.propTypes = {
  location: PropTypes.object
};

function mapStateToProps(state) {
  const { modalsInfo } = state;
  return {
    modalsInfo,
  };
}

export default withRouter(connect(mapStateToProps)(HotelTripsPage));
