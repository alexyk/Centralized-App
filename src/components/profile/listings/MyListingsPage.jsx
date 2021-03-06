import '../../../styles/css/components/profile/listings/my-listings-page.css';

import DeletionModal from '../../common/modals/DeletionModal';
import { LISTING_DELETED } from '../../../constants/successMessages.js';
import { LONG } from '../../../constants/notificationDisplayTimes.js';
import { Link } from 'react-router-dom';
import MyListingsInProgressItem from './MyListingsInProgressItem';
import MyListingsItemRow from './MyListingsItemRow';
import { NotificationManager } from 'react-notifications';
import { PROPERTY_CANNOT_BE_DELETED } from '../../../constants/errorMessages.js';
import React from 'react';
import filterListings from '../../../actions/filterListings';
import requester from '../../../requester';

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
  }

  componentDidMount() {
    requester.getMyListings(['page=0']).then(res => {
      res.body.then(data => {
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
    });

    requester.getMyListingsInProgress(['page=0']).then(res => {
      res.body.then(data => {
        this.setState({ listingsInProgress: data.content, totalListingsInProgress: data.totalElements });
      });
    });
  }

  deleteInProgressListing(id) {
    requester.deleteInProgressListing(id).then(res => {
      if (res.success) {
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

    requester.getMyListings([`page=${page - 1}`]).then(res => {
      res.body.then(data => {
        this.setState({
          listings: data.content,
          totalListings: data.totalElements,
          loading: false
        });
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
    requester.deleteListing(deletingId, token).then(res => {
      if (res.success) {
        const listingStateKey = this.state.listingState + 'Listings';
        const listings = this.state[listingStateKey];
        const filteredListings = listings.filter(x => x.id !== deletingId);
        this.setState({ [listingStateKey]: filteredListings });
        NotificationManager.success(LISTING_DELETED, '', LONG);
      } else {
        NotificationManager.error(PROPERTY_CANNOT_BE_DELETED, 'Listing Operations', LONG);
      }
      this.handleCloseDeleteListing();
    }).catch(e => {
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

  render() {
    if (this.state.loading && this.state.listingsInProgress !== null) {
      return <div className="loader"></div>;
    }

    return (
      <div className="container">
        <section id="profile-mylistings">
          <h2>Active ({this.state.activeListings.length})</h2>
          <hr />
          {this.state.activeListings.map((item, i) => {
            return (
              <MyListingsItemRow
                key={i}
                styleClass="my-listings-flex-container"
                handleOpenDeleteListingModal={this.handleOpenDeleteListingModal}
                state={item.state}
                filterListings={this.filterListings}
                listing={item}
              />
            );
          })}

          <h2>Inactive ({this.state.inactiveListings.length})</h2>
          <hr />
          {this.state.deniedListings && this.state.inactiveListings.map((item, i) => {
            return (
              <MyListingsItemRow
                key={i}
                styleClass="my-listings-flex-container"
                handleOpenDeleteListingModal={this.handleOpenDeleteListingModal}
                state={item.state}
                filterListings={this.filterListings}
                listing={item}
              />
            );
          })}

          <h2>Denied ({this.state.deniedListings.length})</h2>
          <hr />
          {this.state.deniedListings && this.state.deniedListings.map((item, i) => {
            return (
              <MyListingsItemRow
                key={i}
                styleClass="my-listings-flex-container"
                handleOpenDeleteListingModal={this.handleOpenDeleteListingModal}
                state={item.state}
                filterListings={this.filterListings}
                listing={item}
              />
            );
          })}

          <h2>In Progress ({this.state.totalListingsInProgress})</h2>
          <hr />
          {this.state.listingsInProgress && this.state.listingsInProgress.map((item, i) => {
            return (
              <MyListingsInProgressItem
                key={i}
                id={item.id}
                step={item.step}
                deleteInProgressListing={this.deleteInProgressListing}
                filterListings={this.filterListings}
                listing={JSON.parse(item.data)}
              />
            );
          })}

          <div className="my-listings">
            <Link className="btn btn-primary create-listing" to="/profile/listings/create/landing">Add new listing</Link>
          </div>
        </section>

        <DeletionModal
          isActive={this.state.isShownDeleteListingModal}
          deletingName={this.state.deletingName}
          isDeleting={this.state.isDeleting}
          handleDeleteListing={this.handleDeleteListing}
          deletingId={this.state.deletingId}
          onHide={this.handleCloseDeleteListing}
        />
      </div>
    );
  }
}

export default MyListingsPage;
