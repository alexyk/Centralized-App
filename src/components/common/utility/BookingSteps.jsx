import React from 'react';
import PropTypes from 'prop-types';

function BookingSteps(props) {
  return (
    <div className="booking-steps">
      <div className="container">
        {props.steps && props.steps.map((step, index) => {
          return <p key={index}>{index + 1}. {step}</p>;
        })}
      </div>
    </div>
  );
}

BookingSteps.propTypes = {
  /** String names of steps */
  steps: PropTypes.arrayOf(PropTypes.string),
};

export default BookingSteps;