import Stomp from 'stompjs';
import { Config } from '../../config';

/*
docs: http://jmesnil.net/stomp-websocket/doc/
initialize: 
  - var client = Stomp.client(url);

connect: 
  - client.connect(login, passcode, connectCallback);
  - client.connect(login, passcode, connectCallback, errorCallback);
  - client.connect(login, passcode, connectCallback, errorCallback, host);
  - client.connect(headers, connectCallback);
  - client.connect(headers, connectCallback, errorCallback);
subscibe:
  - var subscription = client.subscribe(destination(string), onmessage);
unsubscibe:
  - subscription.unsubscibe();
disconnect:
  - client.disconnect();
*/

const DEFAULT_RECONNECT_DELAY = 5000;
const DEBUG_SOCKET = false;

class StompSocketClass {
  constructor() {
    this.client = null;
    this.initializeSocket();
  }

  initializeSocket() {
    console.log('initialize socket');
    // console.log(Config.getValue('SOCKET_HOST_PRICE'));
    this.client = Stomp.client(Config.getValue('SOCKET_HOST_PRICE'));
    this.client.reconnect_delay = DEFAULT_RECONNECT_DELAY;

    if (!DEBUG_SOCKET) {
      this.client.debug = () => { };
    }

    this.client.connect({

    }, null, null, this.subscribe, this.reload);
  }

  send(destination) {
    if (this.client.connected) {
      this.client.send(destination);
    }
  }

  subscribe(destination, callback) {
    if (this.client.connected) {
      console.log('successfully connect socket');
      return this.client.subscribe(destination, callback);
    }
  }

  reload(error) {
    console.log('error with connection');
    console.log(error);
    // const that = this;
    // setTimeout(() => {
    //   that.initializeSocket();
    // }, DEFAULT_RECONNECT_SOCKET_TIME);
  }

  disconnect() {
    if (this.client.connected) {
      this.client.disconnect();
    }
  }
}

const StompSocket = new StompSocketClass();

export default StompSocket;