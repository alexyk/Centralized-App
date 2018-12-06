import React, { Fragment } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DateInput from '../../common/date-input';
import LocPrice from '../../../common/utility/LocPrice';
import { CurrencyConverter } from '../../../../services/utilities/currencyConverter';
import { RoomsXMLCurrency } from '../../../../services/utilities/roomsXMLCurrency';
import { openModal } from '../../../../actions/modalsInfo.js';
import { LOGIN } from '../../../../constants/modals.js';

function AirTicketsDetailsBookingPanel(props) {

  const { currencyExchangeRates } = props.exchangeRatesInfo;
  if (!currencyExchangeRates) {
    return <div className="loader"></div>;
  }

  const { result, userInfo, paymentInfo, flightRouting } = props;
  const { currency, currencySign } = paymentInfo;

  const currencyCode = result.price.currency;
  const price = result.price.total;
  const taxPrice = result.price.tax;

  const fiatPriceInCurrentCurrency = CurrencyConverter.convert(currencyExchangeRates, currencyCode, currency, price);
  const fiatPriceInRoomsXMLCurrency = CurrencyConverter.convert(currencyExchangeRates, currencyCode, RoomsXMLCurrency.get(), price);

  const taxPriceInCurrentCurrency = CurrencyConverter.convert(currencyExchangeRates, currencyCode, currency, taxPrice);
  const taxPriceInRoomsXMLCurrency = CurrencyConverter.convert(currencyExchangeRates, currencyCode, RoomsXMLCurrency.get(), taxPrice);

  const getFlightRoutingPreview = (flightRouting) => {
    if (flightRouting === '1') {
      return 'One Way';
    } else if (flightRouting === '2') {
      return (
        <Fragment>
          <span className='icon-calendar'></span>
          <div className="date-container">
            <div className="text">Return</div>
            <div className="date">
              <span>{props.searchDatesInfo.endDate.format('DD')} </span>{props.searchDatesInfo.endDate.format('MMM, ddd')}
            </div>
          </div>
        </Fragment>
      );
    } else if (flightRouting === '3') {
      return 'Multi Stops';
    }
  };

  return (
    <div className="air-tickets-details-booking-panel">
      <div className="box" id="test">
        <p className="default-price"><span className="main-fiat">{currencySign}{fiatPriceInCurrentCurrency.toFixed(2)}</span> <LocPrice fiat={fiatPriceInRoomsXMLCurrency} /> /per 1 adult</p>
        <div className="booking-dates">
          <div className="air-tickets-form-check-wrap">
            <div className="check">
              <DateInput
                text="Departure"
                date={props.searchDatesInfo.startDate}
              />
              <div className="choose-roundtrip">
                <span className="icon-arrow-right arrow"></span>
                <div className="flight-routing-preview">{getFlightRoutingPreview(flightRouting)}</div>
              </div>
            </div>
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
          <Link to={`/tickets/results/initBook/${props.match.params.id}/profile${props.location.search}`} className="pay-in">Request Booking</Link> :
          <button className="pay-in" onClick={(e) => props.dispatch(openModal(LOGIN, e))}>Login</button>}
        <hr />
        <p className="booking-helper">You won&#39;t be charged yet</p>
      </div>
    </div>
  );
}

AirTicketsDetailsBookingPanel.propTypes = {
  result: PropTypes.object,

  // Router props
  match: PropTypes.object,
  location: PropTypes.object,

  // Redux props
  dispatch: PropTypes.func,
  exchangeRatesInfo: PropTypes.object,
  paymentInfo: PropTypes.object,
  userInfo: PropTypes.object,
  searchDatesInfo: PropTypes.object,
  flightRouting: PropTypes.string
};

function mapStateToProps(state) {
  const { paymentInfo, exchangeRatesInfo, userInfo, searchDatesInfo, airTicketsSearchInfo } = state;
  return {
    paymentInfo,
    exchangeRatesInfo,
    userInfo,
    searchDatesInfo,
    flightRouting: airTicketsSearchInfo.flightRouting
  };
}

export default withRouter(connect(mapStateToProps)(AirTicketsDetailsBookingPanel));
