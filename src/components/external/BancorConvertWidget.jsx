import React, { Component } from "react";

class BancorConvertWidget extends Component {
  componentDidMount() {
    if (window.BancorConvertWidget) {
      const instance = window.BancorConvertWidget.createInstance({
        type: "1",
        baseCurrencyId: "5b27eb823751b7bb8dad17bb",
        pairCurrencyId: "5937d635231e97001f744267",
        primaryColor: "#DD7A63",
        displayCurrency: "ETH",
        primaryColorHover: "#EA8C73"
      });

      this.instance = instance;
    }
  }

  componentWillUnmount() {
    if (this.instance) {
      this.instance.deinit();
    }
  }

  render() {
    return (
      <div className="bancor-convert-widget">
        <div id="bancor-wc" />
      </div>
    );
  }
}

export default BancorConvertWidget;
