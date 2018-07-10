import DashboardPending from './DashboardPending';
import React from 'react';
import requester from '../../../initDependencies';

export default class DashboardPage extends React.Component {
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
    requester.getMyReservations(['page=0']).then(res => {
      res.body.then(dataReservations => {
        requester.getMyTrips(['page=0']).then(res => {
          res.body.then(dataTrips => {
            this.setState({
              trips: dataTrips.content,
              loading: false,
              reservations: dataReservations.content,
              totalReservations: dataReservations.totalElements
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
          <DashboardPending reservations={this.state.reservations} trips={this.state.trips}
            totalReservations={this.state.totalReservations} />
        }
        <br />
      </div>
    );
  }
}