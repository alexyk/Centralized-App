import { Config } from '../../config';

const WEBSOCKET_RECONNECT_DELAY = 5000;

class WS {
  constructor() {
    this.ws = null;
    this.shoudSocketReconnect = true;
    this.initSocket();
  }

  initSocket() {
    this.ws = new WebSocket(Config.getValue('SOCKET_HOST_PRICE'));
  }

  getWS() {
    return this.ws;
  }

  sendMessage(id, method, params) {
    if (this.ws.readyState === 1 && id) {
      this.ws.send(JSON.stringify({ id, method, params }));
    }
  }

  close(callback) {
    if (this.shoudSocketReconnect) {
      callback();
      setTimeout(() => {
        this.initSocket();
        console.log('reconect');
      }, WEBSOCKET_RECONNECT_DELAY);
    }
  }

  disconnect() {
    this.shoudSocketReconnect = false;
    if (this.ws) {
      this.ws.close();
    }
  }
}

export default WS;

export const Websocket = new WS();