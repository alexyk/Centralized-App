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
    const { paymentInfo, ratesInfo, item } = this.props;
    const { currency } = paymentInfo;
    const { currenciesRates } = ratesInfo;
    const price = (item.prices) && currency === item.currencyCode ? item.defaultDailyPrice : item.prices[RoomsXMLCurrency.get()];

    return (
      <div className="list-property-price">
        {this.props.userInfo.isLogged && currenciesRates &&
          `${paymentInfo.currencySign}${currenciesRates && Number(CurrencyConverter.convert(currenciesRates, RoomsXMLCurrency.get(), currency, price)).toFixed(2)} `}
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
  ratesInfo: PropTypes.object,
};

function mapStateToProps(state) {
  const { paymentInfo, userInfo, ratesInfo } = state;
  return {
    paymentInfo,
    userInfo,
    ratesInfo
  };
}

export default connect(mapStateToProps)(PopularHomesPrice);