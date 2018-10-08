import { Config } from '../../../config';
import HomeDetailsInfoSection from './HomeDetailsInfoSection';
import HomesSearchBar from '../search/HomesSearchBar';
import Lightbox from 'react-images';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { parse } from 'query-string';
import requester from '../../../requester';
import { withRouter } from 'react-router-dom';
import Slider from 'react-slick';
import '../../../styles/css/components/carousel-component.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ContactHostModal from '../../common/modals/ContactHostModal';
import _ from 'lodash';
import {
  openLightbox,
  closeLightbox,
  gotoNext,
  gotoPrevious,
  gotoImage,
  handleClickImage,
  next,
  previous,
  setCheckInOutHours,
  calculateCheckInOuts
} from '../common/detailsPageUtils.js';

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

    this.state = {
      countryId: countryId,
      searchStartDate: startDate,
      searchEndDate: endDate,
      guests: guests,

      calendarStartDate: startDate,
      calendarEndDate: endDate,

      data: null,

      lightboxIsOpen: false,
      currentImage: 0,
      nights: 0,

      isShownContactHostModal: false
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.handleDatePick = this.handleDatePick.bind(this);
    this.onChange = this.onChange.bind(this);

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

    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleChangeEnd = this.handleChangeEnd.bind(this);

    this.setCheckInOutHours = setCheckInOutHours.bind(this);
    this.calculateCheckInOuts = calculateCheckInOuts.bind(this);
  }

  componentDidMount() {
    const DAY_INTERVAL = 365;

    requester.getListing(this.props.match.params.id).then(res => {
      res.body.then(listing => {
        const checks = this.calculateCheckInOuts(listing);
        this.setState({ data: listing, checks });
      });
    });

    const searchTermMap = [
      `listing=${this.props.match.params.id}`,
      `startDate=${moment().format('DD/MM/YYYY')}`,
      `endDate=${moment().add(DAY_INTERVAL, 'days').format('DD/MM/YYYY')}`,
      `page=${0}`,
      `toCode=${this.props.paymentInfo.currency}`,
      `size=${DAY_INTERVAL}`];

    requester.getCalendarByListingIdAndDateRange(searchTermMap).then(res => {
      res.body.then(data => {
        let calendar = data.content;
        calendar = _.sortBy(calendar, function (x) {
          return new moment(x.date, 'DD/MM/YYYY');
        });
        this.setState({ calendar: calendar });
      });
    });

    requester.getHomeBookingDetails(this.props.match.params.id).then(res => res.body).then(roomDetails => {
      this.setState({ roomDetails });
    });

    const { calendarStartDate, calendarEndDate } = this.state;
    if (calendarStartDate && calendarEndDate) {
      this.calculateNights(calendarStartDate, calendarEndDate);
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
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

  handleDatePick(event, picker) {
    this.setState({
      searchStartDate: picker.startDate,
      searchEndDate: picker.endDate,
    });
  }

  calculateNights(startDate, endDate) {
    let diffDays = endDate.startOf('day').diff(startDate.startOf('day'), 'days');

    if (endDate > startDate) {
      this.setState({ nights: diffDays });
    }
    else {
      this.setState({ nights: 0 });
    }
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

  handleChangeStart(date) {
    this.setState({
      calendarStartDate: date,
      calendarEndDate: date
    });
    this.calculateNights(date, date);
  }

  handleChangeEnd(date) {
    if (this.state.calendarStartDate.isAfter(date)) {
      this.handleChangeStart(date);
    }
    else {
      this.setState({
        calendarEndDate: date
      });
      this.calculateNights(this.state.calendarStartDate, date);
    }
  }

  render() {
    let loading, images;

    if (this.state.data === null || this.state.calendar === null) {
      loading = true;
    } else {
      if (this.state.data.pictures !== undefined) {
        images = this.state.data.pictures.map((x, index) => {
          return { src: Config.getValue('imgHost') + x.thumbnail, index };
        });
      }
    }


    while (images && images.length < 3) {
      images.push(images[0]);
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
        <ContactHostModal
          id={this.props.match.params.id}
          isActive={this.state.isShownContactHostModal}
          closeModal={this.closeModal}
          handleContactHost={this.sendMessageToHost} />

        {loading ?
          <div className="loader"></div> :
          <div className="home-details-container">
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
                    {this.state.data.reviews && this.state.data.reviews.length > 0 &&
                      <li><a href="#reviews">User Reviews</a></li>
                    }
                    <li><a href="#location">Location</a></li>
                  </ul>
                </div>
                <div className="share-box">
                  <p><img alt="share" src={`${Config.getValue("basePath")}/images/icon-share.png`} /> Share</p>
                  <p><img alt="save" src={`${Config.getValue("basePath")}/images/icon-heart.png`} /> Save</p>
                </div>
                <div className="contact-box">
                  <button onClick={this.openModal}>Contact Host</button>
                </div>
              </div>
            </nav>

            <HomeDetailsInfoSection
              calendar={this.state.calendar}
              startDate={this.state.calendarStartDate}
              endDate={this.state.calendarEndDate}
              data={this.state.data}
              isLogged={this.props.userInfo.isLogged}
              openModal={this.openModal}
              roomDetails={this.state.roomDetails}
              nights={this.state.nights}
              checks={this.state.checks}
              handleChangeStart={this.handleChangeStart}
              handleChangeEnd={this.handleChangeEnd} />
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
