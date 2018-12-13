import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LocPrice from '../common/utility/LocPrice';
import { CurrencyConverter } from '../../services/utilities/currencyConverter';
import { RoomsXMLCurrency } from '../../services/utilities/roomsXMLCurrency';
import { isLogged } from '../../selectors/userInfo';
import { getCurrency, getCurrencySign } from '../../selectors/paymentInfo';

class PopularHomesPrice extends Component {

  shouldComponentUpdate(nextProps) {
    if (nextProps.currency !== this.props.currency || nextProps.isUserLogged !== this.props.isUserLogged) {
      return true;
    }
    return false;
  }

  render() {
    const { currency, currencySign, isUserLogged, exchangeRatesInfo, item } = this.props;
    const { currencyExchangeRates } = exchangeRatesInfo;
    const price = (item.prices) && currency === item.currencyCode ? item.defaultDailyPrice : item.prices[RoomsXMLCurrency.get()];

    return (
      <div className="list-property-price">
        {isUserLogged && currencyExchangeRates &&
          `${currencySign}${currencyExchangeRates && Number(CurrencyConverter.convert(currencyExchangeRates, RoomsXMLCurrency.get(), currency, price)).toFixed(2)} `}
        <LocPrice fiat={price} /> per night
      </div>
    );
  }
}

PopularHomesPrice.propTypes = {
  item: PropTypes.object,

  // start Redux props
  currency: PropTypes.string,
  currencySign: PropTypes.string,
  isUserLogged: PropTypes.bool,
  exchangeRatesInfo: PropTypes.object,
};

function mapStateToProps(state) {
  const { paymentInfo, userInfo, exchangeRatesInfo } = state;
  return {
    currency: getCurrency(paymentInfo),
    currencySign: getCurrencySign(paymentInfo),
    isUserLogged: isLogged(userInfo),
    exchangeRatesInfo
  };
}

export default connect(mapStateToProps)(PopularHomesPrice);