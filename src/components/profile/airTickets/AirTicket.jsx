import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import ProfileFlexContainer from '../flexContainer/ProfileFlexContainer';

class AirTicket extends Component {
  extractDatesData(segments) {
    const startDateMoment = moment(segments[0].origin.date).utc();
    const endDateMoment = moment(segments[segments.length - 1].destination.date).utc();

    const departure = {
      day: startDateMoment.format('D'),
      year: startDateMoment.format('YYYY'),
      month: startDateMoment.format('MMM').toLowerCase(),
      time: segments[0].origin.time,
      timezone: segments[0].origin.timezone
    };

    const arrival = {
      day: endDateMoment.format('D'),
      year: endDateMoment.format('YYYY'),
      month: endDateMoment.format('MMM').toLowerCase(),
      time: segments[segments.length - 1].origin.time,
      timezone: segments[segments.length - 1].origin.timezone
    };

    return { departure, arrival };
  }

  getDepartureAirports(airports) {
    let middleStopsBulets = [];
    for (let i = 0; i < airports.length - 1; i++) {
      middleStopsBulets.push(
        <Fragment key={i}>
          <div key={i} className="bulet-container"><span className="bulet"></span></div>
          <hr className="line" />
          <div className="middle-stop" style={{ left: `${(i * 60) + 45}px` }}>
            {airports[i].destination.code}
            <div className="tooltip-content">
              <div>Transfer</div>
              <hr />
              <div>{airports[i].destination.name} ({airports[i].destination.code})</div>
            </div>
          </div>
        </Fragment>
      );
    }

    return (
      <div className="item flight-stops">
        <div className="stop">
          {airports[0].origin.code}
          <div className="tooltip-content">
            <div>Departure</div>
            <hr />
            <div>{airports[0].origin.name} ({airports[0].origin.code})</div>
          </div>
        </div>
        <div className="stops-container horizontal">
          <div className="bulet-container"><span className="bulet"></span></div>
          <hr className="line" />
          {airports.length === 1 ? null : middleStopsBulets}
          <div className="bulet-container"><span className="bulet"></span></div>
        </div>
        <div className="stop">
          {airports[airports.length - 1].destination.code}
          <div className="tooltip-content">
            <div>Arrival</div>
            <hr />
            <div>{airports[airports.length - 1].destination.name} ({airports[airports.length - 1].destination.code})</div>
          </div>
        </div>
      </div>
    );
  }

  getReturnAirports(airports) {
    let middleStopsBulets = [];
    for (let i = 0; i < airports.length - 1; i++) {
      middleStopsBulets.push(
        <Fragment key={i}>
          <div key={i} className="bulet-container"><span className="bulet"></span></div>
          <hr className="line" />
          <div className="middle-stop" style={{ left: `${(i * 60) + 45}px` }} tooltip={airports[i].destination.name}>{airports[i].destination.code}</div>
        </Fragment>
      );
    }

    return (
      <div className="item flight-stops">
        <div className="stop" tooltip={airports[0].origin.name}>{airports[0].origin.code}</div>
        <div className="stops-container horizontal">
          <div className="bulet-container"><span className="bulet"></span></div>
          <hr className="line" />
          {airports.length === 1 ? null : middleStopsBulets}
          <div className="bulet-container"><span className="bulet"></span></div>
        </div>
        <div className="stop" tooltip={airports[airports.length - 1].destination.name}>{airports[airports.length - 1].destination.code}</div>
        <span tooltip={airports[airports.length - 1].destination.name}></span>
      </div>
    );
  }

  render() {
    const { ticket } = this.props;

    // console.log(ticket);

    const flightInfo = ticket.entities[0];
    const departureSegments = flightInfo.segments.filter(s => s.group === '0');
    const returnSegments = flightInfo.segments.filter(s => s.group === '1');
    const departureDate = this.extractDatesData(departureSegments);
    let returnDate;
    if (returnSegments.length > 0) {
      returnDate = this.extractDatesData(returnSegments);
    }

    console.log(flightInfo);

    return (
      <Fragment>
        <ProfileFlexContainer styleClass={`flex-container-row ${this.props.styleClass}`}>
          <div className="flex-row-child tickets-image">
            <i className="fa fa-plane"></i>
          </div>
          <div className="flex-row-child tickets-airports">
            <div className="content-row">
              {this.getDepartureAirports(departureSegments)}
            </div>
            {returnSegments.length > 0 &&
              <div className="content-row">
                {this.getReturnAirports(returnSegments)}
              </div>}
          </div>
          <div className="flex-row-child tickets-dates">
            <div className="content-row">
              <div className="departure-dates">
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
            {returnSegments.length > 0 &&
              <div className="content-row">
                <div>
                  <span className="date-in-day">{returnDate.departure.day}</span> {returnDate.departure.month}, {returnDate.departure.year}
                  <div className="time">{returnDate.departure.time} {returnDate.departure.timezone}</div>
                </div>
                <i aria-hidden="true" className="fa fa-long-arrow-right" />
                <div>
                  <span className="date-out-day">{returnDate.arrival.day}</span> {returnDate.arrival.month}, {returnDate.arrival.year}
                  <div className="time">{returnDate.arrival.time} {returnDate.arrival.timezone}</div>
                </div>
              </div>}
          </div>
          <div className="flex-row-child tickets-actions">
            <div className="content-row">
              <Link to=" #">Pay</Link>
              {/* {isCompleted &&
                <button type="submit" onClick={e => { e.preventDefault(); this.props.onTripSelect(this.props.trip.id); this.props.handleCancelReservation(); }}>Cancel Trip</button>
              } */}
              {/* {this.props.trip.has_details === 1 && <Link to={`/profile/trips/hotels/${this.props.trip.id}`}>Details</Link>} */}
            </div>
          </div>
          <div className="flex-row-child tickets-status">
            <span className="status">{flightInfo.properties.status.booking}</span>
            {/* {this.props.trip.status &&
              <span className="status">{status}</span>
            }
            {this.props.trip.status &&
              <span className="icon-question" tooltip={this.props.trip.error ? this.props.trip.error : statusMessage}></span>
            }
            {this.props.trip.status && this.props.trip.status.toUpperCase() === 'DONE' &&
              <div>Reference No.: {this.props.trip.booking_id}</div>
            } */}
          </div>
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
