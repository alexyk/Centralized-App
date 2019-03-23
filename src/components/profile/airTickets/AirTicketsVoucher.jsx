import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Config } from '../../../config';
import { LONG } from '../../../constants/notificationDisplayTimes';
import Plane from '../../../styles/images/plane-illustrator-flight-details.png';

import '../../../styles/css/components/profile/airTickets/air-tickets-voucher.css';

class AirTicketsVoucher extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ticketDetails: ''
    };
  }

  componentDidMount() {
    // fetch(`${Config.getValue('apiHost')}flight/bookings/ticket?refId=${this.props.match.params.id}`)
    //   .then((res) => {
    //     if (res.ok) {
    //       res.json().then((data) => {
    //         if (data.success === false) {
    //           this.props.history.push('/profile/flights');
    //           NotificationManager.warning(data.message, '', LONG);
    //         } else {
    //           data.fullResponse = JSON.parse(data.fullResponse);
    //           this.setState({
    //             ticketDetails: data
    //           });
    //         }
    //       });
    //     } else {
    //       console.log(res);
    //     }
    //   });
  }

  extractDatesData(segments) {
    const startDateMoment = moment(segments[0].origin.date).utc();
    const endDateMoment = moment(segments[segments.length - 1].destination.date).utc();

    const departure = {
      day: startDateMoment.format('D'),
      dayOfWeekName: startDateMoment.format('ddd'),
      year: startDateMoment.format('YYYY'),
      month: startDateMoment.format('MMM'),
      time: segments[0].origin.time
    };

    const arrival = {
      day: endDateMoment.format('D'),
      dayOfWeekName: endDateMoment.format('ddd'),
      year: endDateMoment.format('YYYY'),
      month: endDateMoment.format('MMM'),
      time: segments[segments.length - 1].origin.time
    };

    return { departure, arrival };
  }

  render() {
    const { ticketDetails } = this.state;

    if (!ticketDetails) {
      return <div className="loader"></div>;
    }

    const departureInfo = ticketDetails.segments.filter(s => s.group === '0');
    const returnInfo = ticketDetails.segments.filter(s => s.group === '1');
    const departureInfoDateTime = this.extractDatesData(departureInfo);
    const returnInfoDateTime = this.extractDatesData(returnInfo);

    return (
      <div className="ticket-details">
        <section className="flight-info">
          <div className="flight-info-plane">
            <img src={Plane} alt="plane" />
          </div>
          <div className="flight-info-content">
            <section className="segments">
              <div className="segments-item">
                <h5>Departure</h5>
                <div className="departure-info">
                  <div className="destinations">
                    {departureInfo[0].origin.name} ({departureInfo[0].origin.code}) <span className="icon-arrow-right"></span> {departureInfo[departureInfo.length - 1].destination.name} ({departureInfo[departureInfo.length - 1].destination.name})
                  </div>
                  <div className="date-time">
                    <div className="date-time-item">
                      <div className="date">
                        <span className="date-in-day">{departureInfoDateTime.departure.day}</span> {departureInfoDateTime.departure.month}, {departureInfoDateTime.departure.dayOfWeekName}, {departureInfoDateTime.departure.year}
                      </div>
                      <div className="time">
                        {departureInfoDateTime.departure.time}
                      </div>
                    </div>
                    <div className="date-time-item">
                      <div className="date">
                        <span className="date-out-day">{departureInfoDateTime.arrival.day}</span> {departureInfoDateTime.arrival.month}, {departureInfoDateTime.arrival.dayOfWeekName}, {departureInfoDateTime.arrival.year}
                      </div>
                      <div className="time">
                        {departureInfoDateTime.arrival.time}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {returnInfo.length > 0 &&
                <div className="segments-item">
                  <h5>{'Return'}</h5>
                  <div className="return-info">
                    <div className="destinations">
                      {returnInfo[0].origin.name} ({returnInfo[0].origin.code}) <span className="icon-arrow-right"></span> {returnInfo[returnInfo.length - 1].destination.name} ({returnInfo[returnInfo.length - 1].destination.name})
                    </div>
                    <div className="date-time">
                      <div className="date-time-item">
                        <div className="date">
                          <span className="date-in-day">{returnInfoDateTime.departure.day}</span> {returnInfoDateTime.departure.month}, {returnInfoDateTime.departure.dayOfWeekName}, {returnInfoDateTime.departure.year}
                        </div>
                        <div className="time">
                          {returnInfoDateTime.departure.time}
                        </div>
                      </div>
                      <div className="date-time-item">
                        <div className="date">
                          <span className="date-out-day">{returnInfoDateTime.arrival.day}</span> {returnInfoDateTime.arrival.month}, {returnInfoDateTime.arrival.dayOfWeekName}, {returnInfoDateTime.arrival.year}
                        </div>
                        <div className="time">
                          {returnInfoDateTime.arrival.time}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>}
            </section>
            <div className="toggle-details">
              <div>View trip details</div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

AirTicketsVoucher.propTypes = {
  // Router props
  match: PropTypes.object,
  history: PropTypes.object
};

export default withRouter(connect()(AirTicketsVoucher));
