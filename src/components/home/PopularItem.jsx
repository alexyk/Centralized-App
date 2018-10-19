import { Config } from '../../config.js';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Rating from '../common/rating';

class PopularItem extends Component {
  constructor(props) {
    super(props);

    this.slider = null;
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { item, itemType, itemLink } = this.props;
    let rating;
    let pictures = item.pictures;

    if (typeof pictures === 'string') {
      pictures = JSON.parse(pictures);
    }

    if (itemType === 'hotels') {
      rating = item.stars;
      pictures = pictures.map(x => { return { thumbnail: Config.getValue('imgHost') + x.url }; });
    } else if (itemType === 'homes') {
      rating = item.averageRating;
      pictures = pictures.map(x => { return { thumbnail: Config.getValue('imgHost') + x.thumbnail }; });
    }

    const SlickButton = ({ currentSlide, slideCount, ...arrowProps }) => {
      return (
        <button {...arrowProps} />
      );
    };

    const settings = {
      infinite: false,
      draggable: false,
      lazyLoad: 'ondemand',
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
                <Slider ref={s => this.slider = s}
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
                <div className="country">{item.countryName} &bull; {item.cityName}</div>
                <div className="name">
                  {item.name.substr(0, 35)}{item.name.length > 35 ? '...' : ''}
                </div>
                <Rating rating={rating}/>
              </div>
              <div className="clearfix">
              </div>
            </div>
          </Link>
        </div>
      </div>);
  }
}

PopularItem.propTypes = {
  item: PropTypes.object,
  itemType: PropTypes.string,
  itemLink: PropTypes.string,
};

export default PopularItem;