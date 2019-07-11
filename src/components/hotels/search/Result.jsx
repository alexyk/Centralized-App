import '../../../styles/css/components/search-result-component.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../../styles/css/components/hotels_search/result/results_holder__hotels.css';

import {Link, withRouter} from 'react-router-dom';

import {Config} from '../../../config';
import {CurrencyConverter} from '../../../services/utilities/currencyConverter';
import PropTypes from 'prop-types';
import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import {RoomsXMLCurrency} from '../../../services/utilities/roomsXMLCurrency';
import Slider from 'react-slick';
import StringUtils from '../../../services/utilities/stringUtilities';
import _ from 'lodash';
import {connect} from 'react-redux';
import requester from '../../../requester';
import LocPrice from '../../common/utility/LocPrice';
import Rating from '../../common/rating';
import {DEFAULT_LISTING_IMAGE_URL} from '../../../constants/images';
import {isLogged} from '../../../selectors/userInfo';
import {getCurrency, getCurrencySign} from '../../../selectors/paymentInfo';
import {getCurrencyExchangeRates} from '../../../selectors/exchangeRatesInfo';

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
  LARGE: 200,
};

const TITLE_LENGTH = {
  SMALL: 20,
  MEDIUM: 40,
  LARGE: 100,
};

class Result extends React.Component {
  constructor(props) {
    super(props);

    const screenWidth = window.innerWidth;
    const screenSize = this.getScreenSize(screenWidth);
    const {hotel} = this.props;
    const photoUrl = hotel.hotelPhoto && hotel.hotelPhoto.url ? hotel.hotelPhoto.url : hotel.hotelPhoto;

    this.state = {
      screenWidth: screenWidth,
      titleLength: this.getTitleLength(screenSize),
      descriptionLength: this.getDescriptionLength(screenSize),
      pictures: photoUrl ? [{url: photoUrl}, {url: photoUrl}] : [],
      loadedPictures: true,
      ready: false
    };

    this.updateWindowDimensions = _.debounce(this.updateWindowDimensions.bind(this), 500);
    this.setReady = this.setReady;
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    setTimeout(this.setReady(), 10);
  }

