import React, { Component, Fragment } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import PropTypes from 'prop-types';
import AirTicketsDetailsPage from './details/AirTicketsDetailsPage';
import AirTicketsBookingProfileRouterPage from './bookProfile/AirTicketsBookingProfileRouterPage';
import { Config } from '../../../config';
import { LONG } from '../../../constants/notificationDisplayTimes';

class AirTicketsRouterPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: null
    };

    this.searchAirTickets = this.searchAirTickets.bind(this);
    this.requestSelectFlight = this.requestSelectFlight.bind(this);
  }

  componentDidMount() {
    this.requestSelectFlight();
  }

  requestSelectFlight() {
    fetch(`${Config.getValue('apiHost')}flight/selectFlight?flightId=${this.props.match.params.id}`)
      .then(res => {
        if (res.ok) {
          res.json().then((data) => {
            if (data.success === false) {
              NotificationManager.warning(data.message, '', LONG);
              this.searchAirTickets(this.props.location.search);
            } else {
              this.setState({
                result: data
              });
            }
          });
        } else {
          this.searchAirTickets(this.props.location.search);
        }
      });
  }

  searchAirTickets(queryString) {
    this.props.history.push('/tickets/results' + queryString);
  }

  render() {
    const { result } = this.state;

    return (
      <Fragment>
        <Switch>
          <Route exact path="/tickets/results/initBook/:id/details" render={() => <AirTicketsDetailsPage result={result} />} />
          <Route path="/tickets/results/initBook/:id/profile" render={() => <AirTicketsBookingProfileRouterPage result={result} />} />
        </Switch>
      </Fragment>
    );
  }
}

AirTicketsRouterPage.propTypes = {
  // Router props
  match: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object
};

export default withRouter(AirTicketsRouterPage);
