import { NotificationManager } from 'react-notifications';
import { changeListingStatus, contactHost, getAllUnpublishedListings, getCities, getCountries } from '../../../requester';

import Filter from './Filter';
import ContactHostModal from '../../common/modals/ContactHostModal';
import DeletionModal from '../../common/modals/DeletionModal';
import Pagination from '../../common/pagination/Pagination';
import PropTypes from 'prop-types';
import React from 'react';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom';
import filterListings from '../../../actions/filterListings';
import UnpublishedItem from './UnpublishedItem';

class UnpublishedListings extends React.Component {
  constructor(props) {
    super(props);

    let searchMap = queryString.parse(this.props.location.search);
    this.state = {
      listings: [],
      loading: true,
      totalElements: 0,
      currentPage: !searchMap.page ? 0 : Number(searchMap.page),
      country: searchMap.countryId === undefined ? '' : searchMap.countryId,
      city: searchMap.cityId === undefined ? '' : searchMap.cityId,
      cities: [],
      countries: [],
      name: searchMap.listingName === undefined ? '' : searchMap.listingName,
      hostEmail: searchMap.host === undefined ? '' : searchMap.host,
      isShownContactHostModal: false,
      isShownDeleteListingModal: false,
      deletingId: -1,
      deletingName: '',
    };

    this.onPageChange = this.onPageChange.bind(this);
    this.updateListingStatus = this.updateListingStatus.bind(this);
    this.handleSelectCountry = this.handleSelectCountry.bind(this);
    this.handleSelectCity = this.handleSelectCity.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onChange = this.onChange.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.sendMessageToHost = this.sendMessageToHost.bind(this);
    this.handleDeleteListing = this.handleDeleteListing.bind(this);
    this.handleCloseDeleteListing = this.handleCloseDeleteListing.bind(this);
    this.filterListings = filterListings.bind(this);
  }

  componentDidMount() {
    let searchTerm = this.buildSearchTerm();
    getAllUnpublishedListings(searchTerm).then((data) => {
      this.setState({ listings: data.content, loading: false, totalElements: data.totalElements });
    });

    if (this.state.country !== '') {
      getCities(this.state.country).then(data => {
        this.setState({ cities: data.content });
      });
    }

    getCountries().then(data => {
      this.setState({ countries: data.content });
    });

  }

  onSearch() {
    this.setState({ loading: true });

    let searchTerm = this.buildSearchTerm();

    getAllUnpublishedListings(searchTerm).then((data) => {
      this.props.history.push(`/profile/admin/listings/unpublished${searchTerm}`);
      this.setState({ listings: data.content, loading: false, totalElements: data.totalElements });
    });
  }


  buildSearchTerm() {
    let searchTerm = `?`;

    if (this.state.city) {
      searchTerm += `&cityId=${this.state.city}`;
    }

    if (this.state.name) {
      searchTerm += `&listingName=${this.state.name}`;
    }

    if (this.state.country) {
      searchTerm += `&countryId=${this.state.country}`;
    }

    if (this.state.hostEmail) {
      searchTerm += `&host=${this.state.hostEmail}`;
    }

    return searchTerm;
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSelectCountry(option) {
    this.setState({
      country: option ? option.value : null,
      city: null
    }, () => {
      if (option) {
        getCities(option.value).then(data => {
          this.setState({
            cities: data.content,
          });
        });
      } else {
        this.setState({
          cities: [],
        });
      }
    });
  }

  handleSelectCity(option) {
    this.setState({
      city: option ? option.value : null,
    });
  }

  onPageChange(page) {
    this.setState({
      currentPage: page - 1,
      loading: true
    });

    let searchTerm = queryString.parse(this.props.location.search);

    searchTerm.page = page - 1;

    let newSearchTerm = queryString.stringify(searchTerm);
    getAllUnpublishedListings('?' + newSearchTerm).then(data => {
      this.props.history.push('?' + newSearchTerm);
      this.setState({
        listings: data.content,
        totalElements: data.totalElements,
        loading: false
      });
    });
  }

  updateListingStatus(id) {
    let publishObj = {
      listingId: id,
      state: 'active'
    };

    changeListingStatus(publishObj).then((res) => {
      if (res.success) {
        NotificationManager.success('Successfully changed status to active', 'Listings Operations');
        let allListings = this.state.listings;
        this.setState({ listings: allListings.filter(x => x.id !== id) });
      }
      else {
        NotificationManager.error('Something went wrong', 'Listings Operations');
      }
    });
  }

  sendMessageToHost(id, message, captchaToken) {
    this.setState({ loading: true });
    let contactHostObj = {
      message: message
    };

    contactHost(id, contactHostObj, captchaToken)
      .then(res => {
        this.props.history.push(`/profile/messages/chat/${res.conversation}`);
      });
  }

  openModal(id) {
    this.setState({ isShownContactHostModal: true, selectedListing: id });
  }

  closeModal() {
    this.setState({ isShownContactHostModal: false });
  }

  handleDeleteListing(id, name) {
    this.setState(
      {
        isShownDeleteListingModal: true,
        deletingId: id,
        deletingName: name
      }
    );
  }

  handleCloseDeleteListing() {
    this.setState(
      {
        isShownDeleteListingModal: false,
        deletingId: -1,
        deletingName: ''
      }
    );
  }

  render() {
    if (this.state.loading) {
      return <div className="loader"></div>;
    }

    return (
      <div className="my-reservations">
        <section id="profile-my-reservations">
          <div>
            <Filter
              countries={this.state.countries}
              cities={this.state.cities}
              city={this.state.city}
              country={this.state.country}
              name={this.state.name}
              hostEmail={this.state.hostEmail}
              handleSelectCountry={this.handleSelectCountry}
              handleSelectCity={this.handleSelectCity}
              onSearch={this.onSearch}
              loading={this.state.countries === [] || this.state.countries.length === 0}
              onChange={this.onChange} />

            <ContactHostModal
              id={this.state.selectedListing}
              isActive={this.state.isShownContactHostModal}
              closeModal={this.closeModal}
              sendMessageToHost={this.sendMessageToHost}
            />

            <DeletionModal
              isActive={this.state.isShownDeleteListingModal}
              deletingName={this.state.deletingName}
              filterListings={this.filterListings}
              deletingId={this.state.deletingId}
              onHide={this.handleCloseDeleteListing}
            />

            {this.state.listings.length === 0 
              ? <div className="text-center p20"><h3>There isn&#39;t any unpublished listings</h3></div> 
              : <div>
                {this.state.listings.map((l, i) => {
                  return (
                    <UnpublishedItem key={i}/>
                  );
                })}                

                <Pagination
                  loading={this.state.totalReservations === 0}
                  onPageChange={this.onPageChange}
                  currentPage={this.state.currentPage + 1}
                  pageSize={20}
                  totalElements={this.state.totalElements}
                />
              </div>
            }
          </div>
        </section>
      </div>
    );
  }
}

UnpublishedListings.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object
};

export default withRouter(UnpublishedListings);