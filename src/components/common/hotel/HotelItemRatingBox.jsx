import React from 'react';
import PropTypes from 'prop-types';

import '../../../styles/css/components/common/hotel/hotel-item-rating-box.css';

function HotelItemRatingBox(props) {
  const calculateStars = (ratingNumber) => {
    let starsElements = [];
    let rating = Math.round(ratingNumber);
    for (let i = 0; i < rating; i++) {
      starsElements.push(<span key={i} className="full-star star"></span>);
    }

    return starsElements;
  };

  return (
    <div className="rating">
      <span>Rating: </span>
      <div className="rating-holder">
        {calculateStars(props.rating)}
      </div>
    </div>
  );
}

HotelItemRatingBox.propTypes = {
  rating: PropTypes.number,
};

export default HotelItemRatingBox;