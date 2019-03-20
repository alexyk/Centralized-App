import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import ProfileFlexContainer from '../flexContainer/ProfileFlexContainer';
import PlaneIcon from '../../../styles/images/plane-icon.png';

const STATUS = ['PENDING', 'PREPARE']
class AirTicket extends Component {
  extractDatesData(segments) {
    const startDateMoment = moment(segments[0].originDate);
    const endDateMoment = moment(segments[segments.length - 1].destinationDate);

    const departure = {
      day: startDateMoment.format('D'),
      year: startDateMoment.format('YYYY'),
      month: startDateMoment.format('MMM'),
      time: segments[0].originTime,
      timezone: segments[0].originTimezone
    };

    const arrival = {
      day: endDateMoment.format('D'),
      year: endDateMoment.format('YYYY'),
      month: endDateMoment.format('MMM'),
      time: segments[segments.length - 1].originTime,
      timezone: segments[segments.length - 1].originTimezone
    };

    return { departure, arrival };
  }

  getDepartureAirports(airports) {
    console.log(airports);
    let middleStopsBulets = [];
    const buletIndex = 180 / airports.length;
    for (let i = 0; i < airports.length - 1; i++) {
      middleStopsBulets.push(
        <Fragment key={i}>
          <div key={i} className="bulet-container" style={{ left: `${((i + 1) * buletIndex) + 8}px` }}><span className="bulet"></span></div>
          <div className="middle-stop" style={{ left: `${(((i + 1) * buletIndex) + 8) - 11}px` }}>
            {airports[i].destination}
            <div className="tooltip-content">
              <div>Transfer</div>
              <hr />
              <div>{airports[i].destinationName}</div>
            </div>
          </div>
        </Fragment>
      );
    }

    return (
      <div className="item flight-stops">
        <div className="stop">
          {airports[0].origin}
          <div className="tooltip-content">
            <div>Departure</div>
            <hr />
            <div>{airports[0].originName}</div>
          </div>
        </div>
        <div className="stops-container horizontal">
          <div className="bulet-container"><span className="bulet"></span></div>
          <hr className="line" />
          {airports.length === 1 ? null : middleStopsBulets}
          <div className="bulet-container" style={{ left: '180px' }}><span className="bulet"></span></div>
        </div>
        <div className="stop">
          {airports[airports.length - 1].destination}
          <div className="tooltip-content">
            <div>Arrival</div>
            <hr />
            <div>{airports[airports.length - 1].destinationName}</div>
          </div>
        </div>
      </div>
    );
  }

  getReturnAirports(airports) {
    let middleStopsBulets = [];

    const buletIndex = 180 / airports.length;

    for (let i = 0; i < airports.length - 1; i++) {
      middleStopsBulets.push(
        <Fragment key={i}>
          <div key={i} className="bulet-container" style={{ left: `${((i + 1) * buletIndex) + 8}px` }}><span className="bulet"></span></div>
          <div className="middle-stop" style={{ left: `${(((i + 1) * buletIndex) + 8) - 11}px` }}>
            {airports[i].destination}
            <div className="tooltip-content">
              <div>Transfer</div>
              <hr />
              <div>{airports[i].destinationName}</div>
            </div>
          </div>
        </Fragment>
      );
    }

    return (
      <div className="item flight-stops">
        <div className="stop">
          {airports[0].origin}
          <div className="tooltip-content">
            <div>Departure</div>
            <hr />
            <div>{airports[0].originName}</div>
          </div>
        </div>
        <div className="stops-container horizontal">
          <div className="bulet-container"><span className="bulet"></span></div>
          <hr className="line" />
          {airports.length === 1 ? null : middleStopsBulets}
          <div className="bulet-container" style={{ left: '180px' }}><span className="bulet"></span></div>
        </div>
        <div className="stop">
          {airports[airports.length - 1].destination}
          <div className="tooltip-content">
            <div>Arrival</div>
            <hr />
            <div>{airports[airports.length - 1].destinationName}</div>
          </div>
        </div>
      </div>
    );
  }

