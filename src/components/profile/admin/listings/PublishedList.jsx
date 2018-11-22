import { NavLink, withRouter } from 'react-router-dom';

import AdminNav from '../AdminNav';
import { Config } from '../../../../config';
import ContactHostModal from '../../../common/modals/ContactHostModal';
import Filter from './Filter';
import { LISTING_UNPUBLISHED } from '../../../../constants/successMessages.js';
import { LONG } from '../../../../constants/notificationDisplayTimes.js';
import Lightbox from 'react-images';
import ListItem from './ListItem';
import { MESSAGE_SENT } from '../../../../constants/infoMessages.js';
import NoEntriesMessage from '../../../common/messages/NoEntriesMessage';
import { NotificationManager } from 'react-notifications';
import Pagination from '../../../common/pagination/Pagination';
import PropTypes from 'prop-types';
import React from 'react';
import queryString from 'query-string';
import requester from '../../../../requester';

class PublishedList extends React.Component {
  constructor(props) {
    super(props);

    let searchMap = queryString.parse(this.props.location.search);
    this.state = {
      listings: [],
      expandedListings: [],
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
      selectedListing: '1'
    };

    this.onPageChange = this.onPageChange.bind(this);
    this.updateListingStatus = this.updateListingStatus.bind(this);
    this.handleSelectCountry = this.handleSelectCountry.bind(this);
    this.handleSelectCity = this.handleSelectCity.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onChange = this.onChange.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openContactHostModal = this.openContactHostModal.bind(this);
    this.closeContactHostModal = this.closeContactHostModal.bind(this);
    this.handleContactHost = this.handleContactHost.bind(this);
    this.handleExpandListing = this.handleExpandListing.bind(this);
    this.handleShrinkListing = this.handleShrinkListing.bind(this);
    this.closeLightbox = this.closeLightbox.bind(this);
    this.gotoNext = this.gotoNext.bind(this);
    this.gotoPrevious = this.gotoPrevious.bind(this);
    this.gotoImage = this.gotoImage.bind(this);
    this.handleClickImage = this.handleClickImage.bind(this);
    this.openLightbox = this.openLightbox.bind(this);
  }

  componentDidMount() {
    let search = this.buildSearchTerm();
    requester.getAllPublishedListings(search.searchTermMap).then(res => {
      res.body.then(data => {
        this.setState({ listings: data.content, loading: false, totalElements: data.totalElements });
      });
    });

    if (this.state.country !== '') {
      requester.getCities(this.state.country).then(res => {
        res.body.then(data => {
          this.setState({ cities: data.content });
        });
      });
    }

    requester.getCountries()
      .then(res => res.body)
      .then(data => {
        this.setState({ countries: data });
      });
  }

  onSearch() {
    this.setState({ loading: true });

    let search = this.buildSearchTerm();

    requester.getAllPublishedListings(search.searchTermMap).then(res => {
      res.body.then(data => {
        this.props.history.push(`/profile/admin/listings/published${search.searchTerm}`);
        this.setState({ listings: data.content, loading: false, totalElements: data.totalElements });
      });
    });
  }

