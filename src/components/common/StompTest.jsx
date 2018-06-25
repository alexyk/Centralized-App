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
    const login = null;
    const passcode = null;
    const receiveDestination = 'pipilota/' + uuid;
    const client = Stomp.client(url);
    this.client = client;
    const headers = {
      login: login,
      passcode: passcode,
      // additional header
      'content-length': false
    };
    client.connect(headers, function (frame) {
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
      query: 'region=15664&currency=USD'
    };

    const msg = JSON.stringify(msgObject);

    const sendDestination = 'pipilota';
    const headers = {
      'content-length': false
    };
    this.client.send(sendDestination, headers, msg);
  }

  render() {
    return (
      <div className="container">
        <button onClick={this.sendMessage}>SEND</button>
      </div>
    );
  }
}