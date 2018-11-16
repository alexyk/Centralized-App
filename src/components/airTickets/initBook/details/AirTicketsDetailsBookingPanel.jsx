import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AirTicketsDatepickerWrapper from '../../search/AirTicketsDatepickerWrapper';
import LocPrice from '../../../common/utility/LocPrice';
import { CurrencyConverter } from '../../../../services/utilities/currencyConverter';
import { RoomsXMLCurrency } from '../../../../services/utilities/roomsXMLCurrency';
import { openModal } from '../../../../actions/modalsInfo.js';
import { LOGIN } from '../../../../constants/modals.js';

class AirTicketsDetailsBookingPanel extends React.Component {
  render() {
    const { currencyExchangeRates } = this.props.exchangeRatesInfo;
    if (!currencyExchangeRates) {
      return <div className="loader"></div>;
    }

    const { result, userInfo, paymentInfo } = this.props;
    const { currency, currencySign } = paymentInfo;

    const currencyCode = result.price.currency;
    const price = result.price.total;
    const taxPrice = result.price.tax;

    const fiatPriceInCurrentCurrency = CurrencyConverter.convert(currencyExchangeRates, currencyCode, currency, price);
    const fiatPriceInRoomsXMLCurrency = CurrencyConverter.convert(currencyExchangeRates, currencyCode, RoomsXMLCurrency.get(), price);

    const taxPriceInCurrentCurrency = CurrencyConverter.convert(currencyExchangeRates, currencyCode, currency, taxPrice);
    const taxPriceInRoomsXMLCurrency = CurrencyConverter.convert(currencyExchangeRates, currencyCode, RoomsXMLCurrency.get(), taxPrice);

    return (<div className="air-tickets-details-booking-panel">
      <div className="box" id="test">
        <p className="default-price"><span className="main-fiat">{currencySign}{fiatPriceInCurrentCurrency.toFixed(2)}</span> <LocPrice fiat={fiatPriceInRoomsXMLCurrency} /> /per 1 adult</p>
        <div className="booking-dates">
          <div className="air-tickets-form-check-wrap">
            <AirTicketsDatepickerWrapper />
          </div>
        </div>
        <div className="fiat-price-box">
          <div className="without-fees">
            <p>Passengers</p>
            <span className="icon-question" tooltip={'Some message'}></span>
            <p>{userInfo.isLogged && `${currencySign} ${(fiatPriceInCurrentCurrency - taxPriceInCurrentCurrency).toFixed(2)}`} <LocPrice fiat={fiatPriceInRoomsXMLCurrency - taxPriceInRoomsXMLCurrency} /></p>
          </div>
          <div className="cleaning-fee">
            <p>Taxes and fees</p>
            <span className="icon-question" tooltip={'Some message'}></span>
            <p>{userInfo.isLogged && `${currencySign} ${(taxPriceInCurrentCurrency.toFixed(2))}`} <LocPrice fiat={taxPriceInRoomsXMLCurrency} /></p>
          </div>
          <div className="total">
            <p>Total</p>
            <p>{userInfo.isLogged && `${currencySign} ${(fiatPriceInCurrentCurrency.toFixed(2))}`} <LocPrice fiat={fiatPriceInRoomsXMLCurrency} /></p>
          </div>
        </div>
        {userInfo.isLogged ?
          <Link to={`/tickets/results/initBook/${this.props.match.params.id}/profile${this.props.location.search}`} className="pay-in">Request Booking</Link> :
          <button className="pay-in" onClick={(e) => this.props.dispatch(openModal(LOGIN, e))}>Login</button>}
        <hr />
        <p className="booking-helper">You won&#39;t be charged yet</p>
      </div>
    </div>);
  }
}

AirTicketsDetailsBookingPanel.propTypes = {
  match: PropTypes.object,
  result: PropTypes.object,

  // Router props
  location: PropTypes.object,

  // Redux props
  exchangeRatesInfo: PropTypes.object,
  paymentInfo: PropTypes.object,
  userInfo: PropTypes.object,
  dispatch: PropTypes.func
};

function mapStateToProps(state) {
  const { paymentInfo, exchangeRatesInfo, userInfo } = state;
  return {
    paymentInfo,
    exchangeRatesInfo,
    userInfo
  };
}

export default withRouter(connect(mapStateToProps)(AirTicketsDetailsBookingPanel));
