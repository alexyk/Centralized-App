import React from 'react';
import PropTypes from 'prop-types';

function HomeDetailsRatingBox(props) {
    const getRatingString = (ratingNumber, reviewsCount) => {

        let result = '';
        let ratingRoundedNumber = Math.round(ratingNumber);

        if (ratingRoundedNumber === 5) {
            result += 'Excellent';
        }
        else if (ratingRoundedNumber === 4) {
            result += 'Very good';
        }
        else if (ratingRoundedNumber === 3) {
            result += 'Good';
        }
        else if (ratingRoundedNumber === 2) {
            result += 'Sufficient';
        }
        else if (ratingRoundedNumber === 1) {
            result += 'Weak';
        }
        else if (ratingRoundedNumber === 0 && reviewsCount !== 0) {
            result += 'Poor';
        }
        result += ' ';
        result += Math.round(ratingNumber * 100) / 100;
        return result;
    };

    const calculateStars = (ratingNumber) => {
        let starsElements = [];
        let rating = Math.round(ratingNumber);
        for (let i = 0; i < rating; i++) {
            starsElements.push(<span key={i} className="fa fa-star full"></span>);
        }
        for (let i = 0; i < 5 - rating; i++) {
            starsElements.push(<span key={100 - i} className="fa fa-star"></span>);
        }

        return starsElements;
    };

    return (
        <div className="home-rating">
            <p className="home-rating-count">
                {getRatingString(props.rating, props.reviewsCount)}<span className="max-rating">/5</span>
                <span className="home-rating-stars">{calculateStars(props.rating)}</span>
            </p>

            {props.reviewsCount >= 0 && <p className="home-rating-reviews">{props.reviewsCount} {props.reviewsCount === 1 ? 'Review' : 'Reviews'}</p>}
        </div>
    );
}

HomeDetailsRatingBox.propTypes = {
    rating: PropTypes.number,
    reviewsCount: PropTypes.number,
    isHomePage: PropTypes.bool
};

export default HomeDetailsRatingBox;