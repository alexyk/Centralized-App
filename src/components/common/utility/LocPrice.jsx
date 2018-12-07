import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CurrencyConverter } from '../../../services/utilities/currencyConverter';
import { RoomsXMLCurrency } from '../../../services/utilities/roomsXMLCurrency';
import { ExchangerWebsocket } from '../../../services/socket/exchangerWebsocket';
import { removeLocAmount } from '../../../actions/locAmountsInfo';
import { makeGetLocAmount } from '../../../selectors/locAmountsInfo';
import { getUserIsLogged } from '../../../selectors/userInfo';
import { isExchangerWebsocketConnected } from '../../../selectors/exchangerSocketInfo';
import { getCurrencyExchangeRates } from '../../../selectors/exchangeRatesInfo';

const DEFAULT_CRYPTO_CURRENCY = 'EUR';
const DEFAULT_LOC__PRICE_METHOD = 'getLocPrice';

class LocPrice extends PureComponent {
  constructor(props) {
    super(props);
    let isLocPriceRendered = false;
    let fiatInEur;
    if (this.props.currencyExchangeRates) {
      fiatInEur = this.props.currencyExchangeRates && CurrencyConverter.convert(this.props.currencyExchangeRates, RoomsXMLCurrency.get(), DEFAULT_CRYPTO_CURRENCY, this.props.fiat);
      this.sendWebsocketMessage(fiatInEur, null, Object.assign(this.props.params, { fiatAmount: fiatInEur }));
      isLocPriceRendered = true;
    }
    this.state = {
      fiatInEur,
      isLocPriceRendered
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.isExchangerWebsocketConnected &&
      this.props.isExchangerWebsocketConnected !== prevProps.isExchangerWebsocketConnected) {
      this.sendWebsocketMessage(this.state.fiatInEur, null, Object.assign(prevProps.params, { fiatAmount: this.state.fiatInEur }));
    }
    if (this.props.currencyExchangeRates && !this.state.isLocPriceRendered) {
      const fiatInEur = this.props.currencyExchangeRates && CurrencyConverter.convert(this.props.currencyExchangeRates, RoomsXMLCurrency.get(), DEFAULT_CRYPTO_CURRENCY, prevProps.fiat);
      this.sendWebsocketMessage(fiatInEur, null, Object.assign(prevProps.params, { fiatAmount: fiatInEur }));
      this.setState({
        isLocPriceRendered: true,
        fiatInEur
      });
    }
  }

  componentWillUnmount() {
    const { fiatInEur } = this.state;

    this.sendWebsocketMessage(fiatInEur, 'unsubscribe');
    if (this.props.locAmount) {
      this.props.removeLocAmount(fiatInEur);
    }
  }

  sendWebsocketMessage(id, method, params) {
    ExchangerWebsocket.sendMessage(id, method || DEFAULT_LOC__PRICE_METHOD, params);
  }

  render() {
    const { brackets, isUserLogged, locAmount } = this.props;

    const bracket = brackets && isUserLogged;

    if (isUserLogged === undefined) {
      return null;
    }

    return (
      <span>{bracket && '('}LOC {locAmount && locAmount}{bracket && ')'}</span>
    );
  }
}

LocPrice.defaultProps = {
  params: {},
  brackets: true
};

LocPrice.propTypes = {
  fiat: PropTypes.number,
  brackets: PropTypes.bool,
  method: PropTypes.string,
  params: PropTypes.object,

  // Redux props
  isUserLogged: PropTypes.bool,
  isExchangerWebsocketConnected: PropTypes.bool,
  locAmount: PropTypes.string,
  currencyExchangeRates: PropTypes.object,
  removeLocAmount: PropTypes.func
};

const makeMapStateToProps = () => {
  const getLocAmount = makeGetLocAmount();
  const mapStateToProps = (state, ownProps) => {
    return {
      isUserLogged: getUserIsLogged(state),
      locAmount: getLocAmount(state, ownProps),
      isExchangerWebsocketConnected: isExchangerWebsocketConnected(state),
      currencyExchangeRates: getCurrencyExchangeRates(state)
    };
  };

  return mapStateToProps;
};

const mapDispatchToProps = (dispatch) => {
  return {
    removeLocAmount: (fiat) => dispatch(removeLocAmount(fiat))
  };
};

export default connect(makeMapStateToProps, mapDispatchToProps)(LocPrice);
