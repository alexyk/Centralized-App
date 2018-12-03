import { Route, Switch } from 'react-router-dom';

import PropTypes from 'prop-types';
import React from 'react';
import HomesSearchPage from './search/HomesSearchPage';
import HomeDetailsRouterPage from './details/HomeDetailsRouterPage';

function HomesRouterPage() {
  return (
    <div>
      <Switch>
        <Route exact path="/homes/listings" render={() => <HomesSearchPage />} />
        <Route path="/homes/listings/:id" render={() => <HomeDetailsRouterPage />} />
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
