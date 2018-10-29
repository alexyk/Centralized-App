import React from 'react';
import PropTypes from 'prop-types';

import '../../../styles/css/components/common/search/search-bar-date-picker-hide-preview.css';

function SearchBarDatePickerHidePreview(props) {
  const { datesDetails } = props;
  return (
    <div className="search-bar-date-picker-hide-preview">
      <div className="check-in">
        <div>
          <img src="/images/icon-calendar.png" alt="icon-calendar" />
        </div>
        <div className="row-container">
          <div>Check-in</div>
          <div className="date-mon-day">
            <p><span>{datesDetails.startDateDay} </span>{datesDetails.startDateMonth}, {datesDetails.startDateDayOfWeek}</p>
          </div>
        </div>
      </div>
      <div className="arrow-icon-container">
        <img src="/images/icon-arrow.png" alt="icon-arrow" />
      </div>
      <div className="check-out">
        <div>
          <img src="/images/icon-calendar.png" alt="icon-calendar" />
        </div>
        <div className="row-container">
          <div>Check-out</div>
          <div className="date-mon-day">
            <p><span className="date-color">{datesDetails.endDateDay} </span>{datesDetails.endDateMonth}, {datesDetails.endDateDayOfWeek}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

SearchBarDatePickerHidePreview.propTypes = {
  datesDetails: PropTypes.object,
};

export default SearchBarDatePickerHidePreview;