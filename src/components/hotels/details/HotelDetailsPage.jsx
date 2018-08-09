import '../../../styles/css/main.css';
import '../../../styles/css/components/carousel-component.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { setRegion, setSearchInfo } from '../../../actions/searchInfo';

import { Config } from '../../../config';
import HotelDetailsInfoSection from './HotelDetailsInfoSection';
import HotelsSearchBar from '../search/HotelsSearchBar';
import Lightbox from 'react-images';
import { NotificationManager } from 'react-notifications';
import PropTypes from 'prop-types';
import { ROOMS_XML_CURRENCY } from '../../../constants/currencies.js';
import React from 'react';
import Slider from 'react-slick';
import { connect } from 'react-redux';
import moment from 'moment';
import { parse } from 'query-string';
import requester from '../../../initDependencies';
import { setCurrency } from '../../../actions/paymentInfo';
import { withRouter } from 'react-router-dom';

class HotelDetailsPage extends React.Component {
  constructor(props) {
    super(props);

    let startDate = moment().add(1, 'day');
    let endDate = moment().add(2, 'day');

    if (this.props) {
      let queryParams = parse(this.props.location.search);
      if (queryParams.startDate && queryParams.endDate) {
        startDate = moment(queryParams.startDate, 'DD/MM/YYYY');
        endDate = moment(queryParams.endDate, 'DD/MM/YYYY');
      }
    }

    this.state = {
      calendarStartDate: startDate,
      calendarEndDate: endDate,
      data: null,
      lightboxIsOpen: false,
      currentImage: 0,
      prices: null,
      oldCurrency: this.props.paymentInfo.currency,
      userInfo: null,
      loading: true,
      isShownContactHostModal: false,
      hotelRooms: null,
      loadingRooms: true,
    };

    this.handleApply = this.handleApply.bind(this);
    this.closeLightbox = this.closeLightbox.bind(this);
    this.gotoNext = this.gotoNext.bind(this);
    this.gotoPrevious = this.gotoPrevious.bind(this);
    this.gotoImage = this.gotoImage.bind(this);
    this.handleClickImage = this.handleClickImage.bind(this);
    this.openLightbox = this.openLightbox.bind(this);
    this.handleBookRoom = this.handleBookRoom.bind(this);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.redirectToSearchPage = this.redirectToSearchPage.bind(this);
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    const searchParams = this.getNewSearchParams();
    const search = this.getSearchParams();
    requester.getHotelById(id, searchParams).then(res => {
      res.body.then(data => {
        this.setState({ data: data, loading: false });
        const regionId = search.get('region') || (data.region && data.region.externalId);
        requester.getRegionNameById(regionId).then(res => {
          res.body.then(data => {
            this.props.dispatch(setRegion(data));
          });
        });
      });
    });

    requester.getHotelRooms(id, searchParams).then(res => {
      res.body.then(data => {
        this.setState({ hotelRooms: data, loadingRooms: false });
      });
    });

    this.getLocRate();
    requester.getCurrencyRates().then(res => {
      res.body.then(data => {
        this.setState({ rates: data });
      });
    });
  }

  componentWillMount() {
    if (this.props.location.search) {
      const searchParams = this.getSearchParams(this.props.location.search);
      const startDate = moment(searchParams.get('startDate'), 'DD/MM/YYYY');
      const endDate = moment(searchParams.get('endDate'), 'DD/MM/YYYY');
      const rooms = JSON.parse(decodeURI(searchParams.get('rooms')));
      const adults = this.getAdults(rooms);
      const hasChildren = this.getHasChildren(rooms);

      this.props.dispatch(setSearchInfo(startDate, endDate, this.props.searchInfo.region, rooms, adults, hasChildren));

      this.setState({
        nights: this.props.searchInfo.nights,
      });

    }
  }

  redirectToSearchPage(queryString) {
    this.props.history.push('/hotels/listings' + queryString);
  }

  getSearchParams() {
    const map = new Map();
    const pairs = this.props.location.search.substr(1).split('&');
    for (let i = 0; i < pairs.length; i++) {
      let pair = pairs[i].split('=');
      map.set(pair[0], this.parseParam(pair[1]));
    }

    return map;
  }

  getNewSearchParams() {
    const array = [];
    const pairs = this.props.location.search.substr(1).split('&');
    for(let i = 0; i < pairs.length; i++) {
      let pair = pairs[i];
      array.push(pair);
    }

    return array;
  }

  getAdults(rooms) {
    let adults = 0;
    for (let i = 0; i < rooms.length; i++) {
      adults += Number(rooms[i].adults);
    }
    return adults.toString();
  }

