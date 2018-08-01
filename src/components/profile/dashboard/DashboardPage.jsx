import { Config } from '../../../config';
import DashboardPending from './DashboardPending';
import React from 'react';
import moment from 'moment';
import requester from '../../../initDependencies';

class DashboardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reservations: null,
      totalReservations: 0,
      loading: true,
      trips: []
    };
  }

  componentDidMount() {
    requester.getMyReservations(['page=0']).then((resReservations) => {
      resReservations.body.then(dataReservations => {
        requester.getMyTrips(['page=0']).then((resHomeTrips) => {
          resHomeTrips.body.then(dataHomeTrips => {
            requester.getMyHotelBookings().then((resHotelTrips) => {
              resHotelTrips.body.then(dataHotelTrips => {
                const homeTrips = dataHomeTrips.content.map(trip => {
                  console.log(trip.startDate);
                  return {
                    ...trip,
                    sortDate: moment(trip.startDate).utc().valueOf(),
                    displayStartDate: moment(trip.startDate).format('DD MMM, YYYY'),
                    displayEndDate: moment(trip.endDate).format('DD MMM, YYYY'),
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

                console.log(trips);

                this.setState({
                  trips: trips,
                  loading: false,
                  reservations: dataReservations.content
                });
              });
            });
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
