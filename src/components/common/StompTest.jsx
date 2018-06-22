import React, { Component } from 'react';
import Stomp from 'stompjs';

export default class StyleTest extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.initStomp();
  }

  initStomp() {
    const url = 'ws://localhost:61614';
    const login = 'admin';
    const passcode = 'admin';
    const destination = 'pipilota/222666';
    const client = Stomp.client(url);

    client.connect(login, passcode, function(frame) {
      console.log("connected to Stomp");
      client.subscribe(destination, function(message) {
        console.log(message);
      });
    });
  }

  render() {
    return (
      <div className="container">
      </div>
    );
  }
}
