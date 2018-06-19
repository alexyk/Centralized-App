import { NotificationManager } from 'react-notifications';
import { changeListingStatus, contactHost, getAllUnpublishedListings, getCities, getCountries, deleteListing } from '../../../requester';

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
import { Config } from '../../../config';
import ReCAPTCHA from 'react-google-recaptcha';
import NoEntriesMessage from '../common/NoEntriesMessage';
import Lightbox from 'react-images';

import '../../../styles/css/components/captcha/captcha-container.css';

class UnpublishedListings extends React.Component {
  constructor(props) {
    super(props);

    this.captcha = null;
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
      isShownDeleteListingModal: false,
      isDeleting: false,
      deletingId: -1,
      deletingName: '',
    };

    this.onPageChange = this.onPageChange.bind(this);
    this.updateListingStatus = this.updateListingStatus.bind(this);
    this.handleSelectCountry = this.handleSelectCountry.bind(this);
    this.handleSelectCity = this.handleSelectCity.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onChange = this.onChange.bind(this);
    this.openContactHostModal = this.openContactHostModal.bind(this);
    this.closeContactHostModal = this.closeContactHostModal.bind(this);
    this.handleContactHost = this.handleContactHost.bind(this);
    this.handleDeleteListing = this.handleDeleteListing.bind(this);
    this.handleOpenDeleteListingModal = this.handleOpenDeleteListingModal.bind(this);
    this.handleCloseDeleteListing = this.handleCloseDeleteListing.bind(this);
    this.filterListings = filterListings.bind(this);
    this.executeCaptcha = this.executeCaptcha.bind(this);
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

  executeCaptcha() {
    this.captcha.execute();
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

  updateListingStatus(event, id, status) {
    if (event) {
      event.preventDefault();
    }

    let publishObj = {
      listingId: id,
      state: status
    };

    changeListingStatus(publishObj).then((res) => {
      if (res.success) {
        switch (status) {
          case 'active': NotificationManager.success('Listing approved');
            break;
          case 'denied': NotificationManager.success('Listing denied');
            break;
        }

        const allListings = this.state.listings;
        const newListings = allListings.filter(x => x.id !== id);
        const totalElements = this.state.totalElements;
        this.setState({ listings: newListings, totalElements: totalElements - 1 });
      }
      else {
        NotificationManager.error('Something went wrong');
      }
    });
  }

  handleContactHost(id, message, captchaToken) {
    // this.setState({ loading: true });
    let contactHostObj = {
      message: message
    };

    contactHost(id, contactHostObj, captchaToken)
      .then(res => {
        // this.props.history.push(`/profile/messages/chat/${res.conversation}`);
        NotificationManager.info('Message sent');
        this.closeContactHostModal();
      });
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

  handleOpenDeleteListingModal(event, id, name) {
    if (event) {
      event.preventDefault();
    }

    this.setState({
      isShownDeleteListingModal: true,
      deletingId: id,
      deletingName: name
    });
  }

  handleDeleteListing(token) {
    this.setState({ isDeleting: true });
    const { deletingId } = this.state;
    deleteListing(deletingId, token)
      .then(res => {
        if (res.success) {
          const allListings = this.state.listings;
          const newListings = allListings.filter(x => x.id !== deletingId);
          const totalElements = this.state.totalElements;
          this.setState({ listings: newListings, totalElements: totalElements - 1 });
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
        deletingName: ''
      }
    );
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
    console.log(id, index)
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
      return <div className="loader"></div>;
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

            <DeletionModal
              isActive={this.state.isShownDeleteListingModal}
              deletingName={this.state.deletingName}
              isDeleting={this.state.isDeleting}
              // filterListings={this.filterListings}
              handleDeleteListing={this.executeCaptcha}
              deletingId={this.state.deletingId}
              onHide={this.handleCloseDeleteListing}
            />

            {this.state.listings.length === 0
              ? <NoEntriesMessage text="No listings to show" />
              : <div>
                {this.state.listings.map((l, i) => {
                  return (
                    <UnpublishedItem
                      key={i}
                      item={l}
                      isExpanded={this.state.expandedListings[l.id]}
                      isDeleting={this.state.isDeleting}
                      openLightbox={this.openLightbox}
                      openContactHostModal={this.openContactHostModal}
                      updateListingStatus={this.updateListingStatus}
                      handleOpenDeleteListingModal={this.handleOpenDeleteListingModal}
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
              pageSize={20}
              totalElements={this.state.totalElements}
            />
          </div>
        </section>


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

        <div className='captcha-container'>
          <ReCAPTCHA
            ref={el => this.captcha = el}
            size="invisible"
            sitekey={Config.getValue('recaptchaKey')}
            onChange={token => { this.handleDeleteListing(token); this.captcha.reset(); }}
          />
        </div>
      </div>
    );
  }
}

UnpublishedListings.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object
};

export default withRouter(UnpublishedListings);