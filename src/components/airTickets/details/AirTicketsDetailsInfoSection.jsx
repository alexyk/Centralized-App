import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import AirTicketsDetailsBookingPanel from './AirTicketsDetailsBookingPanel';
import { initStickyElements } from '../common/detailsPageUtils';
import BagIcon from '../../../styles/images/bag-icon.png';
import MealIcon from '../../../styles/images/meal-icon.png';
import WirelessIcon from '../../../styles/images/icon-wireless_internet.png';
import TimeIcon from '../../../styles/images/time-icon.png';
import CoffeeIcon from '../../../styles/images/coffe-icon.png';
import SuitcaseIcon from '../../../styles/images/suitcase-icon.png';
import PowerIcon from '../../../styles/images/power-icon.png';

import '../../../styles/css/components/airTickets/search/air-tickets-search-result.css';
import '../../../styles/css/components/airTickets/details/air-tickets-details-info-section.css';
import moment from 'moment';


class AirTicketsDetailsInfoSection extends React.Component {
  componentDidMount() {
    initStickyElements();
  }

  middleStops(solution) {
    let middleStopsBulets = [];
    for (let i = 0; i < solution.segments.length - 1; i++) {
      middleStopsBulets.push(
        <Fragment key={i}>
          <div key={i} className="bulet-container"><span className="bulet"></span></div>
          <hr className="line" />
          <div className="middle-stop" style={{ left: `${(i * 60) + 40}px` }}>{solution.segments[i].destination.code}</div>
        </Fragment>
      );
    }
    return middleStopsBulets;
  }

  extractFlightFullDurationFromMinutes(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${hours}h ${remainingMinutes}min`;
  }

  toggleShowAllFacilities() {
    
  }

  render() {
    const { result } = this.props;
    const solution = result.solutions[0];

    const departureTime = solution.segments[0].origin.time;
    const arrivalTime = solution.segments[solution.segments.length - 1].destination.time;
    const carrierName = solution.segments[0].carrierName;

    return (
      <section className="air-tickets-details-container">
        <div className="air-tickets-details-box" id="air-tickets-details-box">
          <div className="air-tickets-details-content">
            <div className="air-tickets-details-result">
              <div className="air-tickets-result-content">
                <div className="solution-main-info">
                  <h5 className="departure">Departure</h5>
                  <h5 className="carrier">{carrierName}</h5>
                  <div className="duration">
                    <img width="20" src={TimeIcon} alt="time" />
                    {this.extractFlightFullDurationFromMinutes(solution.segments[solution.segments.length - 1].journeyTime)}
                  </div>
                  <div className="stops-count">{solution.segments.length - 1} stops</div>
                </div>
                <div className="solution-flight">
                  <div className="flight">
                    <div className="item flight-times">
                      {departureTime}
                      <div className="arrow-icon-container">
                        <img src="/images/icon-arrow.png" alt="icon-arrow" />
                      </div>
                      {arrivalTime}
                    </div>
                    <div className="item flight-stops">
                      <div className="stop">{solution.segments[0].origin.code}</div>
                      <div className="stops-container horizontal">
                        <div className="bulet-container"><span className="bulet"></span></div>
                        <hr className="line" />
                        {solution.segments.length === 1 ? null : this.middleStops(solution)}
                        <div className="bulet-container"><span className="bulet"></span></div>
                      </div>
                      <div className="stop">{solution.segments[solution.segments.length - 1].destination.code}</div>
                    </div>
                    <div className="item flight-icons">
                      <div className="icon">
                        <img src={MealIcon} alt="meal" />
                      </div>
                      <div className="icon">
                        <img src={BagIcon} alt="bag" />
                      </div>
                      <div className="icon wi-fi">
                        <img src={WirelessIcon} alt="bag" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="air-tickets-details-content-item">
              <div className="">
                <h2>Baggage</h2>
                <hr />
              </div>
              <h2>Facilities</h2>
              <hr />
              <div className="facilities">
                <div className="facility" tooltip="Wireless">
                  <span>
                    <img src={WirelessIcon} alt="Wireless" />
                  </span>
                </div>
                <div className="facility" tooltip="Meal">
                  <span>
                    <img src={MealIcon} alt="Meal" />
                  </span>
                </div>
                <div className="facility" tooltip="Coffee">
                  <span>
                    <img src={CoffeeIcon} alt="Coffee" />
                  </span>
                </div>
                <div className="facility" tooltip="Baggage">
                  <span>
                    <img src={SuitcaseIcon} alt="Baggage" />
                  </span>
                </div>
                <div className="facility" tooltip="Power">
                  <span>
                    <img src={PowerIcon} alt="Power" />
                  </span>
                </div>
                <div onClick={this.toggleShowAllFacilities} className="more-facilities">
                  <p>+{23}</p>
                </div>
              </div>
            </div>
            <div className="">
              <h2>Flight details</h2>
              <hr />
            </div>
            <div className="">
              <h2>Stop</h2>
              <hr />
            </div>
            <div className="">
              <h2>Fare Rules</h2>
              <hr />
            </div>
          </div>
          <AirTicketsDetailsBookingPanel
            startDate={moment()}
            endDate={moment()}
            handleChangeStart={this.props.handleChangeStart}
            handleChangeEnd={this.props.handleChangeEnd}
          />
        </div>
      </section >
    );
  }
}

AirTicketsDetailsInfoSection.propTypes = {
  result: PropTypes.object
};



export default AirTicketsDetailsInfoSection;
