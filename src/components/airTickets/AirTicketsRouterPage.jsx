import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import HomePage from '../home/HomePage';
import AirTicketsSearchPage from './search/AirTicketsSearchPage';
import AirTicketsInitBookingRouterPage from './initBook/AirTicketsInitBookingRouterPage';
import AirTicketsBookingConfirmPage from './book/AirTicketsBookingConfirmPage';

function AirTicketsRouterPage(props) {
  return (
    <Fragment>
      <Switch>
        <Route exact path="/tickets" render={() => <HomePage homePage="tickets" listings={props.listings} hotels={props.hotels} />} />
        <Route exact path="/tickets/results" render={() => <AirTicketsSearchPage />} />
        <Route path="/tickets/results/initBook/:id" render={() => <AirTicketsInitBookingRouterPage />} />
        <Route exact path="/tickets/results/book/:id" render={() => <AirTicketsBookingConfirmPage />} />
      </Switch>
    </Fragment>
  );
}

AirTicketsRouterPage.propTypes = {
  listings: PropTypes.array,
  hotels: PropTypes.array
};

export default AirTicketsRouterPage;
