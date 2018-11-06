import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AirTicketsDatepickerWrapper from '../search/AirTicketsDatepickerWrapper';
import LocPrice from '../../common/utility/LocPrice';
import { CurrencyConverter } from '../../../services/utilities/currencyConverter';
import { RoomsXMLCurrency } from '../../../services/utilities/roomsXMLCurrency';
import { openModal } from '../../../actions/modalsInfo.js';
import { LOGIN } from '../../../constants/modals.js';

class AirTicketsDetailsBookingPanel extends React.Component {
  render() {
    const { currencyExchangeRates } = this.props.exchangeRatesInfo;
    if (!currencyExchangeRates) {
      return <div className="loader"></div>;
    }

    const { result } = this.props;
    const { currency, currencySign } = this.props.paymentInfo;

    const currencyCode = result.summary.currency;
    const price = result.summary.totalPrice;
    const taxPrice = result.summary.taxPrice;

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
        <div className="booking-guests">
          <select>
            <option>No child</option>
            {/* {this.props.guestArray.map((item, i) => {
              return <option key={i}>{`${item} Guests`}</option>;
            })} */}
          </select>
        </div>
        <div className="fiat-price-box">
          <div className="without-fees">
            <p>Passengers</p>
            <p>{currencySign}{(fiatPriceInCurrentCurrency - taxPriceInCurrentCurrency).toFixed(2)}</p>
          </div>
          <div className="cleaning-fee">
            <p>Taxes and fees</p>
            <p>{currencySign}{taxPriceInCurrentCurrency.toFixed(2)}</p>
          </div>
          <div className="total">
            <p>Total</p>
            <p>{currencySign}{(fiatPriceInCurrentCurrency).toFixed(2)}</p>
          </div>
        </div>
        {this.props.userInfo.isLogged ?
          <Link to={`/homes/listings/book/${this.props.match.params.id}${this.props.location.search}`} className="pay-in">Request Booking in FIAT</Link> :
          <button className="pay-in" onClick={(e) => this.props.dispatch(openModal(LOGIN, e))}>Login</button>}
        <hr />
        <div className="loc-price-box">
          <div className="without-fees">
            <p>Passengers</p>
            <p><LocPrice fiat={fiatPriceInRoomsXMLCurrency - taxPriceInRoomsXMLCurrency} brackets={false} /></p>
          </div>
          <div className="cleaning-fee">
            <p>Taxes and fees</p>
            <p><LocPrice fiat={taxPriceInRoomsXMLCurrency} brackets={false} /></p>
          </div>
          <div className="total">
            <p>Total</p>
            <p><LocPrice fiat={fiatPriceInRoomsXMLCurrency} brackets={false} /></p>
          </div>
        </div>
        {this.props.userInfo.isLogged ?
          <Link to={`/homes/listings/book/${this.props.match.params.id}${this.props.location.search}`} className="pay-in">Request Booking in LOC</Link> :
          <button className="pay-in" onClick={(e) => this.props.dispatch(openModal(LOGIN, e))}>Login</button>}
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
