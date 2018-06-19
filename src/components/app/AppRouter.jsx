import React from 'react';
import { Route, Switch } from 'react-router-dom';

import App from './App';
import MobileHotelsSearchPage from '../hotels/search/MobileHotelsSearchPage';

export default class AppRouter extends React.Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path="/mobile" render={() => <MobileHotelsSearchPage />} />
          <Route path="/" render={() => <App />} />
        </Switch>
      </div>
    );
  }
}

