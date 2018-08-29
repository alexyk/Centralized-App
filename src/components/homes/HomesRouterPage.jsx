import { Route, Switch } from 'react-router-dom';

import PropTypes from 'prop-types';
import React from 'react';
import HomesHomePage from './HomesHomePage';
import HomesSearchPage from './search/HomesSearchPage';
import HomeDetailsPage from './details/HomeDetailsPage';
import HomesBookingPage from './booking/HomesBookingPage';
import requester from '../../initDependencies';

class HomesRouterPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      countries: undefined
    };
  }

  componentDidMount() {
    requester.getCountries().then(res => {
      res.body.then(data => {
        this.setState({ countries: data });
      });
    });
  }

  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/homes" render={() => <HomesHomePage countries={this.state.countries} />} />
          <Route exact path="/homes/listings" render={() => <HomesSearchPage countries={this.state.countries} />} />
          <Route exact path="/homes/listings/booking" render={() => <HomesBookingPage countries={this.state.countries} />} />
          <Route exact path="/homes/listings/:id" render={() => <HomeDetailsPage countries={this.state.countries} />} />
        </Switch>
      </div>
    );
  }
}

HomesRouterPage.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
};

export default HomesRouterPage;
