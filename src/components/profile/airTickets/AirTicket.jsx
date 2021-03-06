import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import ProfileFlexContainer from '../flexContainer/ProfileFlexContainer';
import PlaneIcon from '../../../styles/images/plane-icon.png';

const STATUS = ['PENDING', 'PREPARE'];

// const STATUS_LAST = {
//   DONE: "DONE",
//   FINALIZE: "RESERVATION",
//   FAILED: "FAILED",
//   FAILED_PAYMENT_WITH_LOC : "UNSUCCESSFUL",
//   SUCCESS_PAYMENT_WITH_LOC: "PENDING",
//   PAYMENT_PROCESSOR_FOR_REVIEW: "REVIEW",
//   PENDING_PAYMENT_PROCESSOR_CONFIRMATION: "PENDING",
//   PAYMENT_PROCESSOR_FAILED: "UNSUCCESSFUL",
//   PAYMENT_PROCESSOR_CONFIRMED: "PENDING",
//
// };
const STATUS_LAST = {
  PAYMENT_PROCESSOR_CONFIRMED: "PAID",
  PAYMENT_PROCESSOR_FAILED: "PAYMENT FAILED",
  PAYMENT_PROCESSOR_FOR_REVIEW: "REVIEW",
  PAYMENT_PROCESSOR_REJECTED: "PAYMENT REJECTED",
  SUCCESS_PAYMENT_WITH_LOC: "PAID",
  FAILED_PAYMENT_WITH_LOC: "PAYMENT FAILED",
  FAILED: "BOOKING FAILED",
  FINALIZE: "RESERVATION",
  DONE: "DONE",
  PENDING_CANCELLATION: "PENDING CANCELLATION",
  CANCELLED: "CANCELLED",
  CANCELLATION_REJECTED: "CANCELLATION REJECTED",
  CANCELLATION_FAILED: "CANCELLATION FAILED",
  PENDING_REFUND: "PENDING REFUND",
  REFUNDED: "REFUNDED",
  NON_REFUNDABLE: "NON-REFUNDABLE",
  FAILED_REFUND: "REFUND FAILED"
};

const STATUS_TOOLTIP = {
  PAYMENT_PROCESSOR_CONFIRMED: "You have successfully paid and are now waiting booking confirmation.",
  PAYMENT_PROCESSOR_FAILED: "Your Credit Card payment was not successful.",
  PAYMENT_PROCESSOR_FOR_REVIEW: "Credit Card payment is under review.",
  PAYMENT_PROCESSOR_REJECTED: "You have failed verification. For more info contact support.",
  SUCCESS_PAYMENT_WITH_LOC: "You have successfully paid and are now waiting booking confirmation.",
  FAILED_PAYMENT_WITH_LOC: "Payment failed. Check mail for instructions or contact us.",
  FAILED: "Flight booking failed. Check mail for instructions or contact us.",
  FINALIZE: "Your flight booking has been confirmed. Waiting for e-ticket.",
  DONE: "Your e-ticket was issued",
  PENDING_CANCELLATION: "Your cancellation request is being processed.",
  CANCELLED: "Your reservation has been cancelled.",
  CANCELLATION_REJECTED: "This flight cannot be cancelled. Consult the Fare Rules.",
  CANCELLATION_FAILED: "Cancellation is not possible at this time. Contact support.",
  PENDING_REFUND: "The refund procedure has been initiated. Monitor your status.",
  REFUNDED: "Your flight booking was successfully refunded.",
  NON_REFUNDABLE: "This booking is non-refundable. For more info contact support.",
  FAILED_REFUND: "We encountered an error processing the refund."
};


class AirTicket extends Component {
  extractDatesData(segments) {
    const startDateMoment = moment(segments[0].originDate);
    const endDateMoment = moment(segments[segments.length - 1].destinationDate);

    const departure = {
      day: startDateMoment.format('D'),
      year: startDateMoment.format('YYYY'),
      month: startDateMoment.format('MMM'),
      time: segments[0].originTime,
    };

    const arrival = {
      day: endDateMoment.format('D'),
      year: endDateMoment.format('YYYY'),
      month: endDateMoment.format('MMM'),
      time: segments[segments.length - 1].destinationTime,
    };

    return {departure, arrival};
  }