  setReady() {
    this.setState({ready: true});
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    const width = window.innerWidth;
    const screenSize = this.getScreenSize(width);
    const titleLength = this.getTitleLength(screenSize);
    const descriptionLength = this.getDescriptionLength(screenSize);
    this.setState({screenWidth: window.innerWidth, titleLength, descriptionLength});
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
    let {currency, currencySign, currencyExchangeRates, isUserLogged, hotel, price, nights, allElements, location, searchHotel, sch} = this.props;

    let {id, name, generalDescription, star, lastBestPrice} = hotel;

    const isPriceLoaded = !!price;
    const priceInSelectedCurrency = currencyExchangeRates && ((CurrencyConverter.convert(currencyExchangeRates, RoomsXMLCurrency.get(), currency, price))).toFixed(2);
    const lastBestPriceInSelectedCurrency = currencyExchangeRates && ((CurrencyConverter.convert(currencyExchangeRates, RoomsXMLCurrency.get(), currency, lastBestPrice))).toFixed(2);

    name = name && StringUtils.shorten(name, this.state.titleLength);
    generalDescription = generalDescription && StringUtils.shorten(generalDescription, this.state.descriptionLength);

    const pictures = this.state.pictures || [];
    const {loadedPictures} = this.state;
    if (pictures.length < 1) {
      pictures.push({url: DEFAULT_LISTING_IMAGE_URL});
    }

    const SlickButtonLoad = ({currentSlide, slideCount, ...props}) => (
      <button {...props} onClick={() => {
        this.setState({loadedPictures: false});
        requester.getHotelPictures(hotel.id).then(res => {
          res.body.then(data => {
            let images = _.orderBy(data, ['url'], ['asc']);
            images.push(images.shift());
            this.setState({pictures: images, loadedPictures: true, calledBackendForAllImages: true}, () => {
              props.onClick();
            });
          });
        });
      }}/>
    );

    const SlickButton = ({currentSlide, slideCount, ...props}) => (
      <button {...props} />
    );

    const settings = {
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      slidesToScroll: 1,
      nextArrow: this.state.calledBackendForAllImages === true ? <SlickButton/> : <SlickButtonLoad/>,
      prevArrow: this.state.calledBackendForAllImages === true ? <SlickButton/> : <SlickButtonLoad/>,
      beforeChange: () => {
        if (!this.state.calledBackendForAllImages) {
          this.setState({loadedPictures: false});
          requester.getHotelPictures(hotel.id).then(res => {
            res.body.then(data => {
              let images = _.orderBy(data, ['url'], ['asc']);
              images.push(images.shift());
              this.setState({pictures: images, loadedPictures: true, calledBackendForAllImages: true}, () => {
              });
            });
          });
        }
      }
    };

    const isMobile = location.pathname.indexOf('mobile') !== -1;

    const redirectURL = location.pathname.indexOf('mobile') === -1
      ? '/hotels/listings'
      : '/mobile/hotels/listings';

    const search = location.search;
    const endOfSearch = search.indexOf('&filters=') !== -1 ? search.indexOf('&filters=') : search.length;
    const isSearchHotel = sch && sch === true;

    const searchHotelStyle = {
      boxShadow: '-.4px -.5px 8px 8px #D87A61FF',
    };
    return (
      <div className={`${this.state.ready === true ? 'ready' : ''} result`} style={isSearchHotel ? searchHotelStyle : {}}>
        <div className="result-images">
          {loadedPictures ?
            <Slider
              ref={c => (this.slider = c)}
              {...settings}>
              {pictures.map((picture, i) => {
                return (
                  <div key={i}>
                    <Link target={isMobile === false ? '_blank' : ''}
                          to={`${redirectURL}/${id}${search.substr(0, endOfSearch)}`} key={i}>
                      <div style={{backgroundImage: 'url(' + Config.getValue('imgHost') + picture.url + ')'}}>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </Slider> : <div style={{width: '240px'}}/>
          }
        </div>
        <div className="result-content">
          <div>
            <h4><Link target={isMobile === false ? '_blank' : ''}
                      to={`${redirectURL}/${id}${search.substr(0, endOfSearch)}`}>{name}</Link></h4>
            <Rating rating={star}/>
          </div>
          <div className="result-description">{generalDescription && ReactHtmlParser(generalDescription)}</div>
          <div className="result-mobile-pricing">
            {!isPriceLoaded
              ? (!allElements ? <div className="price">Loading price...</div> : <div></div>)
              : <div className="price">{isUserLogged && `${currencySign} ${priceInSelectedCurrency}`}</div>
            }
            {isPriceLoaded && <div className="price">1 night: <LocPrice fiat={price}/></div>}
            <div>
              {!isPriceLoaded && allElements
                ? <button disabled className="mobile-pricing-button">Unavailable</button>
                : <Link target={isMobile === false ? '_blank' : ''} className="mobile-pricing-button"
                        to={`${redirectURL}/${id}${search.substr(0, endOfSearch)}`}>Book now</Link>
              }
            </div>
          </div>
        </div>

        <div className="result-pricing">
          <div className="price-for">Price for 1 night</div>
          {!isPriceLoaded
            ? (!allElements ? (<div>
              <div className="loader" style={{width: '100%'}}></div><br />
              <div className="price-for">Last best search price</div><br /> <span className="price">{isUserLogged && lastBestPriceInSelectedCurrency && `${currencySign} ${lastBestPriceInSelectedCurrency}`}</span>
            </div>) : <span style={{padding: '20px 10px 10px 10px'}}>Unavailable</span>)
            : <div>

              < br/> <span
              className="price">{isUserLogged && priceInSelectedCurrency && `${currencySign} ${priceInSelectedCurrency}`}</span>
            </div>
          }
          {isPriceLoaded && <LocPrice fiat={price}/>}
          {!isPriceLoaded && allElements
            ? <button disabled className="button">Unavailable</button>
            : <Link target={isMobile === false ? '_blank' : ''} className="button"
                    to={`${redirectURL}/${id}${search.substr(0, endOfSearch)}`}>Book now</Link>
          }
        </div>
      </div>
    );
  }
}

Result.propTypes = {
  hotel: PropTypes.object,
  nights: PropTypes.number,
  price: PropTypes.any,
  allElements: PropTypes.bool,

  // Router props
  location: PropTypes.object,

  // Redux props
  currency: PropTypes.string,
  currencySign: PropTypes.string,
  isUserLogged: PropTypes.bool,
  currencyExchangeRates: PropTypes.object
};

function mapStateToProps(state) {
  const {paymentInfo, userInfo, exchangeRatesInfo} = state;
  return {
    currency: getCurrency(paymentInfo),
    currencySign: getCurrencySign(paymentInfo),
    isUserLogged: isLogged(userInfo),
    currencyExchangeRates: getCurrencyExchangeRates(exchangeRatesInfo)
  };
}

export default withRouter(connect(mapStateToProps)(Result));
