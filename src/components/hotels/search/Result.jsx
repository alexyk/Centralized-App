import '../../../styles/css/components/search-result-component.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../../styles/css/components/hotels_search/result/results_holder__hotels.css';

import { Link, withRouter } from 'react-router-dom';

import { Config } from '../../../config';
import { CurrencyConverter } from '../../../services/utilities/currencyConverter';
import { RoomsXMLCurrency } from '../../../services/utilities/roomsXMLCurrency';
import PropTypes from 'prop-types';
import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import Slider from 'react-slick';
import StringUtils from '../../../services/utilities/stringUtilities';
import _ from 'lodash';
import { connect } from 'react-redux';

const SCREEN_SIZE_SMALL = 'SMALL';
const SCREEN_SIZE_MEDIUM = 'MEDIUM';
const SCREEN_SIZE_LARGE = 'LARGE';
const DEFAULT_CRYPTO_CURRENCY = 'EUR';

const BREAKPOINTS = {
  SMALL: 370,
  MEDIUM: 768,
  LARGE: 2160
};

const DESCRIPTION_LENGTH = {
  SMALL: 50,
  MEDIUM: 100,
  LARGE: 500,
};

const TITLE_LENGTH = {
  SMALL: 20,
  MEDIUM: 40,
  LARGE: 200,
};

class Result extends React.Component {
  constructor(props) {
    super(props);

    const screenWidth = window.innerWidth;
    const screenSize = this.getScreenSize(screenWidth);

    this.state = {
      screenWidth: screenWidth,
      titleLength: this.getTitleLength(screenSize),
      descriptionLength: this.getDescriptionLength(screenSize),
    };

    this.updateWindowDimensions = _.debounce(this.updateWindowDimensions.bind(this), 500);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    const width = window.innerWidth;
    const screenSize = this.getScreenSize(width);
    const titleLength = this.getTitleLength(screenSize);
    const descriptionLength = this.getDescriptionLength(screenSize);
    this.setState({ screenWidth: window.innerWidth, titleLength, descriptionLength });
  }

  getScreenSize(screenWidth) {
    if (screenWidth < BREAKPOINTS.SMALL) {
      return SCREEN_SIZE_SMALL;
    } else if (screenWidth < BREAKPOINTS.MEDIUM) {
      return SCREEN_SIZE_MEDIUM;
    } else {
      return SCREEN_SIZE_LARGE;
    }
  }

  getDescriptionLength(screenSize) {
    return DESCRIPTION_LENGTH[screenSize];
  }

  getTitleLength(screenSize) {
    return TITLE_LENGTH[screenSize];
  }

  calculateStars(ratingNumber) {
    let starsElements = [];
    let rating = Math.round(ratingNumber);
    for (let i = 0; i < rating; i++) {
      starsElements.push(<span key={i} className="full-star"></span>);
    }

    return starsElements;
  }

  render() {
    let { id, name, generalDescription, hotelPhoto, star } = this.props.hotel;
    let { price } = this.props;
    const photoUrl = hotelPhoto && hotelPhoto.url ? hotelPhoto.url : hotelPhoto;
    const pictures = photoUrl ? [{ thumbnail: `${Config.getValue('imgHost')}${photoUrl}` }, { thumbnail: `${Config.getValue('imgHost')}${photoUrl}` }] : [];
    const { locRate, rates } = this.props;
    const { currencySign } = this.props.paymentInfo;
    const isPriceLoaded = !!price;
    const priceInEUR = rates && ((CurrencyConverter.convert(rates, RoomsXMLCurrency.get(), DEFAULT_CRYPTO_CURRENCY, price)) / this.props.nights).toFixed(2);
    let locPrice = locRate !== 0 && (priceInEUR / locRate).toFixed(2);
    const priceInSelectedCurrency = rates && ((CurrencyConverter.convert(rates, RoomsXMLCurrency.get(), this.props.paymentInfo.currency, price)) / this.props.nights).toFixed(2);

    name = name && StringUtils.shorten(name, this.state.titleLength);
    generalDescription = generalDescription && StringUtils.shorten(generalDescription, this.state.descriptionLength);

    if (pictures && pictures.length < 1) {
      pictures.push({ thumbnail: `${Config.getValue('imgHost')}/listings/images/default.png` });
    }

    const SlickButton = ({ currentSlide, slideCount, ...props }) => (
      <button {...props} />
    );

    const settings = {
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      nextArrow: <SlickButton />,
      prevArrow: <SlickButton />
    };

    const redirectURL = this.props.location.pathname.indexOf('mobile') === -1
      ? '/hotels/listings'
      : '/mobile/details';

    const search = this.props.location.search;
    const endOfSearch = search.indexOf('&filters=') !== -1 ? search.indexOf('&filters=') : search.length;

    return (
      <div className="result" >
        <div className="result-images">
          {pictures &&
            <Slider
              {...settings}>
              {pictures.map((picture, i) => {
                return (
                  <div key={i}>
                    <Link to={`${redirectURL}/${id}${search.substr(0, endOfSearch)}`} key={i}>
                      <div style={{ backgroundImage: 'url(' + picture.thumbnail + ')' }}>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </Slider>
          }
        </div>
        <div className="result-content">
          <div>
            <h4><Link to={`${redirectURL}/${id}${search.substr(0, endOfSearch)}`}>{name}</Link></h4>
            <div className="rating">
              <span>Rating: </span>
              <div className="rating-holder">
                {this.calculateStars(star)}
              </div>
            </div>
          </div>
          <div className="result-description">{generalDescription && ReactHtmlParser(generalDescription)}</div>
          <div className="result-mobile-pricing">
            {!isPriceLoaded
              ? (!this.props.allElements ? <div className="price">Loading price...</div> : <div></div>)
              : <div className="price">{this.props.userInfo.isLogged && `${currencySign} ${priceInSelectedCurrency}`}</div>
            }
            {isPriceLoaded && <div className="price">1 night: LOC {locPrice}</div>}
            <div>
              {!isPriceLoaded && this.props.allElements
                ? <button disabled className="mobile-pricing-button">Unavailable</button>
                : <Link className="mobile-pricing-button" to={`${redirectURL}/${id}${search.substr(0, endOfSearch)}`}>Book now</Link>
              }
            </div>
          </div>
        </div>

        <div className="result-pricing">
          <div className="price-for">Price for 1 night</div>
          {!isPriceLoaded
            ? (!this.props.allElements ? <div className="loader" style={{ width: '100%' }}></div> : <span style={{ padding: '20px 10px 10px 10px' }}>Unavailable</span>)
            : <span className="price">{this.props.userInfo.isLogged && `${currencySign} ${priceInSelectedCurrency}`}</span>
          }
          {isPriceLoaded && <span>(LOC {locPrice})</span>}
          {!isPriceLoaded && this.props.allElements
            ? <button disabled className="btn">Unavailable</button>
            : <Link className="btn" to={`${redirectURL}/${id}${search.substr(0, endOfSearch)}`}>Book now</Link>
          }
        </div>
      </div>
    );
  }
}

Result.propTypes = {
  hotel: PropTypes.object,
  nights: PropTypes.number,
  locRate: PropTypes.number,
  rates: PropTypes.any,
  price: PropTypes.any,

  // Router props
  location: PropTypes.object,

  // Redux props
  paymentInfo: PropTypes.object,
  userInfo: PropTypes.object
};

function mapStateToProps(state) {
  const { paymentInfo, userInfo } = state;
  return {
    paymentInfo,
    userInfo
  };
}

export default withRouter(connect(mapStateToProps)(Result));
