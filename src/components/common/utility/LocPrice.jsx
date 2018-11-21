import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CurrencyConverter } from '../../../services/utilities/currencyConverter';
import { RoomsXMLCurrency } from '../../../services/utilities/roomsXMLCurrency';

const DEFAULT_CRYPTO_CURRENCY = 'EUR';

class LocPrice extends PureComponent {
  render() {
    const isLogged = this.props.userInfo.isLogged;
    const { brackets, locAmount } = this.props;

    const bracket = brackets && isLogged;

    if (isLogged === undefined) {
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

  // Redux props
  userInfo: PropTypes.object,
  locAmount: PropTypes.string
};

function mapStateToProps(state, ownProps) {
  const { fiat } = ownProps;

  const { userInfo, locAmountsInfo, exchangeRatesInfo } = state;
  const { currencyExchangeRates, locRateFiatAmount, locEurRate } = exchangeRatesInfo;

  const fiatInEur = currencyExchangeRates && CurrencyConverter.convert(currencyExchangeRates, RoomsXMLCurrency.get(), DEFAULT_CRYPTO_CURRENCY, fiat);

  let rateLocAmount = locAmountsInfo.locAmounts[locRateFiatAmount] && locAmountsInfo.locAmounts[locRateFiatAmount].locAmount;

  if (!rateLocAmount) {
    rateLocAmount = locRateFiatAmount / locEurRate;
  }

  const locRate = locRateFiatAmount / rateLocAmount;

  let locAmount = (fiatInEur / locRate).toFixed(2);

  return {
    userInfo,
    locAmount
  };
}

export default connect(mapStateToProps)(LocPrice);
