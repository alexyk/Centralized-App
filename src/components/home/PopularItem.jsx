import { Config } from '../../config.js';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import ListingItemRatingBox from '../common/listing/ListingItemRatingBox';

let slider = null;

function PopularItem(props) {
  const { item, paymentInfo, itemType, itemLink } = props;
  let price;
  let rating;
  let pictures = item.pictures;

  if (typeof pictures === 'string') {
    pictures = JSON.parse(pictures);
  }

  if (itemType === 'hotels') {
    price = 0;
    rating = item.stars;
    pictures = pictures.map(x => { return { thumbnail: Config.getValue('imgHost') + x.url }; });
  } else if (itemType === 'homes') {
    price = (item.prices) && paymentInfo.currency === item.currencyCode ? parseInt(item.defaultDailyPrice, 10).toFixed(2) : parseInt(item.prices[paymentInfo.currency], 10).toFixed(2);
    rating = item.averageRating;
    pictures = pictures.map(x => { return { thumbnail: Config.getValue('imgHost') + x.thumbnail }; });
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
        <Link to={itemLink}>
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
                {item.name.substr(0, 35)}{item.name.length > 35 ? '...' : ''}
              </div>
              <ListingItemRatingBox
                rating={rating}
                isHomePage={true}
              />
            </div>
            <div className="list-property-price"><strong>{paymentInfo.currencySign}{price} <span>(LOC {(price / paymentInfo.locRate).toFixed(2)})</span></strong> per night</div>
            <div className="clearfix">
            </div>
          </div>
        </Link>
      </div>
    </div>);
}

PopularItem.propTypes = {
  item: PropTypes.object,
  itemType: PropTypes.string,
  itemLink: PropTypes.string,

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


export default connect(mapStateToProps)(PopularItem);