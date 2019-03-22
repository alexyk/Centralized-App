import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import AirTicketsDetailsBookingPanel from './AirTicketsDetailsBookingPanel';
import TimeIcon from '../../../../styles/images/time-icon.png';

import '../../../../styles/css/components/airTickets/search/air-tickets-search-result.css';
import '../../../../styles/css/components/airTickets/book/details/air-tickets-details-info-section.css';

class AirTicketsDetailsInfoSection extends Component {
  constructor(props) {
    super(props)
  }

  convertMinutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${hours}h ${remainingMinutes}min`;
  }

  extractDatesData(segments) {
    const startDateMoment = moment(segments[0].origin.date);
    const endDateMoment = moment(segments[segments.length - 1].destination.date);

    const departure = {
      day: startDateMoment.format('D'),
      year: startDateMoment.format('YYYY'),
      month: startDateMoment.format('MMM'),
      time: segments[0].origin.time,
      timezone: segments[0].origin.timezone
    };

    const arrival = {
      day: endDateMoment.format('D'),
      year: endDateMoment.format('YYYY'),
      month: endDateMoment.format('MMM'),
      time: segments[segments.length - 1].origin.time,
      timezone: segments[segments.length - 1].origin.timezone
    };

    return { departure, arrival };
  }

  getDepartureInfo(departureInfo) {
    if (departureInfo.length === 0) {
      return;
    }

    const departureDate = this.extractDatesData(departureInfo);

    let middleStopsBulets = [];

    const buletIndex = 180 / departureInfo.length;

    for (let i = 0; i < departureInfo.length - 1; i++) {
      middleStopsBulets.push(
        <Fragment key={i}>
          <div key={i} className="bulet-container" style={{ left: `${((i + 1) * buletIndex) + 8}px` }}><span className="bulet"></span></div>
          <div className="middle-stop" style={{ left: `${(((i + 1) * buletIndex) + 8) - 11}px` }}>
            {departureInfo[i].destination.code}
            <div className="tooltip-content">
              <div>Transfer</div>
              <hr />
              <div>{departureInfo[i].destination.name} ({departureInfo[i].destination.code})</div>
            </div>
          </div>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <div className="solution-main-info">
          <div className="flight-departure-text-wrapper">
            <h5>Departure</h5>
          </div>
          <div className="flight-carrier-wrapper">
            <h5 className="carrier">{departureInfo[0].carrier.name}</h5>
          </div>
          <div className="flight-duration-wrapper">
            <img width="20" src={TimeIcon} alt="time" />
            <span className="duration">{this.convertMinutesToTime(departureInfo[departureInfo.length - 1].journeyTime)}</span>
          </div>
          <div className="flight-stops-count">
            <span>{departureInfo.length - 1 === 0 ? 'direct flight' : `${departureInfo.length - 1} stops`}</span>
          </div>
        </div>
        <div className="solution-flight">
          <div className="flight">
            <div className="item flight-date-times">
              <div className="flight-date-time">
                <span className="date-in-day">{departureDate.departure.day}</span> {departureDate.departure.month}, {departureDate.departure.year}
                <div className="time">{departureDate.departure.time}</div>
              </div>
              <div className="arrow-icon-container">
                <img src="/images/icon-arrow.png" alt="icon-arrow" />
              </div>
              <div className="flight-date-time">
                <span className="date-out-day">{departureDate.arrival.day}</span> {departureDate.arrival.month}, {departureDate.arrival.year}
                <div className="time">{departureDate.arrival.time}</div>
              </div>
            </div>
            <div className="item flight-stops">
              <div className="stop">
                {departureInfo[0].origin.code}
                <div className="tooltip-content">
                  <div>Departure</div>
                  <hr />
                  <div>{departureInfo[0].origin.name} ({departureInfo[0].origin.code})</div>
                </div>
              </div>
              <div className="stops-container horizontal">
                <div className="bulet-container"><span className="bulet"></span></div>
                <hr className="line" />
                {departureInfo.length === 1 ? null : middleStopsBulets}
                <div className="bulet-container" style={{ left: '180px' }}><span className="bulet"></span></div>
              </div>
              <div className="stop">
                {departureInfo[departureInfo.length - 1].destination.code}
                <div className="tooltip-content">
                  <div>Arrival</div>
                  <hr />
                  <div>{departureInfo[departureInfo.length - 1].destination.name} ({departureInfo[departureInfo.length - 1].destination.code})</div>
                </div>
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

    const returnDate = this.extractDatesData(returnInfo);

    let middleStopsBulets = [];

    const buletIndex = 180 / returnInfo.length;

    for (let i = 0; i < returnInfo.length - 1; i++) {
      middleStopsBulets.push(
        <Fragment key={i}>
          <div key={i} className="bulet-container" style={{ left: `${((i + 1) * buletIndex) + 8}px` }}><span className="bulet"></span></div>
          <div className="middle-stop" style={{ left: `${(((i + 1) * buletIndex) + 8) - 11}px` }}>
            {returnInfo[i].destination.code}
            <div className="tooltip-content">
              <div>Transfer</div>
              <hr />
              <div>{returnInfo[i].destination.name} ({returnInfo[i].destination.code})</div>
            </div>
          </div>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <div className="solution-main-info">
          <div className="flight-return-text-wrapper">
            <h5>Return</h5>
          </div>
          <div className="flight-carrier-wrapper">
            <h5 className="carrier">{returnInfo[0].carrier.name}</h5>
          </div>
          <div className="flight-duration-wrapper">
            <img width="20" src={TimeIcon} alt="time" />
            <span className="duration">
              {this.convertMinutesToTime(returnInfo[returnInfo.length - 1].journeyTime)}
            </span>
          </div>
          <div className="flight-stops-count">
            <span>{returnInfo.length - 1 === 0 ? 'direct flight' : `${returnInfo.length - 1} stops`}</span>
          </div>
        </div>
        <div className="solution-flight">
          <div className="flight">
            <div className="item flight-date-times">
              <div className="flight-date-time">
                <span className="date-in-day">{returnDate.departure.day}</span>
                <span> {returnDate.departure.month}, {returnDate.departure.year} </span>
                <div className="time">{returnDate.departure.time}</div>
              </div>
              <div className="arrow-icon-container">
                <img src="/images/icon-arrow.png" alt="icon-arrow" />
              </div>
              <div className="flight-date-time">
                <span className="date-out-day">{returnDate.arrival.day}</span> {returnDate.arrival.month}, {returnDate.arrival.year}
                <div className="time">{returnDate.arrival.time}</div>
              </div>
            </div>
            <div className="item flight-stops">
              <div className="stop">
                {returnInfo[0].origin.code}
                <div className="tooltip-content">
                  <div>Departure</div>
                  <hr />
                  <div>{returnInfo[0].origin.name} ({returnInfo[0].origin.code})</div>
                </div>
              </div>
              <div className="stops-container horizontal">
                <div className="bulet-container"><span className="bulet"></span></div>
                <hr className="line" />
                {returnInfo.length === 1 ? null : middleStopsBulets}
                <div className="bulet-container" style={{ left: '180px' }}><span className="bulet"></span></div>
              </div>
              <div className="stop">
                {returnInfo[returnInfo.length - 1].destination.code}
                <div className="tooltip-content">
                  <div>Arrival</div>
                  <hr />
                  <div>{returnInfo[returnInfo.length - 1].destination.name} ({returnInfo[returnInfo.length - 1].destination.code})</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment >
    );
  }

  render() {
    const { result, fareRules, brandInfo, supplierInfo } = this.props;

    if (!result || !fareRules) {
      return <div className="loader"></div>;
    }

    const resultDepartureInfo = result.segments.filter(s => s.group === '0');
    const resultReturnInfo = result.segments.filter(s => s.group === '1');
    const departureInfo = this.getDepartureInfo(resultDepartureInfo);
    const returnInfo = this.getReturnInfo(resultReturnInfo);

    const fareRulesInfo = fareRules.reduce(item => {
      return item.fareRules;
    });
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
                  {resultDepartureInfo.map((segment, index) => {
                    return (
                      <div className="departure-segment" key={index}>
                        <h5>{segment.origin.name} <span className="icon-arrow-right arrow"></span> {segment.destination.name}</h5>
                        <div className="departure-segment-item">
                          <div>Flight number:</div>
                          <div>{segment.carrier.flightNumber}</div>
                        </div>
                        <div className="departure-segment-item">
                          <div>Service class:</div>
                          <div>{segment.classFlightInfo.name}</div>
                        </div>
                        <div className="departure-segment-item">
                          <div>Duration:</div>
                          <div>{this.convertMinutesToTime(segment.flightTime)}</div>
                        </div>
                        {!!segment.techStops &&
                          <div className="departure-segment-item">
                            <div>Tech stops:</div>
                            <div>{segment.techStops}</div>
                          </div>}
                        {!!segment.waitTime &&
                          <div className="departure-segment-item stop-over-wrapper">
                            <div>Stop-over time:</div>
                            <div>{this.convertMinutesToTime(segment.waitTime)}</div>
                          </div>}
                      </div>
                    );
                  })}
                </div>
                {resultReturnInfo.length > 0 &&
                  <div className="return">
                    <h5>Return</h5>
                    {resultReturnInfo.map((segment, index) => {
                      return (
                        <div className="departure-segment" key={index}>
                          <h5>{segment.origin.name} <span className="icon-arrow-right arrow"></span> {segment.destination.name}</h5>
                          <div className="departure-segment-item">
                            <div>Flight number:</div>
                            <div>{segment.carrier.flightNumber}</div>
                          </div>
                          <div className="departure-segment-item">
                            <div>Service class:</div>
                            <div>{segment.classFlightInfo.name}</div>
                          </div>
                          <div className="departure-segment-item">
                            <div>Duration:</div>
                            <div>{this.convertMinutesToTime(segment.flightTime)}</div>
                          </div>
                          {!!segment.techStops &&
                            <div className="departure-segment-item">
                              <div>Tech stops:</div>
                              <div>{segment.techStops}</div>
                            </div>}
                          {!!segment.waitTime &&
                            <div className="departure-segment-item stop-over-wrapper">
                              <div>Stop-over time:</div>
                              <div>{this.convertMinutesToTime(segment.waitTime)}</div>
                            </div>}
                        </div>
                      );
                    })}
                  </div>}
              </div>
            </div>
            {fareRulesInfo.length > 0 &&
              <div className="air-tickets-details-content-item">
                <h2>Fare Rules Info</h2>
                <hr />
                <div className="farerules">
                  {fareRulesInfo.map(item => {
                    item.map((rule, ruleIndex) => {
                      return (
                        <Fragment key={ruleIndex}>
                          <div className="flight-rule-title">
                            <h5>{rule[0].name}</h5>
                          </div>
                          <div className="flight-rules">
                            <div className="rule">
                              <a href={rule[0].value} target="_blank" rel="noopener noreferrer">{rule.value}</a>
                            </div>
                          </div>
                        </Fragment>
                      );
                    });
                  })}
                </div>
              </div>}
            {brandInfo.length > 0 &&
              <div className="air-tickets-details-content-item">
                <h2>Brand Info</h2>
                <hr />
                <div className="farerules">
                  {brandInfo.map((rule, ruleIndex) => {
                    return (
                      <Fragment key={ruleIndex}>
                        <div className="flight-rule-title">
                          <h5>{rule.name}</h5>
                        </div>
                        <div className="flight-rules">
                          <div className="rule">
                            <a href={rule.value} target="_blank" rel="noopener noreferrer">{rule.value}</a>
                          </div>
                        </div>
                      </Fragment>
                    );
                  })}
                </div>
              </div>}
            {supplierInfo.length > 0 &&
              <div className="air-tickets-details-content-item">
                <h2>Supplier Info</h2>
                <hr />
                <div className="farerules">
                  {supplierInfo.map((rule, ruleIndex) => {
                    return (
                      <Fragment key={ruleIndex}>
                        <div className="flight-rule-title">
                          <h5>{rule.name}</h5>
                        </div>
                        <div className="flight-rules">
                          <div className="rule">
                            <a href={rule.value} target="_blank" rel="noopener noreferrer">{rule.value}</a>
                          </div>
                        </div>
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
  result: PropTypes.object,
  fareRules: PropTypes.array,
  brandInfo: PropTypes.array,
  supplierInfo: PropTypes.array
};

export default AirTicketsDetailsInfoSection;
