import { deleeteInProgressListing, getMyListings, getMyListingsInProgress } from '../../../requester';

import { NotificationManager } from 'react-notifications';
import { Link } from 'react-router-dom';
import MyListingsActiveItem from './MyListingsActiveItem';
import MyListingsInProgressItem from './MyListingsInProgressItem';
import React from 'react';
import filterListings from '../../../actions/filterListings';
import { deleteListing } from '../../../requester';
import DeletionModal from '../../common/modals/DeletionModal';
import { Config } from '../../../config';
import ReCAPTCHA from 'react-google-recaptcha';


class MyListingsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeListings: [],
      deniedListings: [],
      inactiveListings: [],
      totalListings: 0,
      loading: true,
      currentPage: 1,
      listingsInProgress: null,
      totalListingsInProgress: 0
    };

    this.filterListings = filterListings.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.deleteInProgressListing = this.deleteInProgressListing.bind(this);
    this.handleOpenDeleteListingModal = this.handleOpenDeleteListingModal.bind(this);
    this.handleDeleteListing = this.handleDeleteListing.bind(this);
    this.handleCloseDeleteListing = this.handleCloseDeleteListing.bind(this);
    this.executeCaptcha = this.executeCaptcha.bind(this);
  }

  componentDidMount() {
    getMyListings('?page=0').then((data) => {
      console.log(data);
      const active = data.content.filter(l => l.state === 'active');
      const denied = data.content.filter(l => l.state === 'denied');
      const inactive = data.content.filter(l => l.state === 'inactive');
      this.setState({
        activeListings: active,
        deniedListings: denied,
        inactiveListings: inactive,
        loading: false
      });
    });

    getMyListingsInProgress('?page=0').then((data) => {
      this.setState({ listingsInProgress: data.content, totalListingsInProgress: data.totalElements });
    });
  }

  deleteInProgressListing(id) {
    deleeteInProgressListing(id).then((data) => {
      if (data.success) {
        let listingsInProgress = this.state.listingsInProgress;
        listingsInProgress = listingsInProgress.filter(x => x.id !== id);
        this.setState({ listingsInProgress: listingsInProgress, totalListingsInProgress: this.state.totalListingsInProgress - 1 });
      }
    });
  }

  onPageChange(page) {
    this.setState({
      currentPage: page,
      loading: true
    });
    window.scrollTo(0, 0);

    getMyListings(`?page=${page - 1}`).then(data => {
      this.setState({
        listings: data.content,
        totalListings: data.totalElements,
        loading: false
      });
    });
  }

  handleOpenDeleteListingModal(event, id, name, listingState) {
    if (event) {
      event.preventDefault();
    }

    this.setState({
      isShownDeleteListingModal: true,
      deletingId: id,
      deletingName: name,
      listingState: listingState,
    });
  }

  handleDeleteListing(token) {
    this.setState({ isDeleting: true });
    const { deletingId } = this.state;
    deleteListing(deletingId, token)
      .then(res => {
        if (res.success) {
          const listingStateKey = this.state.listingState + 'Listings';
          const listings = this.state[listingStateKey];
          const filteredListings = listings.filter(x => x.id !== deletingId);
          this.setState({ [listingStateKey]: filteredListings });
          NotificationManager.success('Listing deleted');
        } else {
          NotificationManager.error('Cannot delete this property. It might have reservations or other irrevocable actions.');
        }
        this.handleCloseDeleteListing();
      }).catch(e => {
        console.log(e);
        this.handleCloseDeleteListing();
      });
  }

  handleCloseDeleteListing() {
    this.setState(
      {
        isShownDeleteListingModal: false,
        deletingId: -1,
        isDeleting: false,
        deletingName: '',
        listingState: ''
      }
    );
  }

  executeCaptcha() {
    this.captcha.execute();
  }


  render() {
    if (this.state.loading && this.state.listingsInProgress !== null) {
      return <div className="loader"></div>;
    }

    return (
      <div className="container">
        <section id="profile-mylistings">
          <div className="container">
            <h2>Active ({this.state.activeListings.length})</h2>
            <hr className="profile-line" />
            {this.state.activeListings.map((item, i) => {
              return <MyListingsActiveItem handleOpenDeleteListingModal={this.handleOpenDeleteListingModal} state={item.state} filterListings={this.filterListings} listing={item} key={i} />;
            })}
          </div>

          <div className="container">
            <h2>Inactive ({this.state.inactiveListings.length})</h2>
            <hr className="profile-line" />
            {this.state.deniedListings && this.state.inactiveListings.map((item, i) => {
              return <MyListingsActiveItem handleOpenDeleteListingModal={this.handleOpenDeleteListingModal} state={item.state} filterListings={this.filterListings} listing={item} key={i} />;
            })}
          </div>

          <div className="container">
            <h2>Denied ({this.state.deniedListings.length})</h2>
            <hr className="profile-line" />
            {this.state.deniedListings && this.state.deniedListings.map((item, i) => {
              return <MyListingsActiveItem handleOpenDeleteListingModal={this.handleOpenDeleteListingModal} state={item.state} filterListings={this.filterListings} listing={item} key={i} />;
            })}
          </div>

          <div className="container">
            <h2>In Progress ({this.state.totalListingsInProgress})</h2>
            <hr className="profile-line" />
            {this.state.listingsInProgress && this.state.listingsInProgress.map((item, i) => {
              return <MyListingsInProgressItem deleteInProgressListing={this.deleteInProgressListing} id={item.id} step={item.step} filterListings={this.filterListings} listing={JSON.parse(item.data)} key={i} />;
            })}


            <div className="my-listings">
              <Link className="btn btn-primary create-listing" to="/profile/listings/create/landing">Add new listing</Link>
            </div>
          </div>
        </section>

        <DeletionModal
          isActive={this.state.isShownDeleteListingModal}
          deletingName={this.state.deletingName}
          isDeleting={this.state.isDeleting}
          // filterListings={this.filterListings}
          handleDeleteListing={this.executeCaptcha}
          deletingId={this.state.deletingId}
          onHide={this.handleCloseDeleteListing}
        />

        <ReCAPTCHA
          ref={el => this.captcha = el}
          size="invisible"
          sitekey={Config.getValue('recaptchaKey')}
          onChange={token => { this.handleDeleteListing(token); this.captcha.reset(); }}
        />
      </div>
    );
  }
}

export default MyListingsPage;