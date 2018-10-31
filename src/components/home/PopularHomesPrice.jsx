import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LocPrice from '../common/utility/LocPrice';
import { CurrencyConverter } from '../../services/utilities/currencyConverter';
import { RoomsXMLCurrency } from '../../services/utilities/roomsXMLCurrency';

class PopularHomesPrice extends Component {

  shouldComponentUpdate(nextProps) {
    if (nextProps.paymentInfo.currency !== this.props.paymentInfo.currency || nextProps.userInfo.isLogged !== this.props.userInfo.isLogged) {
      return true;
    }
    return false;
  }

  render() {
    const { paymentInfo, exchangeRatesInfo, item } = this.props;
    const { currency } = paymentInfo;
    const { currencyExchangeRates } = exchangeRatesInfo;
    const price = (item.prices) && currency === item.currencyCode ? item.defaultDailyPrice : item.prices[RoomsXMLCurrency.get()];

    return (
      <div className="list-property-price">
        {this.props.userInfo.isLogged && currencyExchangeRates &&
          `${paymentInfo.currencySign}${currencyExchangeRates && Number(CurrencyConverter.convert(currencyExchangeRates, RoomsXMLCurrency.get(), currency, price)).toFixed(2)} `}
        <LocPrice fiat={price} /> per night
      </div>
    );
  }
}

PopularHomesPrice.propTypes = {
  item: PropTypes.object,

  // start Redux props
  paymentInfo: PropTypes.object,
  userInfo: PropTypes.object,
  exchangeRatesInfo: PropTypes.object,
};

function mapStateToProps(state) {
  const { paymentInfo, userInfo, exchangeRatesInfo } = state;
  return {
    paymentInfo,
    userInfo,
    exchangeRatesInfo
  };
}

export default connect(mapStateToProps)(PopularHomesPrice);