import React from 'react';
import PropTypes from 'prop-types';

import '../../../../styles/css/components/airTickets/search/common/search-bar-date-picker-hide-preview-single.css';

function AirTicketsSearchBarDatePickerHidePreviewSingle(props) {
  const { datesDetails } = props;
  return (
    <div className="search-bar-date-picker-hide-preview-single">
      <div className="check-in">
        <div className="calendar-image-container">
          <img width="26" src="/images/icon-calendar.png" alt="icon-calendar" />
        </div>
        <div className="row-container">
          <div className="title">Departure</div>
          <div className="date-mon-day">
            <div><span>{datesDetails.departureDateDay} </span>{datesDetails.departureDateMonth}, {datesDetails.departureDateDayOfWeek}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

AirTicketsSearchBarDatePickerHidePreviewSingle.propTypes = {
  datesDetails: PropTypes.object,
};

export default AirTicketsSearchBarDatePickerHidePreviewSingle;