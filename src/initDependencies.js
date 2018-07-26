import { Config } from './config';
import Requester from 'locktrip-service-layer';

let config = {
  'domainPrefix': Config.getValue('domainPrefix'),
  'apiHost': Config.getValue('apiHost')
};

let requester = new Requester(localStorage, config);

export default requester;
