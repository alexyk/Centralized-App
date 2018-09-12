import { Config } from '../../config';

class WS {
  constructor() {
    this.init();
  }
  
  init() {
    this.ws = new WebSocket(Config.getValue('SOCKET_HOST_PRICE'));
  }
  
  onMessage(handler) {
    this.ws.addEventListener('message', handler);
  }
  
  sendMessage(message) {
    this.ws.send(message);
  }
}

const Websocket = new WS();

export default Websocket;