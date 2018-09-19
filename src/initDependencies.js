import { Config } from './config';
import Requester from 'locktrip-service-layer';
import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';

let config = {
  'domainPrefix': Config.getValue('domainPrefix'),
  'apiHost': Config.getValue('apiHost')
};

let requester = new Requester(localStorage, config);
const createStoreWithMiddleware = applyMiddleware()(createStore);

const store = createStoreWithMiddleware(reducers);

export { store };

export default requester;
