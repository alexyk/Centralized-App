import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CurrencyConverter } from '../../../services/utilities/currencyConverter';
import { RoomsXMLCurrency } from '../../../services/utilities/roomsXMLCurrency';
import { isLogged } from '../../../selectors/userInfo';
import { getLocAmountById } from '../../../selectors/locAmountsInfo';
import { getCurrencyExchangeRates, getLocEurRate, getLocRateFiatAmount } from '../../../selectors/exchangeRatesInfo';

const DEFAULT_CRYPTO_CURRENCY = 'EUR';

class LocPrice extends PureComponent {
  render() {
    const { isUserLogged } = this.props;
    const { brackets, locAmount } = this.props;

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
  brackets: true
};

LocPrice.propTypes = {
  fiat: PropTypes.number,
  brackets: PropTypes.bool,

  // Redux props
  isUserLogged: PropTypes.bool,
  locAmount: PropTypes.string
};

function mapStateToProps(state, ownProps) {
  const { fiat } = ownProps;
  const { userInfo, locAmountsInfo, exchangeRatesInfo } = state;

  const currencyExchangeRates = getCurrencyExchangeRates(exchangeRatesInfo);
  const fiatInEur = currencyExchangeRates && CurrencyConverter.convert(currencyExchangeRates, RoomsXMLCurrency.get(), DEFAULT_CRYPTO_CURRENCY, fiat);
  const locEurRate = getLocEurRate(exchangeRatesInfo);
  const locRateFiatAmount = getLocRateFiatAmount(exchangeRatesInfo);
  let rateLocAmount = getLocAmountById(locAmountsInfo, locRateFiatAmount);
  
  if (!rateLocAmount) {
    rateLocAmount = locRateFiatAmount / locEurRate;
  }

  const locRate = locRateFiatAmount / rateLocAmount;

  let locAmount = (fiatInEur / locRate).toFixed(2);

  return {
    isUserLogged: isLogged(userInfo),
    locAmount
  };
}

export default connect(mapStateToProps)(LocPrice);