import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import '../../../styles/css/components/search-result-component.css';
import { Config } from '../../../config';
import { ROOMS_XML_CURRENCY } from '../../../constants/currencies.js';
import ReactHtmlParser from 'react-html-parser';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import '../../../styles/css/components/hotels_search/results_holder__hotels.css';

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

  const leftButton = <button></button>;
  const rightButton = <button></button>;

  let { id, name, description, photos, stars } = props.hotel;
  let { price } = props;
  const pictures = photos && photos.slice(0, 3).map(url => { return { thumbnail: `${Config.getValue('imgHost')}${url}` }; });
  const { locRate, rates } = props;
  const { currencySign } = props.paymentInfo;
  const isPriceLoaded = !!price;
  let locPrice = ((price / locRate) / props.nights).toFixed(2);
  const priceInSelectedCurrency = rates && ((price * (rates[ROOMS_XML_CURRENCY][props.paymentInfo.currency])) / props.nights).toFixed(2);

  description = description && description.substr(0, 250);

  if (pictures && pictures.length < 1) {
    pictures.push({ thumbnail: `${Config.getValue('imgHost')}/listings/images/default.png` });
  }

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: rightButton,
    prevArrow: leftButton
  };

  const redirectURL = props.location.pathname.indexOf('mobile') === -1 
    ? '/hotels/listings'
    : '/mobile/details';

  console.log('render', price);

  return (
    <div className="result" >
      <div className="result-images">
        {pictures &&
          <Slider ref={s => slider = s}
            {...settings}>
            {pictures.map((picture, i) => {
              return (
                <div key={i}>
                  <Link to={`${redirectURL}/${id}${props.location.search}`} key={i}>
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
        <h4><Link to={`${redirectURL}/${id}${props.location.search}`}>{name}</Link></h4>
        <div className="rating">
          <span>Rating: </span>
          <div className="rating-holder">
            {calculateStars(stars)}
          </div>
        </div>
        <p>{description && ReactHtmlParser(description + (description.length < 250 ? '' : '...'))}</p>
      </div>
      
      <div className="result-pricing">
        <div className="price-for">Price for 1 night</div>
        {!isPriceLoaded 
          ? (!props.allElements ? <div className="loader" style={{width: '100%'}}></div> : <span style={{padding: '20px 10px 10px 10px'}}>Unavailable</span>)
          : <span className="price">{props.userInfo.isLogged && `${currencySign} ${priceInSelectedCurrency}`}</span>
        }
        {isPriceLoaded && <span>(LOC {locPrice})</span>}
        {!isPriceLoaded && props.allElements
          ? <button disabled className="btn">Unavailable</button>
          : <Link className="btn" to={`${redirectURL}/${id}${props.location.search}`}>Book now</Link>
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