import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import AirTicketsDetailsBookingPanel from './AirTicketsDetailsBookingPanel';
import { initStickyElements } from '../common/detailsPageUtils';
import BagIcon from '../../../styles/images/bag-icon.png';
import MealIcon from '../../../styles/images/meal-icon.png';
import WirelessIcon from '../../../styles/images/icon-wireless_internet.png';
import TimeIcon from '../../../styles/images/time-icon.png';

import '../../../styles/css/components/airTickets/search/air-tickets-search-result.css';
import '../../../styles/css/components/airTickets/details/air-tickets-details-info-section.css';


class AirTicketsDetailsInfoSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fareRulesIndex: -1
    };

    this.toggleFareRule = this.toggleFareRule.bind(this);
  }

  componentDidMount() {
    initStickyElements();
  }

  middleStops(item) {
    let middleStopsBulets = [];
    for (let i = 0; i < item.segments.length - 1; i++) {
      middleStopsBulets.push(
        <Fragment key={i}>
          <div key={i} className="bulet-container"><span className="bulet"></span></div>
          <hr className="line" />
          <div className="middle-stop" style={{ left: `${(i * 60) + 40}px` }}>{item.segments[i].destinationInfo.airportIATACode}</div>
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

  getDepartureInfo(departureInfo) {
    if (departureInfo.length === 0) {
      return;
    }

    const departureTime = departureInfo[0].originInfo.flightTime;
    const arrivalTime = departureInfo[departureInfo.length - 1].destinationInfo.flightTime;
    const carrierName = departureInfo[0].carrierInfo.carrierName;
    let middleStopsBulets = [];
    for (let i = 0; i < departureInfo.length - 1; i++) {
      middleStopsBulets.push(
        <Fragment key={i}>
          <div key={i} className="bulet-container"><span className="bulet"></span></div>
          <hr className="line" />
          <div className="middle-stop" style={{ left: `${(i * 60) + 40}px` }}>{departureInfo[i].destinationInfo.airportIATACode}</div>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <div className="solution-main-info">
          <h5 className="departure">Departure</h5>
          <h5 className="carrier">{carrierName}</h5>
          <div className="duration">
            <img width="20" src={TimeIcon} alt="time" />
            {this.extractFlightFullDurationFromMinutes(departureInfo[departureInfo.length - 1].journeyTime)}
          </div>
          <div className="stops-count">{departureInfo.length - 1 === 0 ? 'direct flight' : `${departureInfo.length - 1} stops`}</div>
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
              <div className="stop">{departureInfo[0].originInfo.airportIATACode}</div>
              <div className="stops-container horizontal">
                <div className="bulet-container"><span className="bulet"></span></div>
                <hr className="line" />
                {departureInfo.length === 1 ? null : middleStopsBulets}
                <div className="bulet-container"><span className="bulet"></span></div>
              </div>
              <div className="stop">{departureInfo[departureInfo.length - 1].destinationInfo.airportIATACode}</div>
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
      </Fragment >
    );
  }

  getReturnInfo(returnInfo) {
    if (returnInfo.length === 0) {
      return;
    }

    const departureTime = returnInfo[0].originInfo.flightTime;
    const arrivalTime = returnInfo[returnInfo.length - 1].destinationInfo.flightTime;
    const carrierName = returnInfo[0].carrierInfo.carrierName;
    let middleStopsBulets = [];
    for (let i = 0; i < returnInfo.length - 1; i++) {
      middleStopsBulets.push(
        <Fragment key={i}>
          <div key={i} className="bulet-container"><span className="bulet"></span></div>
          <hr className="line" />
          <div className="middle-stop" style={{ left: `${(i * 60) + 40}px` }}>{returnInfo[i].destinationInfo.airportIATACode}</div>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <div className="solution-main-info">
          <h5 className="departure">Return</h5>
          <h5 className="carrier">{carrierName}</h5>
          <div className="duration">
            <img width="20" src={TimeIcon} alt="time" />
            {this.extractFlightFullDurationFromMinutes(returnInfo[returnInfo.length - 1].journeyTime)}
          </div>
          <div className="stops-count">{returnInfo.length - 1 === 0 ? 'direct flight' : `${returnInfo.length - 1} stops`}</div>
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
              <div className="stop">{returnInfo[0].originInfo.airportIATACode}</div>
              <div className="stops-container horizontal">
                <div className="bulet-container"><span className="bulet"></span></div>
                <hr className="line" />
                {returnInfo.length === 1 ? null : middleStopsBulets}
                <div className="bulet-container"><span className="bulet"></span></div>
              </div>
              <div className="stop">{returnInfo[returnInfo.length - 1].destinationInfo.airportIATACode}</div>
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
      </Fragment >
    );
  }

  toggleFareRule(fareRulesIndex) {
    this.setState({
      fareRulesIndex: fareRulesIndex
    });
  }

  render() {
    const { result, fareRules } = this.props;
    console.log(result);
    const { fareRulesIndex } = this.state;
    const item = result.items[0];
    console.log(item);
    console.log(fareRules);

    const departureInfo = this.getDepartureInfo(item.departureInfo);
    const returnInfo = this.getReturnInfo(item.returnInfo);

    return (
      <section className="air-tickets-details-container">
        <div className="air-tickets-details-box" id="air-tickets-details-box">
          <div className="air-tickets-details-content">
            <div className="air-tickets-details-result">
              <div className="air-tickets-result-content">
                {departureInfo}
                {returnInfo}
              </div>
            </div>
            <div className="air-tickets-details-content-item">
              <h2>Flight details</h2>
              <hr />
              <div className="flight-details">
                <div>Airline: </div>
                <div>Flight number: </div>
                <div>Service class: </div>
                <div>Stop time: </div>
                <div>Total trip duration: </div>
              </div>
            </div>
            <div className="air-tickets-details-content-item">
              <h2>Fare Rules</h2>
              <hr />
              <div className="farerules">
                {fareRules.segments.map((segment, segmentIndex) => {
                  const rules = segment.rules.map((rule, ruleIndex) => {
                    return (
                      <div key={ruleIndex} className="rule">
                        <h5>{rule.ruleTitle}</h5>
                        <h6>{rule.ruleText}</h6>
                      </div>
                    );
                  });
                  return (
                    <Fragment key={segmentIndex}>
                      <div className="flight-rule-title">
                        <h5><div className="flight-rule-origin">{segment.origin.name}</div> <span className="icon-arrow-right arrow"></span> <div className="flight-rule-destination">{segment.destination.name}</div></h5>
                        {fareRulesIndex === segmentIndex ? <div className="toggle"><span className="fa fa-angle-down" onClick={() => this.toggleFareRule(-1)} /></div> : <div className="toggle"><span className="fa fa-angle-right" onClick={() => this.toggleFareRule(segmentIndex)} /></div>}
                      </div>
                      {fareRulesIndex === segmentIndex &&
                        <div className="flight-rules">
                          {rules}
                        </div>}
                    </Fragment>
                  );
                })}
              </div>
            </div>
            <div className="air-tickets-details-content-item">
              <h2>Services</h2>
              <hr />
            </div>
          </div>
          <AirTicketsDetailsBookingPanel result={result} />
        </div>
      </section >
    );
  }
}

AirTicketsDetailsInfoSection.propTypes = {
  result: PropTypes.object,
  fareRules: PropTypes.object
};



export default AirTicketsDetailsInfoSection;
