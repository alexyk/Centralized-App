import { Link, withRouter } from 'react-router-dom';

import { Config } from '../../../config';
import ListingItemPictureCarousel from '../../common/listing/ListingItemPictureCarousel';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { RoomsXMLCurrency } from '../../../services/utilities/roomsXMLCurrency';
import LocPrice from '../../common/utility/LocPrice';
import Rating from '../../common/rating';
import { DEFAULT_LISTING_IMAGE_URL } from '../../../constants/images';
import { getCurrency, getCurrencySign } from '../../../selectors/paymentInfo';

function HomeResult(props) {
  const { currency, currencySign, listing, location } = props;
  const { cityName, countryName, prices, currency_code, defaultDailyPrice, id, name, averageRating, description } = listing;
  const listingPrice = prices && currency === currency_code ? parseFloat(defaultDailyPrice, 10).toFixed() : parseFloat(prices[currency], 10).toFixed(2);
  const listingPriceInRoomsCurrency = prices && prices[RoomsXMLCurrency.get()];
  
  let pictures = listing.pictures || [];
  if (typeof pictures === 'string') {
    pictures = JSON.parse(pictures).map(img => { return { thumbnail: Config.getValue('imgHost') + img.thumbnail }; });
  }

  if (pictures.length < 1) {
    pictures.push({ thumbnail: Config.getValue('imgHost') + DEFAULT_LISTING_IMAGE_URL });
  }

  return (
    <div className="list-hotel">
      <div className="list-image">
        <ListingItemPictureCarousel pictures={pictures} id={id} />
      </div>
      <div className="list-content">
        <h2><Link to={`/homes/listings/${id}${location.search}`}>{name}</Link></h2>
        <Rating rating={averageRating} />
        <div className="clearfix"></div>
        <p>{cityName}, {countryName}</p>
        <div className="list-hotel-text">
          {description.substr(0, 190)}...
        </div>
      </div>
      <div className="list-price">
        <div className="list-hotel-price-bgr">Price for 1 night</div>
        <div className="list-hotel-price-curency">{currencySign}{listingPrice}</div>
        <div className="list-hotel-price-loc">{listingPriceInRoomsCurrency && <LocPrice fiat={listingPriceInRoomsCurrency} />}</div>
        <Link to={`/homes/listings/${id}${location.search}`} className="list-hotel-price-button button">Book now</Link>
      </div>
      <div className="clearfix"></div>
    </div>
  );
}

HomeResult.propTypes = {
  listing: PropTypes.object,

  // Router props
  location: PropTypes.object,

  // start Redux props
  dispatch: PropTypes.func,
  currency: PropTypes.string,
  currencySign: PropTypes.string
};

function mapStateToProps(state) {
  const { paymentInfo } = state;
  return {
    currency: getCurrency(paymentInfo),
    currencySign: getCurrencySign(paymentInfo)
  };
}

export default withRouter(connect(mapStateToProps)(HomeResult));