  getDepartureAirports(airports) {
    let middleStopsBulets = [];
    const buletIndex = 180 / airports.length;
    for (let i = 0; i < airports.length - 1; i++) {
      middleStopsBulets.push(
        <Fragment key={i}>
          <div key={i} className="bulet-container" style={{left: `${((i + 1) * buletIndex) + 8}px`}}><span
            className="bulet"></span></div>
          <div className="middle-stop" style={{left: `${(((i + 1) * buletIndex) + 8) - 11}px`}}>
            {airports[i].destination}
            <div className="tooltip-content">
              <div>Transfer</div>
              <hr/>
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
            <hr/>
            <div>{airports[0].originName}</div>
          </div>
        </div>
        <div className="stops-container horizontal">
          <div className="bulet-container"><span className="bulet"></span></div>
          <hr className="line"/>
          {airports.length === 1 ? null : middleStopsBulets}
          <div className="bulet-container" style={{left: '180px'}}><span className="bulet"></span></div>
        </div>
        <div className="stop">
          {airports[airports.length - 1].destination}
          <div className="tooltip-content">
            <div>Arrival</div>
            <hr/>
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
          <div key={i} className="bulet-container" style={{left: `${((i + 1) * buletIndex) + 8}px`}}><span
            className="bulet"></span></div>
          <div className="middle-stop" style={{left: `${(((i + 1) * buletIndex) + 8) - 11}px`}}>
            {airports[i].destination}
            <div className="tooltip-content">
              <div>Transfer</div>
              <hr/>
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
            <hr/>
            <div>{airports[0].originName}</div>
          </div>
        </div>
        <div className="stops-container horizontal">
          <div className="bulet-container"><span className="bulet"></span></div>
          <hr className="line"/>
          {airports.length === 1 ? null : middleStopsBulets}
          <div className="bulet-container" style={{left: '180px'}}><span className="bulet"></span></div>
        </div>
        <div className="stop">
          {airports[airports.length - 1].destination}
          <div className="tooltip-content">
            <div>Arrival</div>
            <hr/>
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

    // const statusPreview = status.split('_').join(' ');
    // let statusName = '';
    //
    // if (STATUS.indexOf(statusPreview[0])) {
    //   statusName = 'PENDING';
    // } else if (statusName[0] === 'FAILED') {
    //   statusName = 'FAILED';
    // } else {
    //   statusName = 'DONE';
    // }
    //
    // return statusName;
    return STATUS_LAST[status];
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
    const {ticket} = this.props;
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

    const statusMessage = STATUS_TOOLTIP[this.props.ticket.status];

    return (
      <Fragment>
        <ProfileFlexContainer styleClass={`flex-container-row ${this.props.styleClass}`}>
          <div className="flex-row-child tickets-image">
            <img src={PlaneIcon} alt="plane"/>
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
                    <span
                      className="date-in-day">{departureDate.departure.day}</span> {departureDate.departure.month}, {departureDate.departure.year}
                    <div className="time">{departureDate.departure.time}</div>
                  </div>
                  <i aria-hidden="true" className="fa fa-long-arrow-right"/>
                  <div>
                    <span
                      className="date-out-day">{departureDate.arrival.day}</span> {departureDate.arrival.month}, {departureDate.arrival.year}
                    <div className="time">{departureDate.arrival.time}</div>
                  </div>
                </div>
              </div>
              {secondFlight.length > 0 &&
              <div className="content-row">
                <div>
                  <span
                    className="date-in-day">{secondFlightDate.departure.day}</span> {secondFlightDate.departure.month}, {secondFlightDate.departure.year}
                  <div className="time">{secondFlightDate.departure.time}</div>
                </div>
                <i aria-hidden="true" className="fa fa-long-arrow-right"/>
                <div>
                  <span
                    className="date-out-day">{secondFlightDate.arrival.day}</span> {secondFlightDate.arrival.month}, {secondFlightDate.arrival.year}
                  <div className="time">{secondFlightDate.arrival.time}</div>
                </div>
              </div>}
              {thirdFlight.length > 0 &&
              <div className="content-row">
                <div>
                  <span
                    className="date-in-day">{thirdFlightDate.departure.day}</span> {thirdFlightDate.departure.month}, {thirdFlightDate.departure.year}
                  <div className="time">{thirdFlightDate.departure.time}</div>
                </div>
                <i aria-hidden="true" className="fa fa-long-arrow-right"/>
                <div>
                  <span
                    className="date-out-day">{thirdFlightDate.arrival.day}</span> {thirdFlightDate.arrival.month}, {thirdFlightDate.arrival.year}
                  <div className="time">{thirdFlightDate.arrival.time}</div>
                </div>
              </div>}
              {fourthFlight.length > 0 &&
              <div className="content-row">
                <div>
                  <span
                    className="date-in-day">{fourthFlightDate.departure.day}</span> {fourthFlightDate.departure.month}, {fourthFlightDate.departure.year}
                  <div className="time">{fourthFlightDate.departure.time}</div>
                </div>
                <i aria-hidden="true" className="fa fa-long-arrow-right"/>
                <div>
                  <span
                    className="date-out-day">{fourthFlightDate.arrival.day}</span> {fourthFlightDate.arrival.month}, {fourthFlightDate.arrival.year}
                  <div className="time">{fourthFlightDate.arrival.time}</div>
                </div>
              </div>}
              {fifthFlight.length > 0 &&
              <div className="content-row">
                <div>
                  <span
                    className="date-in-day">{fifthFlightDate.departure.day}</span> {fifthFlightDate.departure.month}, {fifthFlightDate.departure.year}
                  <div className="time">{fifthFlightDate.departure.time}</div>
                </div>
                <i aria-hidden="true" className="fa fa-long-arrow-right"/>
                <div>
                  <span
                    className="date-out-day">{fifthFlightDate.arrival.day}</span> {fifthFlightDate.arrival.month}, {fifthFlightDate.arrival.year}
                  <div className="time">{fifthFlightDate.arrival.time}</div>
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
            <div className="content-row">
              <div>
                <span className="status">{this.getStatus(ticket.status)} </span>
                {ticket.status && (
                  <span
                    className="icon-question"
                    tooltip={statusMessage}
                  />
                )}
              </div>
              {ticket.status && ticket.details.pnr && (ticket.status.toUpperCase() === "DONE" || ticket.status.toUpperCase() === "FINALIZE") && (
                <div><span>PNR.: </span><span>{ticket.details.pnr}</span></div>
              )}
            </div>
          </div>
          <ProfileFlexContainer styleClass={`flex-container-details ${this.props.styleClass}`}>
            <div className="flex-row-child details">
              <div>
                <span className="pnr">PNR: {ticket.details.pnr || 'N/A'}</span>
              </div>
              {ticket.details.isLowCost && (
                <div>
                  <span className="is-low-cost">LockTrip does not issue low-cost E-tickets. Visit the website of the airline and use your Reservation number (PNR) to complete the process.</span>
                </div>
              )}
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
