import React, { PureComponent } from "react";
/**
 * Internal Component For Visualization And Triggering Of Logic
 */

type _LocPriceComponentProps = {
  fiatInEur: number,
  requestLocPriceForThisAmountInEur: Function,
  endRequestForLocPriceOfThisAmountOfEur: Function,
  brackets: boolean
};

export default class _LocPriceComponent extends PureComponent<
  _LocPriceComponentProps,
  null
> {

  constructor(props){
    super(props);
    this.requestLocPrice = this.requestLocPrice.bind(this);
  }

  requestLocPrice(amount){
    this.props.requestLocPriceForThisAmountInEur(amount, this.props.isExchangerWebsocketConnected);
  }

  /**
   * Hooks
   */
  componentDidMount() {
    if (this.props.fiatInEur) {
      this.requestLocPrice(this.props.fiatInEur);
    }
  }
  componentDidUpdate(prevProps) {
    let fiatChanged = this.props.fiatInEur !== prevProps.fiatInEur;
    let exchangerConnectionChanged = this.props.isExchangerWebsocketConnected && !prevProps.isExchangerWebsocketConnected;
    if (fiatChanged || exchangerConnectionChanged) {
      this.requestLocPrice(this.props.fiatInEur);
    }
  }
  componentWillUnmount() {
    // this.props.endRequestForLocPriceOfThisAmountOfEur(this.props.fiatInEur);
  }

  render() {
    if (!this.props.isUserLogged) return null;
    const bracket = this.props.brackets && this.props.isUserLogged;
    return (
      <span>
        {bracket && "("}LOC{" "}
        {this.props.locAmount && this.props.locAmount.toFixed(2)}
        {bracket && ")"}
      </span>
    );
  }
}

_LocPriceComponent.defaultProps = {
  brackets: true
};
