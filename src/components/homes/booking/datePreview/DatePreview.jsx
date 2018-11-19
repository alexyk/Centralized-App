import React from 'react';
import PropTypes from 'prop-types';

import './style.css';

function DatePreview({ checkin, checkout }) {

  const nights = checkout.diff(checkin, 'days');

  return (
    <div className="date-preview">
      <div className="check-in">
        <span className='icon-calendar'></span>
        <div className="date-container">
          <div className="text">Check-in</div>
          <div className="date">
            <span>{checkin.format('DD')} </span>{checkin.format('MMM, ddd').toUpperCase()}
          </div>
        </div>
      </div>
      <span className="icon-arrow-right arrow"></span>
      <div className="check-out">
        <span className='icon-calendar'></span>
        <div className="date-container">
          <div className="text">Check-out</div>
          <div className="date">
            <span>{checkout.format('DD')} </span>{checkout.format('MMM, ddd').toUpperCase()}
          </div>
        </div>
      </div>
      <div className="nights">
        <span className="icon-moon"></span>
        <span>{nights} nights</span>
      </div>
    </div>
  );
}

DatePreview.propTypes = {
  checkin: PropTypes.object,
  checkout: PropTypes.object,
};

export default DatePreview;