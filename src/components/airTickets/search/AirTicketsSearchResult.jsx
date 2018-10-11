import '../../../styles/css/components/search-result-component.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../../styles/css/components/hotels_search/result/results_holder__hotels.css';

import { Link, withRouter } from 'react-router-dom';

import { Config } from '../../../config';
import { CurrencyConverter } from '../../../services/utilities/currencyConverter';
import PropTypes from 'prop-types';
import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import { RoomsXMLCurrency } from '../../../services/utilities/roomsXMLCurrency';
import Slider from 'react-slick';
import StringUtils from '../../../services/utilities/stringUtilities';
import _ from 'lodash';
import HotelItemRatingBox from '../../common/hotel/HotelItemRatingBox';
import requester from '../../../requester';
import LocPrice from '../../common/utility/LocPrice';

const SCREEN_SIZE_SMALL = 'SMALL';
const SCREEN_SIZE_MEDIUM = 'MEDIUM';
const SCREEN_SIZE_LARGE = 'LARGE';

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

class AirTicketsSearchResult extends React.Component {
  constructor(props) {
    super(props);

    const screenWidth = window.innerWidth;
    const screenSize = this.getScreenSize(screenWidth);
    const photoUrl = this.props.result.hotelPhoto && this.props.result.hotelPhoto.url ? this.props.result.hotelPhoto.url : this.props.result.hotelPhoto;

    this.state = {
      screenWidth: screenWidth,
      titleLength: this.getTitleLength(screenSize),
      descriptionLength: this.getDescriptionLength(screenSize),
      pictures: photoUrl ? [{ url: photoUrl }, { url: photoUrl }] : [],
      loadedPictures: true
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

  render() {
    const { exchangeRatesInfo, paymentInfo, userInfo, price, result, allElements } = this.props;
    let { id, name, generalDescription, star } = result;

    const isPriceLoaded = !!price;
    const priceForLoc = exchangeRatesInfo.currencyExchangeRates && (CurrencyConverter.convert(exchangeRatesInfo.currencyExchangeRates, result.pricesInfo.currency, RoomsXMLCurrency.get(), price)).toFixed(2);
    const priceInSelectedCurrency = exchangeRatesInfo.currencyExchangeRates && (CurrencyConverter.convert(exchangeRatesInfo.currencyExchangeRates, result.pricesInfo.currency, paymentInfo.currency, price)).toFixed(2);

    name = name && StringUtils.shorten(name, this.state.titleLength);
    generalDescription = generalDescription && StringUtils.shorten(generalDescription, this.state.descriptionLength);

    if (this.state.pictures && this.state.pictures.length < 1) {
      this.state.pictures.push({ thumbnail: `${Config.getValue('imgHost')}/listings/images/default.png` });
    }

    const SlickButtonLoad = ({ currentSlide, slideCount, ...props }) => (
      <button {...props} onClick={() => {
        this.setState({ loadedPictures: false });
        requester.getHotelPictures(result.id).then(res => {
          res.body.then(data => {
            let images = _.orderBy(data, ['url'], ['asc']);
            images.push(images.shift());
            this.setState({ pictures: images, loadedPictures: true, calledBackendForAllImages: true }, () => {
              props.onClick();
            });
          });
        });
      }} />
    );

    const SlickButton = ({ currentSlide, slideCount, ...props }) => (
      <button {...props} />
    );

    const settings = {
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      slidesToScroll: 1,
      nextArrow: this.state.calledBackendForAllImages === true ? <SlickButton /> : <SlickButtonLoad />,
      prevArrow: this.state.calledBackendForAllImages === true ? <SlickButton /> : <SlickButtonLoad />,
      beforeChange: (current, next) => {
        // console.log(event, slick);
        if (!this.state.calledBackendForAllImages) {
          this.setState({ loadedPictures: false });
          requester.getHotelPictures(result.id).then(res => {
            res.body.then(data => {
              let images = _.orderBy(data, ['url'], ['asc']);
              images.push(images.shift());
              this.setState({ pictures: images, loadedPictures: true, calledBackendForAllImages: true }, () => {
              });
            });
          });
        }
      }
    };

    const isMobile = this.props.location.pathname.indexOf('mobile') !== -1;

    const redirectURL = this.props.location.pathname.indexOf('mobile') === -1
      ? '/hotels/listings'
      : '/mobile/details';

    const search = this.props.location.search;
    const endOfSearch = search.indexOf('&filters=') !== -1 ? search.indexOf('&filters=') : search.length;

    return (
      <div className="result" >
        <div className="result-images">
          {this.state.pictures && this.state.loadedPictures === true ?
            <Slider
              ref={c => (this.slider = c)}
              {...settings}>
              {this.state.pictures.map((picture, i) => {
                return (
                  <div key={i}>
                    <Link target={isMobile === false ? '_blank' : '_self'} to={`${redirectURL}/${id}${search.substr(0, endOfSearch)}`} key={i}>
                      <div style={{ backgroundImage: 'url(' + Config.getValue('imgHost') + picture.url + ')' }}>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </Slider> : <div style={{ width: '240px' }} />
          }
        </div>
        <div className="result-content">
          <div>
            <h4><Link target={isMobile === false ? '_blank' : '_self'} to={`${redirectURL}/${id}${search.substr(0, endOfSearch)}`}>{name}</Link></h4>
            <HotelItemRatingBox rating={star} />
          </div>
          <div className="result-description">{generalDescription && ReactHtmlParser(generalDescription)}</div>
          <div className="result-mobile-pricing">
            {!isPriceLoaded
              ? (!allElements ? <div className="price">Loading price...</div> : <div></div>)
              : <div className="price">{userInfo.isLogged && `${paymentInfo.currencySign} ${priceInSelectedCurrency}`}</div>
            }
            {isPriceLoaded && <div className="price">Total price: <LocPrice fiat={priceForLoc} /></div>}
            <div>
              {!isPriceLoaded && allElements
                ? <button disabled className="mobile-pricing-button">Unavailable</button>
                : <Link target={isMobile === false ? '_blank' : '_self'} className="mobile-pricing-button" to={`${redirectURL}/${id}${search.substr(0, endOfSearch)}`}>Book now</Link>
              }
            </div>
          </div>
        </div>

        <div className="result-pricing">
          <div className="price-for">
            <div>Price for 1 adult</div>
            {result.routing === 1 ? <div>one way</div> : <div>round trip</div>}
          </div>
          {!isPriceLoaded
            ? (!allElements ? <div className="loader" style={{ width: '100%' }}></div> : <span style={{ padding: '20px 10px 10px 10px' }}>Unavailable</span>)
            : <span className="price">{userInfo.isLogged && priceInSelectedCurrency && `${paymentInfo.currencySign} ${priceInSelectedCurrency}`}</span>
          }
          {isPriceLoaded && <LocPrice fiat={priceForLoc} />}
          {!isPriceLoaded && allElements
            ? <button disabled className="btn">Unavailable</button>
            : <Link target={isMobile === false ? '_blank' : '_self'} className="btn" to={`${redirectURL}/${id}${search.substr(0, endOfSearch)}`}>Book now</Link>
          }
        </div>
      </div>
    );
  }
}

AirTicketsSearchResult.propTypes = {
  result: PropTypes.object,
  price: PropTypes.any,
  allElements: PropTypes.bool,
  exchangeRatesInfo: PropTypes.object,
  paymentInfo: PropTypes.object,
  userInfo: PropTypes.object,

  // Router props
  location: PropTypes.object,
};

export default withRouter(AirTicketsSearchResult);
