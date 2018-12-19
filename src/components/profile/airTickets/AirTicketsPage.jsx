import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// import { NotificationManager } from 'react-notifications';
import PropTypes from 'prop-types';
import Pagination from '../../common/pagination/Pagination';
import AirTicketsList from './AirTicketsList';
import { Config } from '../../../config';
// import { LONG } from '../../../constants/notificationDisplayTimes';

class AirTicketsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tickets: [],
      loading: true,
      currentPage: 0
    };

    this.onPageChange = this.onPageChange.bind(this);
  }

  componentDidMount() {
    fetch(`${Config.getValue('apiHost')}flight/dashboard`, {
      headers: {
        'Authorization': localStorage[Config.getValue('domainPrefix') + '.auth.locktrip']
      }
    })
      .then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            let tickets = [];

            data.reverse().forEach((ticket) => {
              tickets.push({
                segments: JSON.parse(ticket.dashboardViews),
                deadline: ticket.deadline,
                status: ticket.status,
                flightId: ticket.flightId,
                reservationId: ticket.reservationId
              });
            });

            this.setState({
              tickets,
              loading: false
            });
            // if (data.success === false) {
            //   this.searchAirTickets(this.props.location.search);
            //   NotificationManager.warning(data.message, '', LONG);
            // } else {
            //   this.setState({
            //     bookingDetails: data
            //   });
            // }
          });
        } else {
          console.log(res);
        }
      });
  }

  onPageChange() {

  }

  render() {
    const { loading, tickets, currentPage } = this.state;

    if (loading) {
      return <div className="loader"></div>;
    }

    return (
      <Fragment>
        <section>
          <h2>Latest Tickets</h2>
          <AirTicketsList
            tickets={tickets}
          />
          <Pagination
            loading={loading}
            onPageChange={this.onPageChange}
            currentPage={currentPage}
            totalElements={tickets.length}
          />
        </section>
      </Fragment>
    );
  }
}

AirTicketsPage.propTypes = {
  // Router props
  match: PropTypes.object,
  location: PropTypes.object
};

export default withRouter(connect()(AirTicketsPage));
