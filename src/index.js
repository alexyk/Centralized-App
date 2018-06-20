import 'babel-polyfill';

import AppRouter from './components/app/AppRouter.jsx';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import reducers from './reducers';

const createStoreWithMiddleware = applyMiddleware()(createStore);

render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  </Provider>
  , document.getElementById('app')
);