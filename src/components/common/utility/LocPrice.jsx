import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CurrencyConverter } from '../../../services/utilities/currencyConverter';
import { RoomsXMLCurrency } from '../../../services/utilities/roomsXMLCurrency';
import StompSocket from '../../../services/socket/stompSocket';

const DEFAULT_CRYPTO_CURRENCY = 'EUR';

function LocPrice(props) {
  const { rates, fiat } = props;
  const locRate = props.paymentInfo.locRateInEur;
  const isLogged = props.userInfo.isLogged;

  if (!rates || !fiat || !locRate || isLogged === undefined) {
    return null;
  }

  StompSocket.send(fiat);
  const subscription = StompSocket.subscribe(fiat, callback);
  
  // StompSocket.send(sendDestination, headers, msg);

  console.log(subscription);

  const callback = (event) => {
    console.log(event);
  };

  return (
    <span>
      {isLogged ? '(' : ''}
      LOC {props.rates &&
        Number(CurrencyConverter.convert(props.rates, RoomsXMLCurrency.get(), DEFAULT_CRYPTO_CURRENCY, fiat) / locRate).toFixed(2)}{isLogged ? ')' : ''}
    </span>
  );
}

LocPrice.propTypes = {
  rates: PropTypes.object,
  fiat: PropTypes.number,

  // Redux props
  paymentInfo: PropTypes.object,
  userInfo: PropTypes.object
};


function mapStateToProps(state) {
  const { userInfo, paymentInfo } = state;
  return {
    userInfo,
    paymentInfo
  };
}


export default connect(mapStateToProps)(LocPrice);