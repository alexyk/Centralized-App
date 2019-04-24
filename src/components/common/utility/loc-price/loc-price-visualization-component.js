import React, { PureComponent } from "react";
/**
 * Internal Component For Visualization And Triggering Of Logic
 */

type _LocPriceComponentProps = {
  fiatInEur: number,
  isExchangerWebsocketConnected: boolean,
  openAConnectionForThisAmountInEuro: Function,
  endConnectionForCurrentAmountInEuroAndClearStoredLocAmount: Function,
  brackets: boolean
};

export default class _LocPriceComponent extends PureComponent<
  _LocPriceComponentProps,
  null
> {
  /**
   * Hooks
   */
  componentDidMount() {
    if (this.props.fiatInEur) {
      this.props.openAConnectionForThisAmountInEuro(this.props.fiatInEur);
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.fiatInEur !== prevProps.fiatInEur) {
      this.props.openAConnectionForThisAmountInEuro(this.props.fiatInEur);
    }
  }
  componentWillUnmount() {
    this.props.endConnectionForCurrentAmountInEuroAndClearStoredLocAmount(
      this.props.fiatInEur
    );
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
