import { Config } from '../../../config.js';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import ListingItemPictureCarousel from './ListingItemPictureCarousel';
import ListingItemRatingBox from './ListingItemRatingBox';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

let slider = null;

function PopularListingItem(props) {
  const { listingsType } = props;
  let listingPrice;
  let pictures;
  let rating;
  if (listingsType === 'homes') {
    listingPrice = (props.listing.prices) && props.paymentInfo.currency === props.listing.currencyCode ? parseInt(props.listing.defaultDailyPrice, 10).toFixed(2) : parseInt(props.listing.prices[props.paymentInfo.currency], 10).toFixed(2);
    pictures = props.listing.pictures;

    if (typeof pictures === 'string') {
      pictures = JSON.parse(pictures);
    }

    pictures = pictures.map(x => { return { thumbnail: Config.getValue('imgHost') + x.thumbnail }; });
    rating = props.listing.averageRating;
  } else if (listingsType === 'hotels') {
    listingPrice = 0.0;
    pictures = props.listing.hotelPhotos.map(x => { return { thumbnail: 'http://roomsxml.com' + x.externalThumbnailUrl }; });
    rating = props.listing.star;
  }

  const SlickButton = props => {
    const { currentSlide, slideCount, ...arrowProps } = props;
    return (
      <button type="button" {...arrowProps} />
    );
  };

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SlickButton />,
    prevArrow: <SlickButton />,
    className: 'picture'
  };

  return (
    <div className="item active">
      <div className="list-property-small">
        <Link to={`/${listingsType}/listings/${props.listing.id}?startDate=${moment(new Date(new Date().setHours(24)), 'DD/MM/YYYY').format('DD/MM/YYYY')}&endDate=${moment(new Date(new Date().setHours(48)), 'DD/MM/YYYY').format('DD/MM/YYYY')}&rooms=%5B%7B"adults":1,"children":%5B%5D%7D%5D`}>
          <div className="list-property-pictures">
            {pictures &&
              <Slider ref={s => slider = s}
                {...settings}>
                {pictures.map((picture, i) => {
                  return (
                    <div key={i}>
                      <div style={{ backgroundImage: 'url(' + picture.thumbnail + ')' }} />
                    </div>
                  );
                })}
              </Slider>
            }
          </div>
          <div className="list-property-description">
            <div className="popular-list-data">
              <div className="name">
                {props.listing.name.substr(0, 35)}{props.listing.name.length > 35 ? '...' : ''}
              </div>
              <ListingItemRatingBox
                rating={rating}
              />
            </div>
            <div className="list-property-price"><strong>{props.paymentInfo.currencySign}{listingPrice} <span>(LOC {(listingPrice / props.paymentInfo.locRate).toFixed(2)})</span></strong> per night</div>
            <div className="clearfix">
            </div>
          </div>
        </Link>
      </div>
    </div>);
}

PopularListingItem.propTypes = {
  listing: PropTypes.object,
  listingsType: PropTypes.string,

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


export default connect(mapStateToProps)(PopularListingItem);