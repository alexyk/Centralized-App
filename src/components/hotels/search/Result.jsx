import '../../../styles/css/components/search-result-component.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../../styles/css/components/hotels_search/result/results_holder__hotels.css';

import { Link, withRouter } from 'react-router-dom';

import { Config } from '../../../config';
import PropTypes from 'prop-types';
import { ROOMS_XML_CURRENCY } from '../../../constants/currencies.js';
import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import { CurrencyConverter } from '../../../services/utilities/currencyConverter';

import Slider from 'react-slick';
import { connect } from 'react-redux';

let slider = null;

function Result(props) {
  const calculateStars = (ratingNumber) => {
    let starsElements = [];
    let rating = Math.round(ratingNumber);
    for (let i = 0; i < rating; i++) {
      starsElements.push(<span key={i} className="full-star"></span>);
    }

    return starsElements;
  };

  const SlickButton = props => {
    const {currentSlide, slideCount, ...arrowProps} = props;
    return (
      <button type="button" {...arrowProps}>
      </button>
    );
  };

  // const leftButton = <button type="button" data-role="none" className="slick-arrow slick-next" style={{ display: 'block' }}></button>;
  // const rightButton = <button></button>;

  let { id, name, generalDescription, hotelPhoto, star } = props.hotel;
  let { price } = props;
  const photoUrl = hotelPhoto && hotelPhoto.url ? hotelPhoto.url : hotelPhoto;
  const pictures = photoUrl ? [ { thumbnail: `${Config.getValue('imgHost')}${photoUrl}` }, { thumbnail: `${Config.getValue('imgHost')}${photoUrl}` } ] : [];
  const { locRate, rates } = props;
  const { currencySign } = props.paymentInfo;
  const isPriceLoaded = !!price;
  let locPrice = ((price / locRate) / props.nights).toFixed(2);
  const priceInSelectedCurrency = rates && ((CurrencyConverter.convert(rates, ROOMS_XML_CURRENCY, props.paymentInfo.currency, price)) / props.nights).toFixed(2);

  generalDescription = generalDescription && generalDescription.substr(0, 250);

  if (pictures && pictures.length < 1) {
    pictures.push({ thumbnail: `${Config.getValue('imgHost')}/listings/images/default.png` });
  }

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SlickButton />,
    prevArrow: <SlickButton />
  };

  const redirectURL = props.location.pathname.indexOf('mobile') === -1
    ? '/hotels/listings'
    : '/mobile/details';

  const search = props.location.search;
  const endOfSearch = search.indexOf('&filters=') !== -1 ? search.indexOf('&filters=') : search.length;

  return (
    <div className="result" >
      <div className="result-images">
        {pictures &&
          <Slider ref={s => slider = s}
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
        <h4><Link to={`${redirectURL}/${id}${search.substr(0, endOfSearch)}`}>{name}</Link></h4>
        <div className="rating">
          <span>Rating: </span>
          <div className="rating-holder">
            {calculateStars(star)}
          </div>
        </div>
        <div>{generalDescription && ReactHtmlParser(generalDescription + (generalDescription.length < 250 ? '' : '...'))}</div>
      </div>

      <div className="result-pricing">
        <div className="price-for">Price for 1 night</div>
        {!isPriceLoaded
          ? (!props.allElements ? <div className="loader" style={{ width: '100%' }}></div> : <span style={{ padding: '20px 10px 10px 10px' }}>Unavailable</span>)
          : <span className="price">{props.userInfo.isLogged && `${currencySign} ${priceInSelectedCurrency}`}</span>
        }
        {isPriceLoaded && <span>(LOC {locPrice})</span>}
        {!isPriceLoaded && props.allElements
          ? <button disabled className="btn">Unavailable</button>
          : <Link className="btn" to={`${redirectURL}/${id}${search.substr(0, endOfSearch)}`}>Book now</Link>
        }
      </div>
    </div>
  );
}

Result.propTypes = {
  hotel: PropTypes.object,
  nights: PropTypes.number,
  locRate: PropTypes.number,
  rates: PropTypes.any,

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
