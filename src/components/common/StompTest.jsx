import React, { Component } from 'react';
import Stomp from 'stompjs';

class StompTest extends Component {
  constructor(props) {
    super(props);

    this.sendMessage = this.sendMessage.bind(this);
  }

  componentWillMount() {
    this.initStomp();
  }

  initStomp() {
    const uuid = '456';
    const url = 'ws://localhost:61614';
    const login = null;
    const passcode = null;
    const receiveDestination = '/topic/search/' + uuid;
    const client = Stomp.client(url);
    this.client = client;
    client.connect(login, passcode, function (frame) {
      console.log("connected to Stomp");
      client.subscribe(receiveDestination, function (message) {
        console.log(message);
        if(JSON.parse(message.body).allElements){
          console.log("ALL ELEMENTS");
          client.disconnect();
        }
      });
    });

    console.log(client.connected);
  }

  sendMessage() {
    const uuid = '456';
    const msgObject = {
      uuid: uuid,
      query: 'region=52612&currency=EUR&startDate=10/07/2018&endDate=11/07/2018&rooms=%5B%7B%22adults%22:2,%22children%22:%5B%5D%7D%5D'
    };

    const msg = JSON.stringify(msgObject);

    const sendDestination = '/topic/search';
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

export default StompTest;