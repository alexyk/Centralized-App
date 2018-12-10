import { Route, Switch, Redirect } from 'react-router-dom';

import React, { Component } from 'react';
import HomePage from './HomePage';
import HomesRouterPage from '../homes/HomesRouterPage';
import HotelsRouterPage from '../hotels/HotelsRouterPage';
import AirTicketsRouterPage from '../airTickets/AirTicketsRouterPage';
import requester from '../../requester';

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
<<<<<<< HEAD
          <Route path="/homes" render={() => <HomesRouterPage listings={this.state.listings} hotels={this.state.hotels} />} />
          <Route path="/hotels" render={() => <HotelsRouterPage listings={this.state.listings} hotels={this.state.hotels} />} />
          <Route path="/tickets" render={() => <AirTicketsRouterPage listings={this.state.listings} hotels={this.state.hotels} />} />
=======
          <Route exact path="/hotels" render={() => <HomePage homePage="hotels" listings={this.state.listings} hotels={this.state.hotels} />} />
          <Route exact path="/homes" render={() => <HomePage homePage="homes" listings={this.state.listings} hotels={this.state.hotels} />} />  
          <Route path="/homes" render={() => <HomesRouterPage  />} />
          <Route path="/hotels" render={() => <HotelsRouterPage  />} />
>>>>>>> f5e65100be6d486d8b0a3d3e5b8cf4a106dab13d
          <Route path="/mobile" render={() => <HotelsRouterPage />} />
          <Route exact path="/users/resetPassword/:confirm" render={() => <HomePage listings={this.state.listings} hotels={this.state.hotels} />} />
          <Redirect from="/" to="/hotels" />
        </Switch>
      </div>
    );
  }
}

export default HomeRouterPage;