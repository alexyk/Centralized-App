import { Config } from '../../../config.js';
import PropTypes from 'prop-types';
import React from 'react';
import Slider from 'react-slick';
import { connect } from 'react-redux';
import moment from 'moment';
import { getCurrency } from '../../../selectors/paymentInfo';

function PopularDestinationsCarousel(props) {
  const { currency } = props;
  const pictures = [
    {
      id: 24979,
      countryId: 24979,
      query: 'London',
      image: `${Config.getValue('basePath')}images/destinations/London.png`,
      searchUrl: `hotels/listings?region=24979&currency=${currency}&startDate=${moment().add(1, 'days').format('DD/MM/YYYY')}&endDate=${moment().add(2, 'days').format('DD/MM/YYYY')}&rooms=%5B%7B"adults":2,"children":%5B%5D%7D%5D`,
    },
    {
      id: 17120,
      countryId: 17120,
      query: 'Madrid',
      image: `${Config.getValue('basePath')}images/destinations/Madrid.png`,
      searchUrl: `hotels/listings?region=17120&currency=${currency}&startDate=${moment().add(1, 'days').format('DD/MM/YYYY')}&endDate=${moment().add(2, 'days').format('DD/MM/YYYY')}&rooms=%5B%7B"adults":2,"children":%5B%5D%7D%5D`,
    },
    {
      id: 5290,
      countryId: 5290,
      query: 'Paris',
      image: `${Config.getValue('basePath')}images/destinations/Paris.png`,
      searchUrl: `hotels/listings?region=5290&currency=${currency}&startDate=${moment().add(1, 'days').format('DD/MM/YYYY')}&endDate=${moment().add(2, 'days').format('DD/MM/YYYY')}&rooms=%5B%7B"adults":2,"children":%5B%5D%7D%5D`,
    },
    {
      id: 602,
      countryId: 602,
      query: 'Sydney',
      image: `${Config.getValue('basePath')}images/destinations/Sydney.png`,
      searchUrl: `hotels/listings?region=602&currency=${currency}&startDate=${moment().add(1, 'days').format('DD/MM/YYYY')}&endDate=${moment().add(2, 'days').format('DD/MM/YYYY')}&rooms=%5B%7B"adults":2,"children":%5B%5D%7D%5D`,
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
  currency: PropTypes.string,
};

function mapStateToProps(state) {
  const { paymentInfo } = state;
  return {
    currency: getCurrency(paymentInfo)
  };
}

export default connect(mapStateToProps)(PopularDestinationsCarousel);