  buildSearchTerm() {
    let searchTermMap = [];
    let searchTerm = '?';

    if (this.state.city) {
      searchTermMap.push(`cityId=${this.state.city}`);
      searchTerm += `&cityId=${this.state.city}`;
    }

    if (this.state.name) {
      searchTermMap.push(`listingName=${this.state.name}`);
      searchTerm += `&listingName=${this.state.name}`;
    }

    if (this.state.country) {
      searchTermMap.push(`countryId=${this.state.country}`);
      searchTerm += `&countryId=${this.state.country}`;
    }

    if (this.state.hostEmail) {
      searchTermMap.push(`host=${this.state.hostEmail}`);
      searchTerm += `&host=${this.state.hostEmail}`;
    }

    return {
      searchTerm,
      searchTermMap
    };
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
        requester.getCities(option.value).then(res => {
          res.body.then(data => {
            this.setState({
              cities: data.content,
            });
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
    let arraySearchTerm = [];
    searchTerm.page = page - 1;

    for (let key in searchTerm) {
      let kvp = `${key}=${searchTerm[key]}`;
      arraySearchTerm.push(kvp);
    }

    let newSearchTerm = queryString.stringify(searchTerm);
    requester.getAllPublishedListings(arraySearchTerm).then(res => {
      res.body.then(data => {
        this.props.history.push('?' + newSearchTerm);
        this.setState({
          listings: data.content,
          totalElements: data.totalElements,
          loading: false
        });
      });
    });
  }

  updateListingStatus(event, id, status) {
    if (event) {
      event.preventDefault();
    }

    let unpublishObj = {
      listingId: id,
      state: status
    };

    requester.changeListingStatus(unpublishObj).then(res => {
      if (res.success) {
        NotificationManager.success(LISTING_UNPUBLISHED, '', LONG);
        const allListings = this.state.listings;
        const newListings = allListings.filter(x => x.id !== id);
        const totalElements = this.state.totalElements;
        this.setState({ listings: newListings, totalElements: totalElements - 1 });
        if (newListings.length === 0 && totalElements > 0) {
          this.onPageChange(1);
        }
      }
      else {
        res.errors.then(e => {
          NotificationManager.warning(e.message, '', LONG);
        });
      }
    });
  }

  handleContactHost(id, message) {
    let contactHostObj = {
      message: message
    };

    requester.contactHost(id, contactHostObj).then(() => {
      NotificationManager.info(MESSAGE_SENT, '', LONG);
      this.closeContactHostModal();
    });
  }

  openModal(id) {
    this.setState({ isShownContactHostModal: true, selectedListing: id });
  }

  closeModal() {
    this.setState({ isShownContactHostModal: false });
  }

  openContactHostModal(event, id) {
    if (event) {
      event.preventDefault();
    }

    this.setState({ isShownContactHostModal: true, selectedListing: id });
  }

  closeContactHostModal() {
    this.setState({ isShownContactHostModal: false });
  }

  handleExpandListing(event, id) {
    if (event) {
      event.preventDefault();
    }

    const { expandedListings } = this.state;
    expandedListings[id] = true;
    this.setState({ expandedListings });
  }

  handleShrinkListing(event, id) {
    if (event) {
      event.preventDefault();
    }

    const { expandedListings } = this.state;
    expandedListings[id] = false;
    this.setState({ expandedListings });
  }

  openLightbox(event, id, index) {
    event.preventDefault();
    this.setState({
      lightboxIsOpen: true,
      imagesListingId: id,
      currentImage: index,
    });
  }

  closeLightbox() {
    this.setState({
      currentImage: 0,
      lightboxIsOpen: false,
    });
  }

  gotoPrevious() {
    this.setState({
      currentImage: this.state.currentImage - 1,
    });
  }

  gotoNext() {
    this.setState({
      currentImage: this.state.currentImage + 1,
    });
  }

  gotoImage(index) {
    this.setState({
      currentImage: index,
    });
  }

  handleClickImage() {
    if (this.state.currentImage === this.state.data.pictures.length - 1) return;
    this.gotoNext();
  }

  render() {
    if (this.state.loading) {
      return <div className="loader" style={{ 'marginBottom': '40px' }}></div>;
    }

    const { imagesListingId } = this.state;
    let images = [];
    if (this.state.lightboxIsOpen) {
      images = this.state.listings.filter(l => l.id === imagesListingId)[0].pictures
        .map(p => {
          return { src: Config.getValue('imgHost') + p.original };
        });
    }

    return (
      <div>
        <AdminNav>
          <div>
            <li><NavLink exact activeClassName="active" to="/profile/admin/listings/unpublished"><h2>Unpublished</h2></NavLink></li>
            <li><NavLink exact activeClassName="active" to="/profile/admin/listings/published"><h2>Published</h2></NavLink></li>
          </div>
        </AdminNav>
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
                closeModal={this.closeContactHostModal}
                handleContactHost={this.handleContactHost}
              />

              {this.state.listings.length === 0
                ? <NoEntriesMessage text="No listings to show" />
                : <div>
                  {this.state.listings.map((l, i) => {
                    return (
                      <ListItem
                        key={i}
                        item={l}
                        isExpanded={this.state.expandedListings[l.id]}
                        openLightbox={this.openLightbox}
                        openContactHostModal={this.openContactHostModal}
                        updateListingStatus={this.updateListingStatus}
                        handleExpandListing={this.handleExpandListing}
                        handleShrinkListing={this.handleShrinkListing}
                      />
                    );
                  })}
                </div>
              }

              <Pagination
                loading={this.state.totalReservations === 0}
                onPageChange={this.onPageChange}
                currentPage={this.state.currentPage + 1}
                pageSize={10}
                totalElements={this.state.totalElements}
              />

              {this.state.lightboxIsOpen && images !== null &&
                <Lightbox
                  currentImage={this.state.currentImage}
                  images={images}
                  isOpen={this.state.lightboxIsOpen}
                  onClickNext={this.gotoNext}
                  onClickPrev={this.gotoPrevious}
                  onClickThumbnail={this.gotoImage}
                  onClose={this.closeLightbox}
                />
              }
            </div>
          </section>
        </div>
      </div>
    );
  }
}

PublishedList.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,

};

export default withRouter(PublishedList);
