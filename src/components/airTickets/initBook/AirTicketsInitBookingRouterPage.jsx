import React, { Component, Fragment } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import AirTicketsDetailsPage from './details/AirTicketsDetailsPage';
import AirTicketsBookingProfileRouterPage from './book/AirTicketsBookingProfileRouterPage';
import { Config } from '../../../config';

class AirTicketsRouterPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: null,
      fareRules: null
    };

    this.searchAirTickets = this.searchAirTickets.bind(this);
    this.requestSelectFlight = this.requestSelectFlight.bind(this);
    this.requestFareRules = this.requestFareRules.bind(this);
  }

  componentDidMount() {
    this.requestSelectFlight();
    this.requestFareRules();
  }

  requestSelectFlight() {
    fetch(`${Config.getValue('apiHost')}flight/selectFlight?flightId=${this.props.match.params.id}`)
      .then(res => {
        if (res.ok) {
          res.json().then((data) => {
            this.setState({
              result: data
            });
          });
        } else {
          this.searchAirTickets(this.props.location.search);
        }
      });
  }

  requestFareRules() {
    fetch(`${Config.getValue('apiHost')}flight/fareRules?flightId=${this.props.match.params.id}`)
      .then(res => {
        if (res.ok) {
          res.json().then((data) => {
            this.setState({
              fareRules: data
            });
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
    const { result, fareRules } = this.state;

    return (
      <Fragment>
        <Switch>
          <Route exact path="/tickets/results/:id/details" render={() => <AirTicketsDetailsPage result={result} fareRules={fareRules} />} />
          <Route path="/tickets/results/:id/profile" render={() => <AirTicketsBookingProfileRouterPage result={result} />} />
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
