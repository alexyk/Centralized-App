import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Lightbox from 'react-images';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import { parse } from 'query-string';
import { Config } from '../../../config';
import requester from '../../../requester';
import SlickCarousel from 'react-slick';
import '../../../styles/css/components/carousel-component.css';
import HomesSearchBar from '../search/HomesSearchBar';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ContactHostModal from '../../common/modals/ContactHostModal';
import {
  openLightbox,
  closeLightbox,
  gotoNext,
  gotoPrevious,
  gotoImage,
  handleClickImage,
  next,
  previous,
  calculateCheckInOuts
} from '../common/detailsPageUtils.js';
import { setHomesSearchInfo } from '../../../actions/homesSearchInfo';
import { asyncSetStartDate, asyncSetEndDate } from '../../../actions/searchDatesInfo';
import { DEFAULT_LISTING_IMAGE_URL } from '../../../constants/images';
import '../../../styles/css/components/home/details/home-details-info-section.css';
import Facilities from '../../hotels/details/Facilities';

import HomeDetailsBookingPanel from './HomeDetailsBookingPanel';
import RoomSpaceInformationBox from '../common/RoomSpaceInformationBox';
import RoomAccommodationBox from '../common/RoomAccommodationBox';
import HomeDetailsRatingBox from './HomeDetailsRatingBox';
import HomeDetailsReviewBox from './HomeDetailsReviewBox';
import MyMapComponent from './MyMapComponent';

import '../../../styles/css/components/carousel-component.css';
import Loader from '../../common/loader';

const CAROUSEL_SETTINGS = {
  infinite: true,
  accessibility: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 1,
      }
    }
  ]
};

class HomeDetailsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      listing: null,
      roomDetails: null,
      lightboxIsOpen: false,
      currentImage: 0,
      nights: 0,
      isShownContactHostModal: false
    };

    this.search = this.search.bind(this);

    this.closeLightbox = closeLightbox.bind(this);
    this.gotoNext = gotoNext.bind(this);
    this.gotoPrevious = gotoPrevious.bind(this);
    this.gotoImage = gotoImage.bind(this);
    this.handleClickImage = handleClickImage.bind(this);
    this.openLightbox = openLightbox.bind(this);

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.sendMessageToHost = this.sendMessageToHost.bind(this);

    this.next = next.bind(this);
    this.previous = previous.bind(this);

    this.calculateCheckInOuts = calculateCheckInOuts.bind(this);
  }

  componentDidMount() {
    this.setHomesSearchInfoFromURL();

    const DAY_INTERVAL = 365;

    requester.getListing(this.props.match.params.id).then(res => {
      res.body.then(listing => {
        const checks = this.calculateCheckInOuts(listing);
        this.setState({ listing, checks });
      });
    });

    const calendarByListingRequestParams = [
      `listing=${this.props.match.params.id}`,
      `startDate=${moment().format('DD/MM/YYYY')}`,
      `endDate=${moment().add(DAY_INTERVAL, 'days').format('DD/MM/YYYY')}`,
      `page=${0}`,
      `toCode=${this.props.paymentInfo.currency}`,
      `size=${DAY_INTERVAL}`];

    requester.getCalendarByListingIdAndDateRange(calendarByListingRequestParams).then(res => {
      res.body.then(data => {
        let calendar = data.content;
        calendar = _.sortBy(calendar, function (x) {
          return moment(x.date, 'DD/MM/YYYY');
        });
        this.setState({ calendar });
      });
    });

    requester.getHomeBookingDetails(this.props.match.params.id).then(res => res.body).then(roomDetails => {
      this.setState({ roomDetails });
    });
  }

  setHomesSearchInfoFromURL() {
    if (this.props.location.search) {
      const searchParams = parse(this.props.location.search);
      const country = searchParams.countryId;
      const startDate = moment(searchParams.startDate, 'DD/MM/YYYY');
      const endDate = moment(searchParams.endDate, 'DD/MM/YYYY');
      const guests = searchParams.guests;

      this.props.dispatch(asyncSetStartDate(startDate));
      this.props.dispatch(asyncSetEndDate(endDate));
      this.props.dispatch(setHomesSearchInfo(country, guests));
    }
  }

  search(queryString) {
    this.props.history.push('/homes/listings' + queryString);
  }

  sendMessageToHost(id, message, captchaToken) {
    let contactHostObj = {
      message: message
    };

    requester.contactHost(id, contactHostObj, captchaToken).then(res => {
      res.body.then(data => {
        this.props.history.push(`/profile/messages/chat/${data.conversation}`);
      });
    });
  }

  openModal() {
    this.setState({ isShownContactHostModal: true });
  }

  closeModal() {
    this.setState({ isShownContactHostModal: false });
  }

  getValidPictures(pictures) {
    if (!pictures) {
      pictures = [];
    }

    while (pictures.length < 3) {
      pictures.push({ thumbnail: DEFAULT_LISTING_IMAGE_URL });
    }

    return pictures.map(picture => ({
      src: Config.getValue('imgHost') + picture.thumbnail
    }));
  }

  getExcludedDates(calendar) {
    return calendar
      .filter(item => item.available === false)
      .map(item => moment(item.date, 'DD/MM/YYYY'));
  }

  render() {

    if (!this.state.listing || !this.state.calendar) {
      return (
        <Loader minHeight={'50vh'} />
      );
    }

    const images = this.state.listing.pictures && this.getValidPictures(this.state.listing.pictures);
    const { 
      property_type,
      guests,
      size,
      bathroom,
      bedrooms,
      eventsAllowed,
      smokingAllowed,
      suitableForPets,
      suitableForInfants,
      house_rules } = this.state.roomDetails;

    const { 
      averageRating,
      city,
      country,
      amenities,
      name,
      descriptionText,
      reviews,
      latitude,
      currencyCode,
      cleaningFee,
      longitude } = this.state.listing;

    const hasSpaceDetails = property_type || guests || size || bathroom || bedrooms;
    const hasHouseRules = eventsAllowed || smokingAllowed || suitableForPets || suitableForInfants || house_rules;
    const houseRules = house_rules && house_rules.split('\r\n');

    const { roomDetails, checks, calendar } = this.state;
    const { startDate, endDate } = this.props.searchDatesInfo;

    const guestArray = [];
    if (guests) {
      for (let i = 1; i <= guests; i++) {
        guestArray.push(i);
      }
    } else {
      for (let i = 1; i <= 10; i++) {
        guestArray.push(i);
      }
    }

    return (
      <React.Fragment>
        <div className="container">
          <HomesSearchBar search={this.search} />
        </div>
        <ContactHostModal
          id={this.props.match.params.id}
          isActive={this.state.isShownContactHostModal}
          closeModal={this.closeModal}
          handleContactHost={this.sendMessageToHost} />

        <div className="home-details-container">
          <section className="hotel-gallery">
            {images && <Lightbox
              currentImage={this.state.currentImage}
              images={images}
              isOpen={this.state.lightboxIsOpen}
              onClickImage={this.handleClickImage}
              onClickNext={this.gotoNext}
              onClickPrev={this.gotoPrevious}
              onClickThumbnail={this.gotoImage}
              onClose={this.closeLightbox}
            />}
            <div className='hotel-details-carousel'>
              <SlickCarousel
                ref={c => (this.slider = c)}
                {...CAROUSEL_SETTINGS}>
                {images && images.map((image, index) => {
                  return (
                    <div key={index} onClick={(e) => this.openLightbox(e, image.index)}>
                      <div className='slide' style={{ 'backgroundImage': 'url("' + image.src + '")' }}></div>
                    </div>
                  );
                })}
              </SlickCarousel>
            </div>
            <div className="main-carousel">
              <div className="carousel-nav">
                <button className="prev icon-arrow-left" onClick={this.previous}></button>
                <button className="next icon-arrow-right" onClick={this.next}></button>
              </div>
            </div>
          </section>
          <nav className="hotel-nav" id="hotel-nav">
            <div className="hotel-nav-box">
              <div className="nav-box">
                <ul className="nav navbar-nav">
                  <li><a href="#overview">Overview</a></li>
                  <li><a href="#facilities">Facilities</a></li>
                  {reviews && reviews.length > 0 &&
                    <li><a href="#reviews">User Reviews</a></li>
                  }
                  <li><a href="#location">Location</a></li>
                </ul>
              </div>
              <div className="share-box">
                <p><img alt="share" src={`${Config.getValue('basePath')}/images/icon-share.png`} /> Share</p>
                <p><img alt="save" src={`${Config.getValue('basePath')}/images/icon-heart.png`} /> Save</p>
              </div>
              <div className="contact-box">
                <button onClick={this.openModal}>Contact Host</button>
              </div>
            </div>
          </nav>

          {(!roomDetails || !checks)
            ? <div className="loader"></div>
            : <section className="home-container">
              <div className="home-box" id="home-box">
                <div className="home-content" id="overview">
                  <p className="location">{city.name} &bull; {country.name}</p>
                  <h1>{name}</h1>
                  {averageRating > 0 && <HomeDetailsRatingBox rating={averageRating} reviewsCount={0} />}

                  {hasSpaceDetails &&
                    <RoomSpaceInformationBox
                      property_type={property_type}
                      guests={guests}
                      size={size}
                      bathroom={bathroom}
                      bedrooms={bedrooms} />
                  }

                  <div className="list-hotel-description">
                    <h2>Description</h2>
                    <hr />
                    {descriptionText}
                  </div>

                  <Facilities facilities={amenities} />

                  {hasHouseRules &&
                    <div className="hotel-rules-container">
                      <h2>House Rules</h2>
                      <hr />
                      {eventsAllowed && <p>Events allowed</p>}
                      {smokingAllowed && <p>Smoking allowed</p>}
                      {suitableForInfants && <p>Suitable for infants</p>}
                      {suitableForPets && <p>Suitable for pets</p>}
                      {houseRules && houseRules.map((rule, index) => {
                        return (<p key={index}>{rule}</p>);
                      })}
                    </div>
                  }

                  <RoomAccommodationBox
                    checkInStart={checks.checkInStart}
                    checkInEnd={checks.checkInEnd}
                    checkOutStart={checks.checkOutStart}
                    checkOutEnd={checks.checkOutEnd} />

                  {reviews && reviews.length > 0 &&
                    <div id="reviews">
                      <h2>User Rating &amp; Reviews</h2>
                      {reviews.map((item, i) => {
                        return (
                          <HomeDetailsReviewBox
                            key={i}
                            rating={item.average}
                            reviewText={item.comments}
                          />
                        );
                      })}
                      <hr />
                    </div>
                  }

                  <div id="location">
                    <h2>Location</h2>
                    <hr />
                    <MyMapComponent key="map" latitude={latitude} longitude={longitude} />
                  </div>
                </div>

                <HomeDetailsBookingPanel
                  startDate={startDate}
                  endDate={endDate}
                  calendar={calendar}
                  guestArray={guestArray}
                  cleaningFee={cleaningFee}
                  currencyCode={currencyCode}
                />
              </div>
            </section>
          }
        </div>
      </React.Fragment>
    );
  }
}

HomeDetailsPage.propTypes = {
  match: PropTypes.object,

  // start Router props
  history: PropTypes.object,
  location: PropTypes.object,

  // start Redux props
  dispatch: PropTypes.func,
  userInfo: PropTypes.object,
  paymentInfo: PropTypes.object,
  searchDatesInfo: PropTypes.object
};

function mapStateToProps(state) {
  const { userInfo, paymentInfo, searchDatesInfo } = state;
  return {
    userInfo,
    paymentInfo,
    searchDatesInfo
  };
}

export default withRouter(connect(mapStateToProps)(HomeDetailsPage));
