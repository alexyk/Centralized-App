import { Link, withRouter } from 'react-router-dom';

import { Config } from '../../../config';
import ListingItemPictureCarousel from '../../common/listing/ListingItemPictureCarousel';
import ListingItemRatingBox from '../../common/listing/ListingItemRatingBox';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

function HomeItem(props) {
  const { currency, currencySign, locEurRate } = props.paymentInfo;
  const { cityName, countryName, prices, currency_code, defaultDailyPrice, id, name, reviewsCount, averageRating, description } = props.listing;
  let { pictures } = props.listing;
  const listingPrice = (prices) && currency === currency_code ? parseInt(defaultDailyPrice, 10).toFixed() : parseInt(prices[currency], 10).toFixed(2);
  const listingPriceInEur = (prices) && currency === currency_code ? parseInt(defaultDailyPrice, 10).toFixed() : parseInt(prices['EUR'], 10).toFixed(2);
  if (typeof pictures === 'string') {
    pictures = JSON.parse(pictures).map(img => { return { thumbnail: Config.getValue('imgHost') + img.thumbnail }; });
  }
  return (
    <div className="list-hotel">
      <div className="list-image">
        <ListingItemPictureCarousel pictures={pictures} id={id} />
      </div>
      <div className="list-content">
        <h2><Link to={`/homes/listings/${id}${props.location.search}`}>{name}</Link></h2>
        <ListingItemRatingBox rating={averageRating} reviewsCount={reviewsCount} />
        <div className="clearfix"></div>
        <p>{cityName}, {countryName}</p>
        <div className="list-hotel-text">
          {description.substr(0, 190)}...
        </div>
      </div>
      <div className="list-price">
        <div className="list-hotel-price-bgr">Price for 1 night</div>
        <div className="list-hotel-price-curency">{currencySign}{listingPrice}</div>
        <div className="list-hotel-price-loc">(LOC {(listingPriceInEur / locEurRate).toFixed(2)})</div>
        <Link to={`/homes/listings/${id}${props.location.search}`} className="list-hotel-price-button btn btn-primary">Book now</Link>
      </div>
      <div className="clearfix"></div>
    </div>
  );
}

HomeItem.propTypes = {
  listing: PropTypes.object,
  location: PropTypes.object,

  // start Redux props
  dispatch: PropTypes.func,
  paymentInfo: PropTypes.object
};

function mapStateToProps(state) {
  const { paymentInfo } = state;
  return {
    paymentInfo
  };
}

export default withRouter(connect(mapStateToProps)(HomeItem));