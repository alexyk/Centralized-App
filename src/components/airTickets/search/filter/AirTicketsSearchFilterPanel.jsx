import React from 'react';
import PropTypes from 'prop-types';

import '../../../../styles/css/components/airTickets/search/filter/air-tickets-search-filter-panel.css';

function AirTicketsSearchFilterPanel(props) {
  if (!props.isSearchReady) {
    return (
      <div className="filter-box">
        <div className="form-group">
          <h6 className="filter-info">Search in progress, filtering will be possible after it is completed</h6>
        </div>
      </div>
    );
  }

  // if (props.windowWidth <= 991 && !props.showFiltersMobile) {
  //   return (
  //     <div className="filter-box">
  //       <div onClick={props.handleShowFilters} className="show-filters">Show Filters</div>
  //     </div>
  //   );
  // }

  return (
    <div className="filter-box">
      {props.isSearchReady}
      <div>
        <div className="filter stops-filter">
          <h5>Stops</h5>
          <div className="select">
            <select name="stops" value={props.stops} onChange={props.handleStops}>
              <option value="rank,desc">any</option>
              <option value="rank,desc">direct flight</option>
              <option value="priceForSort,asc">one stop</option>
              <option value="priceForSort,desc">one or more stops</option>
            </select>
          </div>
        </div>
        <div className="filter departure-time-filter">
          <h5>Departure time</h5>
          <div className="select">
            <select name="departureTime" value={props.departureTime} onChange={props.handleDepartureTime}>
              <option value="rank,desc">00:00 - 08:00</option>
              <option value="rank,desc">08:00 - 12:00</option>
              <option value="priceForSort,asc">12:00 - 18:00</option>
              <option value="priceForSort,desc">18:00 - 08:00</option>
            </select>
          </div>
        </div>
        <div className="filter carrier-filter">
          <h5>Carrier</h5>
          <div className="select">
            <select name="carrier" value={props.carrier} onChange={props.handleCarrier}>
              <option value="rank,desc">any</option>
              <option value="rank,desc">Air France</option>
              <option value="priceForSort,asc">Lufthansa</option>
            </select>
          </div>
        </div>
        <button type="submit" onClick={props.clearFilters} className="btn btn">Clear Filters</button>
      </div>
    </div>
  );
}

AirTicketsSearchFilterPanel.propTypes = {
  isSearchReady: PropTypes.bool
};

export default AirTicketsSearchFilterPanel;