import Requester from 'locktrip-svc-layer';
import { Config } from './config';

let config = {
  'domainPrefix': Config.getValue('domainPrefix'),
  'apiHost': Config.getValue('apiHost')
};

let requester = new Requester(localStorage, config);

export default requester;
