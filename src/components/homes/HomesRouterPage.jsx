import { Route, Switch } from 'react-router-dom';

import PropTypes from 'prop-types';
import React from 'react';
import HomePage from '../home/HomePage';
import HomesSearchPage from './search/HomesSearchPage';
import HomeDetailsPage from './details/HomeDetailsPage';
import HomesBookingPage from './booking/HomesBookingPage';

function HomesRouterPage(props) {
  return (
    <div>
      <Switch>
        <Route exact path="/homes" render={() => <HomePage homePage="homes" listings={props.listings} hotels={props.hotels} />} />
        <Route exact path="/homes/listings" render={() => <HomesSearchPage />} />
        <Route exact path="/homes/listings/:id" render={() => <HomeDetailsPage />} />
        <Route path="/homes/listings/book/:id" render={() => <HomesBookingPage />} />
      </Switch>
    </div>
  );
}

HomesRouterPage.propTypes = {
  listings: PropTypes.array,
  hotels: PropTypes.array,

  location: PropTypes.object,
  history: PropTypes.object,
};

export default HomesRouterPage;
