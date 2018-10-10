import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import HomePage from '../home/HomePage';
import AirTicketsSearchPage from './search/AirTicketsSearchPage';

function AirTicketsRouterPage(props) {
  return (
    <Fragment>
      <Switch>
        <Route exact path="/tickets" render={() => <HomePage homePage="tickets" listings={props.listings} hotels={props.hotels} />} />
        <Route exact path="/tickets/results" render={() => <AirTicketsSearchPage />} />
      </Switch>
    </Fragment>
  );
}

AirTicketsRouterPage.propTypes = {
  listings: PropTypes.array,
  hotels: PropTypes.array
};

export default AirTicketsRouterPage;
