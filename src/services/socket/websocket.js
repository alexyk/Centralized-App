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

  sendMessage(message) {
    if (this.ws.readyState === 1) {
      this.ws.send(message);
    }
  }

  close(callback) {
    if (this.shoudSocketReconnect) {
      callback();
      setTimeout(() => {
        this.initSocket();
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