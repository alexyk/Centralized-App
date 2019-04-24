import React, { PureComponent } from "react";
/**
 * Internal Component For Visualization And Triggering Of Logic
 */

type _LocPriceComponentProps = {
  fiatInEur: number,
  isExchangerWebsocketConnected: boolean,
  openAConnectionThisAmountInEuro: Function,
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
    if (this.props.isExchangerWebsocketConnected) {
      this.props.openAConnectionThisAmountInEuro(this.props.fiatInEur);
    }
  }
  componentDidUpdate(prevProps) {
    if (
      this.props.isExchangerWebsocketConnected &&
      !prevProps.isExchangerWebsocketConnected
    ) {
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
        {bracket && "("}LOC {this.props.locAmount && this.props.locAmount}
        {bracket && ")"}
      </span>
    );
  }
}

_LocPriceComponent.defaultProps = {
  brackets: true
};
