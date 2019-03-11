import React, { Fragment } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DateInput from '../../common/date-input';
import LocPrice from '../../../common/utility/LocPrice';
import { CurrencyConverter } from '../../../../services/utilities/currencyConverter';
import { RoomsXMLCurrency } from '../../../../services/utilities/roomsXMLCurrency';
import { openModal } from '../../../../actions/modalsInfo.js';
import { getCurrency, getCurrencySign } from '../../../../selectors/paymentInfo';
import { getCurrencyExchangeRates } from '../../../../selectors/exchangeRatesInfo';
import { isLogged } from '../../../../selectors/userInfo';
import { selectFlightRouting } from '../../../../selectors/airTicketsSearchSelector';
import { getStartDate, getEndDate } from '../../../../selectors/searchDatesInfo';
import { LOGIN } from '../../../../constants/modals.js';

function AirTicketsDetailsBookingPanel(props) {

  const { currencyExchangeRates } = props;

  if (!currencyExchangeRates) {
    return <div className="loader"></div>;
  }

  localStorage.setItem('flights-fiat-rates', JSON.stringify(currencyExchangeRates));
  const { result, isUserLogged, currency, currencySign, flightRouting, startDate, endDate } = props;
  const currencyCode = result.price.currency;
  const price = result.price.total;
  const taxPrice = result.price.tax;

  const fiatPriceInCurrentCurrency = CurrencyConverter.convert(currencyExchangeRates, currencyCode, currency, price);
  const fiatPriceInRoomsXMLCurrency = CurrencyConverter.convert(currencyExchangeRates, currencyCode, RoomsXMLCurrency.get(), price);

  const taxPriceInCurrentCurrency = CurrencyConverter.convert(currencyExchangeRates, currencyCode, currency, taxPrice);
  const taxPriceInRoomsXMLCurrency = CurrencyConverter.convert(currencyExchangeRates, currencyCode, RoomsXMLCurrency.get(), taxPrice);

  const priceWithoutTax = (fiatPriceInCurrentCurrency - taxPriceInCurrentCurrency).toFixed(2);
  const showPrice = !taxPriceInCurrentCurrency ? fiatPriceInCurrentCurrency : priceWithoutTax;
  const taxAndFeesCalc = isUserLogged && currencySign ? taxPriceInCurrentCurrency.toFixed(2) : 0;

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
              <span>{endDate.format('DD')} </span>{endDate.format('MMM, ddd')}
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
                date={startDate}
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
            <p>{isUserLogged && `${currencySign} ${showPrice.toFixed(2)}`} <LocPrice fiat={showPrice} /></p>
          </div>
          {!isNaN(taxAndFeesCalc) &&
            <div className="cleaning-fee">
              <p>Taxes and fees</p>
              <span className="icon-question" tooltip={'Some message'}></span>
              <p>${isUserLogged && `${currencySign} ${(taxAndFeesCalc)}`} <LocPrice fiat={taxPriceInRoomsXMLCurrency} /></p>
            </div>}
          <div className="total">
            <p>Total</p>
            <p>{isUserLogged && `${currencySign} ${(fiatPriceInCurrentCurrency.toFixed(2))}`} <LocPrice fiat={fiatPriceInRoomsXMLCurrency} /></p>
          </div>
        </div>
        {isUserLogged ?
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
  currencyExchangeRates: PropTypes.object,
  currency: PropTypes.string,
  currencySign: PropTypes.string,
  isUserLogged: PropTypes.bool,
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  flightRouting: PropTypes.string
};

function mapStateToProps(state) {
  const { paymentInfo, exchangeRatesInfo, userInfo, searchDatesInfo, airTicketsSearchInfo } = state;

  return {
    currency: getCurrency(paymentInfo),
    currencySign: getCurrencySign(paymentInfo),
    currencyExchangeRates: getCurrencyExchangeRates(exchangeRatesInfo),
    isUserLogged: isLogged(userInfo),
    startDate: getStartDate(searchDatesInfo),
    endDate: getEndDate(searchDatesInfo),
    flightRouting: selectFlightRouting(airTicketsSearchInfo)
  };
}

export default withRouter(connect(mapStateToProps)(AirTicketsDetailsBookingPanel));
