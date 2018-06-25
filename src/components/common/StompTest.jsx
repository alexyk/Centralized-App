import React, { Component } from 'react';
import Stomp from 'stompjs';

export default class StyleTest extends Component {
  constructor(props) {
    super(props);

    this.sendMessage = this.sendMessage.bind(this);
  }

  componentWillMount() {
    this.initStomp();
  }

  initStomp() {
    const uuid = '123';
    const url = 'ws://localhost:61614';
    const login = 'admin';
    const passcode = 'admin';
    const receiveDestination = 'pipilota/' + uuid;
    const client = Stomp.client(url);
    this.client = client;
    client.connect(login, passcode, function (frame) {
      console.log("connected to Stomp");
      client.subscribe(receiveDestination, function (message) {
        console.log(message);
      });
    });

    console.log(client.connected);
  }

  sendMessage() {
    const uuid = '123';
    const msgObject = {
      uuid: uuid,
      query: 'region=15664&currency=EUR&startDate=28/06/2018&endDate=29/06/2018&rooms=%5B%7B%22adults%22:2,%22children%22:%5B%5D%7D%5D'
    };

    const msg = JSON.stringify(msgObject);

    const sendDestination = 'pipilota';
    this.client.send(sendDestination, {}, msg);
  }

  render() {
    return (
      <div className="container">
        <button onClick={this.sendMessage}>SEND</button>
      </div>
    );
  }
}
