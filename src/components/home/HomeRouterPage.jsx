import { Route, Switch, Redirect } from 'react-router-dom';

import React, { Component } from 'react';
import HomePage from './HomePage';
import HomesRouterPage from '../homes/HomesRouterPage';
import HotelsRouterPage from '../hotels/HotelsRouterPage';
import requester from '../../initDependencies';

class HomeRouterPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listings: [],
      hotels: []
    };
  }

  componentDidMount() {
    requester.getTopListings().then(res => {
      res.body.then(data => {
        this.setState({ listings: data.content });
      });
    });

    requester.getTopHotels().then(res => {
      res.body.then(data => {
        this.setState({ hotels: data.content });
      });
    });
  }

  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/homes" render={() => <HomesRouterPage listings={this.state.listings} hotels={this.state.hotels} />} />
          <Route exact path="/hotels" render={() => <HotelsRouterPage listings={this.state.listings} hotels={this.state.hotels} />} />
          <Route exact path="/users/resetPassword/:confirm" render={() => <HomePage listings={this.state.listings} hotels={this.state.hotels} />} />
          <Redirect from="/" to="/hotels" />
        </Switch>
      </div>
    );
  }
}

export default HomeRouterPage;