import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import NextArrow from '../../../styles/images/icon-next.png';

import '../../../styles/css/components/common/utilities/booking-steps.css';

function BookingSteps(props) {
  return (
    <div className="booking-steps">
      <div className="container">
        {props.steps && props.steps.map((step, index) => {
          const isStepActive = props.currentStepIndex >= index;
          if (index === props.steps.length - 1) {
            return <p className={`step ${isStepActive ? 'active' : ''}`} key={index}>{index + 1}. {step}</p>;
          }
          return (
            <Fragment key={index}>
              <p className={`step ${isStepActive ? 'active' : ''}`}>{index + 1}. {step}</p>
              <img className="arrow" src={NextArrow} alt="next-arrow" />
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

BookingSteps.propTypes = {
  /** String names of steps */
  steps: PropTypes.arrayOf(PropTypes.string),
  currentStepIndex: PropTypes.number,
};

export default BookingSteps;
