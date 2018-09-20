import { Route, Switch } from 'react-router-dom';

import PropTypes from 'prop-types';
import React from 'react';
import HomePage from '../home/HomePage';
import HomesSearchPage from './search/HomesSearchPage';
import HomeDetailsPage from './details/HomeDetailsPage';
import requester from '../../requester';
import HomesBookingRouterPage from './booking/HomesBookingRouterPage';

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
          <Route exact path="/homes" render={() => <HomePage homePage="homes" listings={this.props.listings} hotels={this.props.hotels} />} />
          <Route exact path="/homes/listings" render={() => <HomesSearchPage countries={this.state.countries} />} />
          <Route exact path="/homes/listings/:id" render={() => <HomeDetailsPage countries={this.state.countries} />} />
          <Route path="/homes/listings/book" render={() => <HomesBookingRouterPage />} />
        </Switch>
      </div>
    );
  }
}

HomesRouterPage.propTypes = {
  listings: PropTypes.array,
  hotels: PropTypes.array,

  location: PropTypes.object,
  history: PropTypes.object,
};

export default HomesRouterPage;
