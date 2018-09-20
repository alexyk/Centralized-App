import { Config } from '../../../config';
import HomeDetailsInfoSection from './HomeDetailsInfoSection';
import HomesSearchBar from '../search/HomesSearchBar';
import Lightbox from 'react-images';
import { NotificationManager } from 'react-notifications';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { parse } from 'query-string';
import requester from '../../../requester';
import { withRouter } from 'react-router-dom';
import Slider from 'react-slick';
import { INVALID_SEARCH_DATE } from '../../../constants/warningMessages.js';
import { LONG } from '../../../constants/notificationDisplayTimes.js';
import '../../../styles/css/components/carousel-component.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import $ from 'jquery';

class HomeDetailsPage extends React.Component {
  constructor(props) {
    super(props);

    let countryId = '';
    let guests = '';
    let startDate = moment();
    let endDate = moment().add(1, 'day');

    if (this.props) {
      let queryParams = parse(this.props.location.search);
      if (queryParams.guests) {
        guests = queryParams.guests;
      }
      if (queryParams.startDate && queryParams.endDate) {
        startDate = moment(queryParams.startDate, 'DD/MM/YYYY');
        endDate = moment(queryParams.endDate, 'DD/MM/YYYY');
      }
      if (queryParams.countryId) {
        countryId = queryParams.countryId;
      }
    }

    let nights = this.calculateNights(startDate, endDate);

    this.state = {
      countryId: countryId,
      searchStartDate: startDate,
      searchEndDate: endDate,
      calendarStartDate: startDate,
      calendarEndDate: endDate,
      nigths: nights,
      guests: guests,
      data: null,
      lightboxIsOpen: false,
      currentImage: 0,
      prices: null,
      oldCurrency: this.props.paymentInfo.currency,
      loaded: false,
      userInfo: null,
      loading: true,
      isShownContactHostModal: false
    };

    this.handleApply = this.handleApply.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleDatePick = this.handleDatePick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.closeLightbox = this.closeLightbox.bind(this);
    this.gotoNext = this.gotoNext.bind(this);
    this.gotoPrevious = this.gotoPrevious.bind(this);
    this.gotoImage = this.gotoImage.bind(this);
    this.handleClickImage = this.handleClickImage.bind(this);
    this.openLightbox = this.openLightbox.bind(this);
    this.initializeCalendar = this.initializeCalendar.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.sendMessageToHost = this.sendMessageToHost.bind(this);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ loading: true });
    this.getUserInfo();
  }

  componentDidMount() {
    this.initializeCalendar();

    const { searchStartDate, searchEndDate } = this.state;
    if (searchStartDate && searchEndDate) {
      this.calculateNights(searchStartDate, searchEndDate);
    }

    this.getUserInfo();
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    if (this.updateParamsMap) {
      this.updateParamsMap(e.target.name, e.target.value);
    }
  }

  handleSearch(e) {
    e.preventDefault();

    let queryString = '?';

    queryString += 'countryId=' + this.state.countryId;
    queryString += '&startDate=' + this.state.searchStartDate.format('DD/MM/YYYY');
    queryString += '&endDate=' + this.state.searchEndDate.format('DD/MM/YYYY');
    queryString += '&guests=' + this.state.guests;

    this.props.history.push('/homes/listings' + queryString);
  }

  getUserInfo() {
    if (localStorage.getItem(Config.getValue('domainPrefix') + '.auth.locktrip')) {
      requester.getUserInfo().then(res => {
        res.body.then(data => {
          this.setState({
            loaded: true,
            userInfo: data,
            loading: false
          });
        });
      });
    }
    else {
      this.setState({ loaded: true, loading: false });
    }
  }

  handleApply(event, picker) {
    const { startDate, endDate } = picker;
    const prices = this.state.prices;
    const range = prices.filter(x => x.start >= startDate && x.end < endDate);
    const isInvalidRange = range.filter(x => !x.available).length > 0;

    if (isInvalidRange) {
      NotificationManager.warning(INVALID_SEARCH_DATE, 'Calendar Operations', LONG);
    }
    else {
      this.setState({
        calendarStartDate: startDate,
        calendarEndDate: endDate,
      });

      this.calculateNights(startDate, endDate);
    }
  }

  handleDatePick(event, picker) {
    this.setState({
      searchStartDate: picker.startDate,
      searchEndDate: picker.endDate,
    });
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
      this.setState({ nights: diffDays });
    }
    else {
      this.setState({ nights: 0 });
    }
  }

  sendMessageToHost(id, message, captchaToken) {
    this.setState({ loading: true });
    let contactHostObj = {
      message: message
    };

    requester.contactHost(id, contactHostObj, captchaToken).then(res => {
      res.body.then(data => {
        this.props.history.push(`/profile/messages/chat/${data.conversation}`);
      });
    });
  }

  initializeCalendar() {
    let now = new Date();
    let end = new Date();
    const DAY_INTERVAL = 90;
    end.setUTCHours(now.getUTCHours() + 24 * DAY_INTERVAL);

    requester.getListing(this.props.match.params.id).then(res => {

      res.body.then(data => {
        this.setState({ data: data });
      });

      let searchTermMap = [];
      const startDateParam = `${now.getUTCDate()}/${now.getUTCMonth() + 1}/${now.getUTCFullYear()}`;
      const endDateParam = `${end.getUTCDate()}/${end.getUTCMonth() + 1}/${end.getUTCFullYear()}`;
      searchTermMap.push(
        `listing=${this.props.match.params.id}`,
        `startDate=${startDateParam}`,
        `endDate=${endDateParam}`,
        `page=${0}`,
        `toCode=${this.props.paymentInfo.currency}`,
        `size=${DAY_INTERVAL}`);


      requester.getCalendarByListingIdAndDateRange(searchTermMap).then(res => {
        res.body.then(data => {
          let prices = [];
          for (let dateInfo of data.content) {
            let price = dateInfo.available ? `${this.props.paymentInfo.currencySign}${Math.round(dateInfo.price)}` : '';
            prices.push(
              {
                'title': <span className="calendar-price bold">{price}</span>,
                'start': moment(dateInfo.date, 'DD/MM/YYYY'),
                'end': moment(dateInfo.date, 'DD/MM/YYYY'),
                'allDay': true,
                'price': dateInfo.price,
                'available': dateInfo.available
              }
            );
          }

          this.setState({ prices: prices, calendar: data.content, oldCurrency: this.props.paymentInfo.currency });
          // $(document).ready(() => {
          //   window.onscroll = function () { sticky() };

          //   let hotelNav = document.getElementById("hotel-nav");
          //   let stickyHotelNav = hotelNav.offsetTop;
            
          //   let bookingPanel = document.getElementById("test");
          //   let stickyBookingPanel = bookingPanel.offsetTop;

          //   let homeBox = document.getElementById("home-box");
          //   function sticky() {
          //     $('#hotel-nav').width($('#hotel-nav').width());
          //     if (window.pageYOffset >= stickyHotelNav) {
          //       hotelNav.classList.add("sticky-nav")
          //     } else {
          //       hotelNav.classList.remove("sticky-nav");
          //     }

          //     $('#test').width('100%');
          //     if (window.pageYOffset >= stickyHotelNav) {
          //       bookingPanel.classList.add("sticky")
          //     } else {
          //       bookingPanel.classList.remove("sticky");
          //     }
          //   }
          // });
        });
      });
    });
  }

  openModal() {
    this.setState({ isShownContactHostModal: true });
  }

  closeModal() {
    this.setState({ isShownContactHostModal: false });
  }

  next() {
    this.slider.slickNext();
  }
  previous() {
    this.slider.slickPrev();
  }

  render() {
    let loading, allEvents, images;

    if (this.state.data === null) {
      loading = true;
    } else {
      allEvents = this.state.prices;
      images = null;
      if (this.state.data.pictures !== undefined) {
        images = this.state.data.pictures.map(x => {
          return { src: Config.getValue('imgHost') + x.original };
        });
      }

      if (this.state.oldCurrency !== this.props.paymentInfo.currency) {
        this.initializeCalendar();
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
        <div>
          <div className="container">
            <HomesSearchBar
              countryId={this.state.countryId}
              countries={this.props.countries}
              startDate={this.state.searchStartDate}
              endDate={this.state.searchEndDate}
              guests={this.state.guests}
              onChange={this.onChange}
              handleSearch={this.handleSearch}
              handleDatePick={this.handleDatePick} />
          </div>
        </div>

        {loading ?
          <div className="loader"></div> :
          <div>
            <section className="hotel-gallery">
              {images !== null && <Lightbox
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
            </section>
            <nav className="hotel-nav" id="hotel-nav">
              <div className="hotel-nav-box">
                <div className="nav-box">
                  <ul className="nav navbar-nav">
                    <li><a href="#overview">Overview</a></li>
                    <li><a href="#facilities">Facilities</a></li>
                    {this.state.data.descriptionsAccessInfo &&
                      <li><a href="#reviews">Access Info</a></li>
                    }
                    {this.state.data.reviews && this.state.data.reviews.length > 0 &&
                      <li><a href="#reviews">User Reviews</a></li>
                    }
                    <li><a href="#map">Location</a></li>
                  </ul>
                </div>
                <div className="share-box">
                  <p><img src={`${Config.getValue("basePath")}/images/icon-share.png`} /> Share</p>
                  <p><img src={`${Config.getValue("basePath")}/images/icon-heart.png`} /> Save</p>
                </div>
                <div className="contact-box">
                  <button onClick={this.openModal}>Contact Host</button>
                </div>
              </div>
            </nav>

            <HomeDetailsInfoSection
              allEvents={allEvents}
              calendar={this.state.calendar}
              nights={this.state.nights}
              onApply={this.handleApply}
              startDate={this.state.calendarStartDate}
              endDate={this.state.calendarEndDate}
              data={this.state.data}
              prices={this.state.prices}
              isLogged={this.props.userInfo.isLogged}
              loading={this.state.loading}
              openModal={this.openModal}
              closeModal={this.closeModal}
              isShownContactHostModal={this.state.isShownContactHostModal}
              sendMessageToHost={this.sendMessageToHost} />
          </div>
        }
      </div>
    );
  }
}

HomeDetailsPage.propTypes = {
  countries: PropTypes.array,
  match: PropTypes.object,

  // start Router props
  history: PropTypes.object,
  location: PropTypes.object,

  // start Redux props
  dispatch: PropTypes.func,
  userInfo: PropTypes.object,
  paymentInfo: PropTypes.object
};

function mapStateToProps(state) {
  const { userInfo, paymentInfo } = state;
  return {
    userInfo,
    paymentInfo
  };
}

export default withRouter(connect(mapStateToProps)(HomeDetailsPage));
