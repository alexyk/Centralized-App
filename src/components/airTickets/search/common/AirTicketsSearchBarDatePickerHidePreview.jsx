import React from 'react';
import PropTypes from 'prop-types';

import '../../../../styles/css/components/common/search/search-bar-date-picker-hide-preview.css';

function AirTicketsSearchBarDatePickerHidePreview(props) {
  const { datesDetails } = props;
  return (
    <div className="search-bar-date-picker-hide-preview">
      <div className="check-in">
        <div>
          <img src="/images/icon-calendar.png" alt="icon-calendar" />
        </div>
        <div className="row-container">
          <div>Departure</div>
          <div className="date-mon-day">
            <p><span>{datesDetails.departureDateDay} </span>{datesDetails.departureDateMonth}, {datesDetails.departureDateDayOfWeek}</p>
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
          <div>Аrrival</div>
          <div className="date-mon-day">
            <p><span className="date-color">{datesDetails.arrivalDateDay} </span>{datesDetails.arrivalDateMonth}, {datesDetails.arrivalDateDayOfWeek}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

AirTicketsSearchBarDatePickerHidePreview.propTypes = {
  datesDetails: PropTypes.object,
};

export default AirTicketsSearchBarDatePickerHidePreview;