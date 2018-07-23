import { getMyReservations, getMyTrips, getMyHotelBookings } from '../../../requester';

import DashboardPending from './DashboardPending';
import React from 'react';
import moment from 'moment';
import { Config } from '../../../config';

class DashboardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reservations: null,
      totalReservations: 0,
      loading: true,
      trips: null
    };
  }

  componentDidMount() {
    getMyReservations('?page=0').then((dataReservations) => {
      getMyTrips('?page=0').then((dataHomeTrips) => {
        getMyHotelBookings().then((dataHotelTrips) => {
          const homeTrips = dataHomeTrips.content.map(trip => {
            return {
              ...trip,
              sortDate: moment(new Date(trip.startDate)).utc().valueOf(),
              displayStartDate: moment(new Date(trip.startDate)).format('DD MMM, YYYY'),
              displayEndDate: moment(new Date(trip.endDate)).format('DD MMM, YYYY'),
              status: trip.accepted ? 'ACCEPTED' : 'PENDING'
            };
          });

          const hotelTrips = dataHotelTrips.content.map(trip => {
            return {
              ...trip,
              sortDate: moment(trip.arrival_date, 'YYYY-MM-DD').utc().valueOf(),
              displayStartDate: moment(trip.arrival_date, 'YYYY-MM-DD').format('DD MMM, YYYY'),
              displayEndDate: moment(trip.arrival_date, 'YYYY-MM-DD').add(trip.nights, 'days').format('DD MMM, YYYY'),
              userImage: trip.hotel_photo ? JSON.parse(trip.hotel_photo).original : Config.getValue('imgHost') + 'users/images/default.png',
              hostName: trip.hotel_name
            };
          });

          const trips = homeTrips.concat(hotelTrips).sort((x, y) => {
            return x.sortDate >= y.sortDate ? -1 : 1;
          }).slice(0, 5);

          this.setState({
            trips: trips,
            loading: false,
            reservations: dataReservations.content
          });
        });
      });
    });
  }

  render() {
    return (
      <div>
        {this.state.loading ?
          <div className="loader"></div> :
          <DashboardPending reservations={this.state.reservations} trips={this.state.trips} hotel />
        }
        <br />
      </div>
    );
  }
}

export default DashboardPage;