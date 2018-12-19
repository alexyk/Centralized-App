import React, { Component, Fragment } from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import PropTypes from 'prop-types';
import AirTicketsSearchPage from './search/AirTicketsSearchPage';
import AirTicketsBookingRouterPage from './book/AirTicketsBookingRouterPage';
import { LONG } from '../../constants/notificationDisplayTimes';
import { SEARCH_EXPIRED } from '../../constants/infoMessages';

class AirTicketsRouterPage extends Component {
  constructor(props) {
    super(props);

    this.searchAirTicketsSetTimeout = null;

    this.initSearchAirTicketsSetTimeout = this.initSearchAirTicketsSetTimeout.bind(this);
    this.clearTimeouts = this.clearTimeouts.bind(this);
  }

  componentWillUnmount() {
    this.clearTimeouts();
  }

  clearTimeouts() {
    if (this.searchAirTicketsSetTimeout) {
      clearTimeout(this.searchAirTicketsSetTimeout);
    }
  }

  initSearchAirTicketsSetTimeout(initAirTicketsSearchPage) {
    if (!this.searchAirTicketsInterval) {
      initAirTicketsSearchPage();
      this.searchAirTicketsSetTimeout = setTimeout(() => {
        this.props.history.push(`/tickets/results${this.props.location.search}`);
        NotificationManager.warning(SEARCH_EXPIRED, '', LONG);
        this.clearTimeouts();
        this.initSearchAirTicketsSetTimeout(initAirTicketsSearchPage);
      }, 29 * 60000);
    }
  }
  
  render() {
    return (
      <Fragment>
        <Switch>
          <Route exact path="/tickets/results" render={() => <AirTicketsSearchPage initSearchAirTicketsSetTimeout={this.initSearchAirTicketsSetTimeout} />} />
          <Route path="/tickets/results/initBook/:id" render={() => <AirTicketsBookingRouterPage />} />
        </Switch>
      </Fragment>
    );
  }
}

AirTicketsRouterPage.propTypes = {
  listings: PropTypes.array,
  hotels: PropTypes.array,

  // Router props
  history: PropTypes.object,
  location: PropTypes.object
};

export default withRouter(AirTicketsRouterPage);