  getHasChildren(rooms) {
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].children.length !== 0) {
        return true;
      }
    }
    return false;
  }

  getLocRate() {
    requester.getLocRateByCurrency(ROOMS_XML_CURRENCY).then(res => {
      res.body.then(data => {
        this.setState({ locRate: Number(data[0][`price_${ROOMS_XML_CURRENCY.toLowerCase()}`]) });
      });
    });
  }

  updateParamsMap(key, value) {
    if (!value || value === '') {
      this.state.searchParams.delete(key);
    } else {
      this.state.searchParams.set(key, this.createParam(value));
    }
  }

  parseParam(param) {
    return param.split('%20').join(' ');
  }

  createParam(param) {
    return param.split(' ').join('%20');
  }

  handleApply(event, picker) {
    const { startDate, endDate } = picker;
    const prices = this.state.prices;
    const range = prices.filter(x => x.start >= startDate && x.end < endDate);
    const isInvalidRange = range.filter(x => !x.available).length > 0;
    if (isInvalidRange) {
      NotificationManager.warning('There is a unavailable day in your select range', 'Calendar Operations');
      this.setState({ calendarStartDate: undefined, calendarEndDate: undefined });
    }
    else {
      this.setState({
        calendarStartDate: startDate,
        calendarEndDate: endDate,
      });

      this.calculateNights(startDate, endDate);
    }
  }

  openLightbox(event, index) {
    event.preventDefault();
    this.setState({
      lightboxIsOpen: true,
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

  calculateNights(startDate, endDate) {
    let checkIn = moment(startDate, 'DD/MM/YYYY');
    let checkOut = moment(endDate, 'DD/MM/YYYY');

    let diffDays = checkOut.diff(checkIn, 'days');

    if (checkOut > checkIn) {
      return diffDays;
    }
    else {
      return 0;
    }
  }

  checkAvailability(quoteId) {
    const rooms = this.props.searchInfo.rooms.map((room) => {
      const adults = [];
      const children = room.children;
      for (let j = 0; j < room.adults; j++) {
        const adult = {
          title: 'Mr',
          firstName: null,
          lastName: null,
        };

        adults.push(adult);
      }

      return {
        adults: adults,
        children: children
      };
    });

    const currency = this.props.paymentInfo.currency;
    const booking = {
      quoteId: quoteId,
      rooms: rooms,
      currency: currency
    };

    const roomAvailability = new Map(this.state.roomAvailability);
    roomAvailability.set(quoteId, 'loading');
    this.setState({ roomAvailability: roomAvailability }, () => {
      requester.createReservation(booking).then(res => {
        const updatedRoomAvailability = new Map(this.state.roomAvailability);
        if (res.success) {
          updatedRoomAvailability.set(quoteId, true);
        } else {
          updatedRoomAvailability.set(quoteId, false);
        }

        this.setState({ roomAvailability: updatedRoomAvailability });
      });
    });
  }

  handleBookRoom(roomsResults) {
    this.setState({ loadingRooms: true });
    NotificationManager.info('Checking room availability...');
    const rooms = this.props.searchInfo.rooms.map((room) => {
      const adults = [];
      const children = room.children;
      for (let j = 0; j < room.adults; j++) {
        const adult = {
          title: 'Mr',
          firstName: null,
          lastName: null,
        };

        adults.push(adult);
      }

      return {
        adults: adults,
        children: children
      };
    });

    const currency = this.props.paymentInfo.currency;
    const booking = {
      rooms: rooms,
      currency: currency
    };

    const allRooms = [];
    for (let i = 0; i < roomsResults.length; i++) {
      for (let j = 0; j < roomsResults[i].length; j++) {
        allRooms.push({
          key: roomsResults[i][j].key,
          quoteId: roomsResults[i][j].quoteId,
          price: roomsResults[i][j].totalPrice,
        });
      }
    }

    try {
      this.checkNextRoom(allRooms, 0, booking);
    } catch (e) {
      NotificationManager.error('Something went wrong...');
    }
  }

  checkNextRoom(allRooms, index, booking) {
    const isWebView = this.props.location.pathname.indexOf('/mobile') !== -1;
    if (index >= allRooms.length) {
      NotificationManager.warning('Unfortunatelly all rooms in that hotel were already taken, please try another one.', '', 5000);
      const search = this.props.location.search;
      const rootURL = !isWebView ? '/hotels/listings' : '/mobile/search';
      const URL = `${rootURL}/${search}`;
      this.props.history.push(URL);
      return;
    }

    booking.quoteId = allRooms[index].quoteId;
    requester.createReservation(booking).then(res => {
      if (res.success) {
        if (index !== 0) {
          NotificationManager.info('The room that you requested is no longer available. You were given a similar room which may have slightly different price and extras.', '', 5000);
        }

        const id = this.props.match.params.id;
        const search = this.props.location.search;
        const rootURL = !isWebView ? '/hotels/listings/book' : '/mobile/book';
        const URL = `${rootURL}/${id}${search}&quoteId=${booking.quoteId}`;
        this.props.history.push(URL);
      } else {
        this.checkNextRoom(allRooms, index + 1, booking);
      }
    }).catch(() => {
      NotificationManager.error('Something went wrong...');
    });
  }

  next() {
    this.slider.slickNext();
  }
  previous() {
    this.slider.slickPrev();
  }

  render() {
    let loading, images;
    if (!this.state.data) {
      loading = true;
    } else {
      images = [];
      if (this.state.data.hotelPhotos) {
        images = this.state.data.hotelPhotos.map((image, index) => {
          return { src: Config.getValue('imgHost') + image.url, index: index };
        });
      }
    }

    if (images && images.length < 3) {
      while (images.length < 3) {
        images.push({ src: Config.getValue('imgHost') + '/listings/images/default.png' });
      }
    }

    const settings = {
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

    return (
      <div>
        <div className="container sm-none">
          <HotelsSearchBar redirectToSearchPage={this.redirectToSearchPage} />
        </div>
        {loading ?
          <div className="loader"></div> :
          <div>
            {images !== null && <Lightbox
              currentImage={this.state.currentImage}
              images={images}
              isOpen={this.state.lightboxIsOpen}
              onClickNext={this.gotoNext}
              onClickPrev={this.gotoPrevious}
              onClickThumbnail={this.gotoImage}
              onClose={this.closeLightbox}
            />}
            <div className='hotel-details-carousel'>
              <Slider
                ref={c => (this.slider = c)}
                {...settings}>
                {images && images.map((image, index) => {
                  return (
                    <div key={index} onClick={(e) => this.openLightbox(e, image.index)}>
                      <div className='slide' style={{ 'backgroundImage': 'url("' + image.src + '")' }}></div>
                    </div>
                  );
                })}
              </Slider>
            </div>
            <div className="main-carousel">
              <div className="carousel-nav">
                <button className="prev icon-arrow-left" onClick={this.previous}></button>
                <button className="next icon-arrow-right" onClick={this.next}></button>
              </div>
            </div>
            <nav id="hotel-nav">
              <div className="container">
                <ul className="nav navbar-nav">
                  <li>
                    <a href="#overview">Overview</a>
                  </li>
                  <li>
                    <a href="#facilities">Facilities</a>
                  </li>
                  {this.state.data.descriptionsAccessInfo &&
                    <li>
                      <a href="#reviews">Access Info</a>
                    </li>
                  }
                  {this.state.data.reviews && this.state.data.reviews.length > 0 &&
                    <li>
                      <a href="#reviews">Reviews</a>
                    </li>
                  }
                  <li>
                    <a href="#map">Location</a>
                  </li>
                </ul>

              </div>
            </nav>

            <section id="hotel-info">
              <div className="container">

                <HotelDetailsInfoSection
                  nights={this.state.nights}
                  onApply={this.handleApply}
                  startDate={this.state.calendarStartDate}
                  endDate={this.state.calendarEndDate}
                  data={this.state.data}
                  hotelRooms={this.state.hotelRooms}
                  locRate={this.state.locRate}
                  rates={this.state.rates}
                  loading={this.state.loading}
                  currencySign={this.props.paymentInfo.currencySign}
                  handleBookRoom={this.handleBookRoom}
                  checkAvailability={this.checkAvailability}
                  loadingRooms={this.state.loadingRooms}
                />
              </div>

              {/* MOBILE ONLY START */}
              {this.props.location.pathname.indexOf('/mobile') !== -1 &&
                <div className="container">
                  <button className="btn" style={{ 'width': '100%', 'marginBottom': '20px' }} onClick={(e) => this.props.history.goBack()}>Back</button>
                  <div className="select">
                    <select
                      className="currency"
                      value={this.props.paymentInfo.currency}
                      style={{ 'height': '40px', 'margin': '10px 0', 'textAlignLast': 'right', 'paddingRight': '45%', 'direction': 'rtl' }}
                      onChange={(e) => this.props.dispatch(setCurrency(e.target.value))}
                    >
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                </div>
              }
              {/* MOBILE ONLY END */}

            </section>
          </div>
        }
      </div>
    );
  }
}

HotelDetailsPage.propTypes = {
  match: PropTypes.object,

  // start Router props
  history: PropTypes.object,
  location: PropTypes.object,

  // start Redux props
  dispatch: PropTypes.func,
  userInfo: PropTypes.object,
  paymentInfo: PropTypes.object,
  searchInfo: PropTypes.object
};

function mapStateToProps(state) {
  const { userInfo, paymentInfo, modalsInfo, searchInfo } = state;
  return {
    userInfo,
    paymentInfo,
    modalsInfo,
    searchInfo
  };
}

export default withRouter(connect(mapStateToProps)(HotelDetailsPage));