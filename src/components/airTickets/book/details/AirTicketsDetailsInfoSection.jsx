import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import AirTicketsDetailsBookingPanel from './AirTicketsDetailsBookingPanel';
import BagIcon from '../../../../styles/images/bag-icon.png';
import MealIcon from '../../../../styles/images/meal-icon.png';
import WirelessIcon from '../../../../styles/images/icon-wireless_internet.png';
import TimeIcon from '../../../../styles/images/time-icon.png';

import '../../../../styles/css/components/airTickets/search/air-tickets-search-result.css';
import '../../../../styles/css/components/airTickets/book/details/air-tickets-details-info-section.css';

class AirTicketsDetailsInfoSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fareRulesIndex: -1
    };

    this.toggleFareRule = this.toggleFareRule.bind(this);
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

  convertMinutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${hours}h ${remainingMinutes}min`;
  }

  getDepartureInfo(departureInfo) {
    if (departureInfo.length === 0) {
      return;
    }

    const departureTime = departureInfo[0].origin.time;
    const arrivalTime = departureInfo[departureInfo.length - 1].destination.time;
    const carrierName = departureInfo[0].carrier.name;
    let middleStopsBulets = [];
    for (let i = 0; i < departureInfo.length - 1; i++) {
      middleStopsBulets.push(
        <Fragment key={i}>
          <div key={i} className="bulet-container"><span className="bulet"></span></div>
          <hr className="line" />
          <div className="middle-stop" style={{ left: `${(i * 60) + 40}px` }}>{departureInfo[i].destination.code}</div>
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
            {this.convertMinutesToTime(departureInfo[departureInfo.length - 1].journeyTime)}
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
              <div className="stop">{departureInfo[0].origin.code}</div>
              <div className="stops-container horizontal">
                <div className="bulet-container"><span className="bulet"></span></div>
                <hr className="line" />
                {departureInfo.length === 1 ? null : middleStopsBulets}
                <div className="bulet-container"><span className="bulet"></span></div>
              </div>
              <div className="stop">{departureInfo[departureInfo.length - 1].destination.code}</div>
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

    const departureTime = returnInfo[0].origin.time;
    const arrivalTime = returnInfo[returnInfo.length - 1].destination.time;
    const carrierName = returnInfo[0].carrier.name;
    let middleStopsBulets = [];
    for (let i = 0; i < returnInfo.length - 1; i++) {
      middleStopsBulets.push(
        <Fragment key={i}>
          <div key={i} className="bulet-container"><span className="bulet"></span></div>
          <hr className="line" />
          <div className="middle-stop" style={{ left: `${(i * 60) + 40}px` }}>{returnInfo[i].destination.code}</div>
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
            {this.convertMinutesToTime(returnInfo[returnInfo.length - 1].journeyTime)}
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
              <div className="stop">{returnInfo[0].origin.code}</div>
              <div className="stops-container horizontal">
                <div className="bulet-container"><span className="bulet"></span></div>
                <hr className="line" />
                {returnInfo.length === 1 ? null : middleStopsBulets}
                <div className="bulet-container"><span className="bulet"></span></div>
              </div>
              <div className="stop">{returnInfo[returnInfo.length - 1].destination.code}</div>
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
    const { result } = this.props;

    if (!result) {
      return <div className="loader"></div>;
    }

    const { rules } = result;
    const { fareRulesIndex } = this.state;

    const departureInfo = this.getDepartureInfo(result.departureInfo);
    const returnInfo = this.getReturnInfo(result.returnInfo);

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
                <div className="departure">
                  <h5>Departure</h5>
                  {result.departureInfo.map((segment, index) => {
                    return (
                      <div className="departure-segment" key={index}>
                        <h6>{segment.origin.name} <span className="icon-arrow-right arrow"></span> {segment.destination.name}</h6>
                        <div className="departure-segment-item">
                          <div>Flight number:</div>
                          <div>{segment.carrier.flightNumber}</div>
                        </div>
                        <div className="departure-segment-item">
                          <div>Service class:</div>
                          <div>{segment.classFlightInfo.name}</div>
                        </div>
                        <div className="departure-segment-item">
                          <div>Flight time:</div>
                          <div>{this.convertMinutesToTime(segment.flightTime)}</div>
                        </div>
                        {segment.techStops !== 0 &&
                          <div className="departure-segment-item">
                            <div>Tech stops:</div>
                            <div>{segment.techStops}</div>
                          </div>}
                        {segment.waitTime &&
                          <div className="departure-segment-item">
                            <div>Wait time:</div>
                            <div>{this.convertMinutesToTime(segment.waitTime)}</div>
                          </div>}
                      </div>
                    );
                  })}
                </div>
                {result.returnInfo && result.returnInfo.length > 0 &&
                  <div className="return">
                    <h5>Return</h5>
                    {result.returnInfo.map((segment, index) => {
                      return (
                        <div className="departure-segment" key={index}>
                          <h6>{segment.origin.name} <span className="icon-arrow-right arrow"></span> {segment.destination.name}</h6>
                          <div className="departure-segment-item">
                            <div>Flight number:</div>
                            <div>{segment.carrier.flightNumber}</div>
                          </div>
                          <div className="departure-segment-item">
                            <div>Service class:</div>
                            <div>{segment.classFlightInfo.name}</div>
                          </div>
                          <div className="departure-segment-item">
                            <div>Flight time:</div>
                            <div>{this.convertMinutesToTime(segment.flightTime)}</div>
                          </div>
                          {segment.techStops !== 0 &&
                            <div className="departure-segment-item">
                              <div>Tech stops:</div>
                              <div>{segment.techStops}</div>
                            </div>}
                          {segment.waitTime &&
                            <div className="departure-segment-item">
                              <div>Wait time:</div>
                              <div>{this.convertMinutesToTime(segment.waitTime)}</div>
                            </div>}
                        </div>
                      );
                    })}
                  </div>}
              </div>
            </div>
            {rules &&
              <div className="air-tickets-details-content-item">
                <h2>Fare Rules</h2>
                <hr />
                <div className="farerules">
                  {rules.segments.map((segment, segmentIndex) => {
                    const rules = segment.fareRules.map((rule, ruleIndex) => {
                      return (
                        <div key={ruleIndex} className="rule">
                          <h5>{rule.title}</h5>
                          <h6>{rule.text}</h6>
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
              </div>}
          </div>
          <AirTicketsDetailsBookingPanel result={result} />
        </div>
      </section >
    );
  }
}

AirTicketsDetailsInfoSection.propTypes = {
  result: PropTypes.object
};



export default AirTicketsDetailsInfoSection;
