import React from 'react';
import PropTypes from 'prop-types';

import './style.css';

function Rating(props) {
  
  const getSummary = (rating) => {
    switch(rating) {
      case 5: return `Excellent ${rating}/5`;
      case 4: return `Very good ${rating}/5`;
      case 3: return `Good ${rating}/5`;
      case 2: return `Sufficient ${rating}/5`;
      case 1: return `Weak ${rating}/5`;
      case 0: return 'No reviews';
    }
  };

  const getStars = (rating) => {
    let stars = new Array(5);
    stars = stars.fill(<span className="fa fa-star full"></span>, 0, rating);
    stars = stars.fill(<span className={`fa fa-star ${props.color}`}></span>, rating, 5);

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

Rating.defaultProps = {
  color: 'grey'
};

Rating.propTypes = {
  rating: PropTypes.number,
  color: PropTypes.string,
};

export default Rating;