  getStatus(status) {
    if (!status) {
      return 'PENDING';
    }

    const statusPreview = status.split('_').join(' ');
    let statusName = '';

    if (STATUS.indexOf(statusPreview[0])) {
      statusName = 'PENDING';
    } else if (statusName[0] === 'FAILED') {
      statusName = 'FAILED';
    } else {
      statusName = 'DONE';
    }

    return statusName;
  }

  getDetails(e) {
    let btn = e.target;

    if (btn.parentNode.parentElement.parentElement.parentElement.children.item(4).style.display === 'inline-flex') {
      btn.parentNode.parentElement.parentElement.parentElement.children.item(4).style.display = 'none';
    } else {
      btn.parentNode.parentElement.parentElement.parentElement.children.item(4).style.display = 'inline-flex';
    }
  }

  render() {
    const { ticket } = this.props;
    if (!ticket.segments.length) {
      return (
        <div></div>
      );
    }
    const firstFlight = ticket.segments.filter(s => s.group === '0');
    const secondFlight = ticket.segments.filter(s => s.group === '1');
    const thirdFlight = ticket.segments.filter(s => s.group === '2');
    const fourthFlight = ticket.segments.filter(s => s.group === '3');
    const fifthFlight = ticket.segments.filter(s => s.group === '4');

    const departureDate = this.extractDatesData(firstFlight);
    const bookedDate = moment(ticket.details.bookedDate).format('DD/MM/YYYY');
    let secondFlightDate, thirdFlightDate, fourthFlightDate, fifthFlightDate;

    if (secondFlight.length > 0) {
      secondFlightDate = this.extractDatesData(secondFlight);
    }

    if (thirdFlight.length > 0) {
      thirdFlightDate = this.extractDatesData(thirdFlight);
    }

    if (fourthFlight.length > 0) {
      fourthFlightDate = this.extractDatesData(fourthFlight);
    }

    if (fifthFlight.length > 0) {
      fifthFlightDate = this.extractDatesData(fifthFlight);
    }

    return (
      <Fragment>
        <ProfileFlexContainer styleClass={`flex-container-row ${this.props.styleClass}`}>
          <div className="flex-row-child tickets-image">
            <img src={PlaneIcon} alt="plane" />
          </div>
          <div className="tickets-airports-holder">
            <div className={`flex-row-child tickets-airports${secondFlight.length === 0 ? ' one-way' : ''}`}>
              <div className="content-row">
                {this.getDepartureAirports(firstFlight)}
              </div>
              {secondFlight.length > 0 &&
              <div className="content-row">
                {this.getDepartureAirports(secondFlight)}
              </div>}
              {thirdFlight.length > 0 &&
              <div className="content-row">
                {this.getDepartureAirports(thirdFlight)}
              </div>}
              {fourthFlight.length > 0 &&
              <div className="content-row">
                {this.getDepartureAirports(fourthFlight)}
              </div>}
              {fifthFlight.length > 0 &&
              <div className="content-row">
                {this.getReturnAirports(fifthFlight)}
              </div>}
            </div>
            <div className={`flex-row-child tickets-dates${secondFlight.length === 0 ? ' one-way' : ''}`}>
              <div className="content-row">
                <div className={`departure-dates${secondFlight.length === 0 ? ' one-way' : ''}`}>
                  <div>
                    <span className="date-in-day">{departureDate.departure.day}</span> {departureDate.departure.month}, {departureDate.departure.year}
                    <div className="time">{departureDate.departure.time} {departureDate.departure.timezone}</div>
                  </div>
                  <i aria-hidden="true" className="fa fa-long-arrow-right" />
                  <div>
                    <span className="date-out-day">{departureDate.arrival.day}</span> {departureDate.arrival.month}, {departureDate.arrival.year}
                    <div className="time">{departureDate.arrival.time} {departureDate.arrival.timezone}</div>
                  </div>
                </div>
              </div>
              {secondFlight.length > 0 &&
              <div className="content-row">
                <div>
                  <span className="date-in-day">{secondFlightDate.departure.day}</span> {secondFlightDate.departure.month}, {secondFlightDate.departure.year}
                  <div className="time">{secondFlightDate.departure.time} {secondFlightDate.departure.timezone}</div>
                </div>
                <i aria-hidden="true" className="fa fa-long-arrow-right" />
                <div>
                  <span className="date-out-day">{secondFlightDate.arrival.day}</span> {secondFlightDate.arrival.month}, {secondFlightDate.arrival.year}
                  <div className="time">{secondFlightDate.arrival.time} {secondFlightDate.arrival.timezone}</div>
                </div>
              </div>}
              {thirdFlight.length > 0 &&
              <div className="content-row">
                <div>
                  <span className="date-in-day">{thirdFlightDate.departure.day}</span> {thirdFlightDate.departure.month}, {thirdFlightDate.departure.year}
                  <div className="time">{thirdFlightDate.departure.time} {thirdFlightDate.departure.timezone}</div>
                </div>
                <i aria-hidden="true" className="fa fa-long-arrow-right" />
                <div>
                  <span className="date-out-day">{thirdFlightDate.arrival.day}</span> {thirdFlightDate.arrival.month}, {thirdFlightDate.arrival.year}
                  <div className="time">{thirdFlightDate.arrival.time} {thirdFlightDate.arrival.timezone}</div>
                </div>
              </div>}
              {fourthFlight.length > 0 &&
              <div className="content-row">
                <div>
                  <span className="date-in-day">{fourthFlightDate.departure.day}</span> {fourthFlightDate.departure.month}, {fourthFlightDate.departure.year}
                  <div className="time">{fourthFlightDate.departure.time} {fourthFlightDate.departure.timezone}</div>
                </div>
                <i aria-hidden="true" className="fa fa-long-arrow-right" />
                <div>
                  <span className="date-out-day">{fourthFlightDate.arrival.day}</span> {fourthFlightDate.arrival.month}, {fourthFlightDate.arrival.year}
                  <div className="time">{fourthFlightDate.arrival.time} {fourthFlightDate.arrival.timezone}</div>
                </div>
              </div>}
              {fifthFlight.length > 0 &&
              <div className="content-row">
                <div>
                  <span className="date-in-day">{fifthFlightDate.departure.day}</span> {fifthFlightDate.departure.month}, {fifthFlightDate.departure.year}
                  <div className="time">{fifthFlightDate.departure.time} {fifthFlightDate.departure.timezone}</div>
                </div>
                <i aria-hidden="true" className="fa fa-long-arrow-right" />
                <div>
                  <span className="date-out-day">{fifthFlightDate.arrival.day}</span> {fifthFlightDate.arrival.month}, {fifthFlightDate.arrival.year}
                  <div className="time">{fifthFlightDate.arrival.time} {fifthFlightDate.arrival.timezone}</div>
                </div>
              </div>}
            </div>
          </div>
          <div className="flex-row-child tickets-actions">
            <div className="content-row">
              <div>
                <button className="link" onClick={this.getDetails}>Details</button>
              </div>
            </div>
          </div>
          <div className="flex-row-child tickets-status">
            <span className="status">{this.getStatus(ticket.status)}</span>
          </div>
          <ProfileFlexContainer styleClass={`flex-container-details ${this.props.styleClass}`}>
            <div className="flex-row-child details">
              <div>
                <span className="pnr">PNR: {ticket.details.pnr || 'N/A'}</span>
              </div>
              <div>
                <span className="booked-date">Booked date: {bookedDate}</span>
              </div>
            </div>
          </ProfileFlexContainer>
        </ProfileFlexContainer>
      </Fragment>
    );
  }
}

AirTicket.propTypes = {
  ticket: PropTypes.object,
  styleClass: PropTypes.string
};

export default AirTicket;
