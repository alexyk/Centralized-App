import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

function Rating(props) {
  
  const getSummary = (rating) => {
    switch(rating) {
      case 5: return `Excellent ${rating}/5`;
      case 4: return `Very good ${rating}/5`;
      case 3: return `Good ${rating}/5`;
      case 2: return `Sufficient ${rating}/5`;
      case 1: return `Weak ${rating}/5`;
      case 0: return 'No reviews';
      default: return;
    }
  };

  const getStars = (rating) => {
    let stars = [];
    for (let index = 0; index < 5; index++) {
      if (index < rating) {
        stars.push(<span key={index} className="fa fa-star full"></span>);
      } else {
        stars.push(<span key={index} className="fa fa-star"></span>);
      }
    }

    return stars;
  };

  if (props.rating !== 0 && !props.rating) {
    return null;
  }

  const rating = Math.round(props.rating);

  return (
    <div className="rating">
      <div className="rating-summary">{getSummary(rating)}</div>
      <div className="rating-stars">{getStars(rating)}</div>
    </div>
  );
}

Rating.propTypes = {
  rating: PropTypes.number,
  color: PropTypes.string,
};

export default Rating;