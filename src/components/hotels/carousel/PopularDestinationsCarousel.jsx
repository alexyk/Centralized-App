import { Config } from '../../../config.js';
import PropTypes from 'prop-types';
import React from 'react';
import Slider from 'react-slick';
import { connect } from 'react-redux';
import moment from 'moment';

function PopularDestinationsCarousel(props) {
  const pictures = [
    {
      id: 52612,
      countryId: 2,
      query: 'London',
      image: `${Config.getValue('basePath')}images/destinations/London.png`,
      searchUrl: `hotels/listings?region=52612&currency=${props.paymentInfo.currency}&startDate=${moment().add(1, 'days').format('DD/MM/YYYY')}&endDate=${moment().add(2, 'days').format('DD/MM/YYYY')}&rooms=%5B%7B"adults":2,"children":%5B%5D%7D%5D`,
    },
    {
      id: 18417,
      countryId: 3,
      query: 'Madrid',
      image: `${Config.getValue('basePath')}images/destinations/Madrid.png`,
      searchUrl: `hotels/listings?region=18417&currency=${props.paymentInfo.currency}&startDate=${moment().add(1, 'days').format('DD/MM/YYYY')}&endDate=${moment().add(2, 'days').format('DD/MM/YYYY')}&rooms=%5B%7B"adults":2,"children":%5B%5D%7D%5D`,
    },
    {
      id: 16471,
      countryId: 6,
      query: 'Paris',
      image: `${Config.getValue('basePath')}images/destinations/Paris.png`,
      searchUrl: `hotels/listings?region=16471&currency=${props.paymentInfo.currency}&startDate=${moment().add(1, 'days').format('DD/MM/YYYY')}&endDate=${moment().add(2, 'days').format('DD/MM/YYYY')}&rooms=%5B%7B"adults":2,"children":%5B%5D%7D%5D`,
    },
    {
      id: 15375,
      countryId: 24,
      query: 'Sydney',
      image: `${Config.getValue('basePath')}images/destinations/Sydney.png`,
      searchUrl: `hotels/listings?region=15375&currency=${props.paymentInfo.currency}&startDate=${moment().add(1, 'days').format('DD/MM/YYYY')}&endDate=${moment().add(2, 'days').format('DD/MM/YYYY')}&rooms=%5B%7B"adults":2,"children":%5B%5D%7D%5D`,
    },
  ];

  const SlickButton = ({ currentSlide, slideCount, ...props }) => (
    <button {...props} />
  );

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <SlickButton />,
    prevArrow: <SlickButton />,
    className: 'top-destinations',
    responsive: [
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 980,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 650,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <div>
      <Slider
        {...settings}>
        {pictures.map((dest, i) => {
          return (
            <div key={i} className="popular-destination-image-container">
              <div onClick={() => props.handleDestinationPick({ id: dest.id, countryId: dest.countryId, query: dest.query }, dest.searchUrl)}>
                <img src={dest.image} alt={dest.query} />
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
}

PopularDestinationsCarousel.propTypes = {
  // Redux props
  paymentInfo: PropTypes.object,
};

function mapStateToProps(state) {
  const { paymentInfo } = state;
  return {
    paymentInfo
  };
}

export default connect(mapStateToProps)(PopularDestinationsCarousel);
