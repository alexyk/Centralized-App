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

    const currencyCode = 'EUR';
    const cleaningFee = 10;

    const { currency,
      currencySign } = this.props.paymentInfo;

    const price = 300;

    let defaultDailyPrice = CurrencyConverter.convert(currencyExchangeRates, currencyCode, currency, price);
    let fiatPriceInRoomsXMLCurrency = CurrencyConverter.convert(currencyExchangeRates, currencyCode, RoomsXMLCurrency.get(), price);

    let defaultCleaningFee = CurrencyConverter.convert(currencyExchangeRates, currencyCode, currency, cleaningFee);
    let fiatCleaningFeePriceInRoomsXMLCurrency = CurrencyConverter.convert(currencyExchangeRates, currencyCode, RoomsXMLCurrency.get(), cleaningFee);

    const invalidRange = true;

    return (<div className="air-tickets-details-booking-panel">
      <div className="box" id="test">
        <p className="default-price"><span className="main-fiat">{currencySign}{defaultDailyPrice.toFixed(3)}</span> <LocPrice fiat={fiatPriceInRoomsXMLCurrency} /> /per night</p>
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
            <p>{currencySign}{defaultDailyPrice.toFixed(3)}  x {this.props.nights} nights</p>
            <p>{currencySign}{(defaultDailyPrice * this.props.nights).toFixed(3)}</p>
          </div>
          <div className="cleaning-fee">
            <p>Cleaning fee</p>
            <p>{currencySign}{defaultCleaningFee.toFixed(3)}</p>
          </div>
          <div className="total">
            <p>Total</p>
            <p>{currencySign}{((defaultDailyPrice * this.props.nights) + defaultCleaningFee).toFixed(3)}</p>
          </div>
        </div>
        <hr />
        <div className="loc-price-box">
          <div className="without-fees">
            <p><LocPrice fiat={fiatPriceInRoomsXMLCurrency} brackets={false} /> x {this.props.nights} nights</p>
            <p><LocPrice fiat={fiatPriceInRoomsXMLCurrency * this.props.nights} brackets={false} /></p>
          </div>
          <div className="cleaning-fee">
            <p>Cleaning fee</p>
            <p><LocPrice fiat={fiatCleaningFeePriceInRoomsXMLCurrency} brackets={false} /></p>
          </div>
          <div className="total">
            <p>Total</p>
            <p><LocPrice fiat={(fiatPriceInRoomsXMLCurrency * this.props.nights) + fiatCleaningFeePriceInRoomsXMLCurrency} brackets={false} /></p>
          </div>
        </div>
        {this.props.userInfo.isLogged ?
          // onClick={e => invalidRange && e.preventDefault()} className={[invalidRange ? 'disabled' : null, 'pay-in'].join(' ')}
          <Link to={`/homes/listings/book/${this.props.match.params.id}${this.props.location.search}`} className={[invalidRange ? 'disabled' : null, 'pay-in'].join(' ')}>Request Booking in LOC</Link> :
          <button className="pay-in" onClick={(e) => this.props.dispatch(openModal(LOGIN, e))}>Login</button>}
        <p className="booking-helper">You won&#39;t be charged yet</p>
      </div>
    </div>);
  }
}

AirTicketsDetailsBookingPanel.propTypes = {
  match: PropTypes.object,
  calendar: PropTypes.array,
  nights: PropTypes.number,
  startDate: PropTypes.any,
  endDate: PropTypes.any,
  currencyCode: PropTypes.string,
  cleaningFee: PropTypes.number,
  handleChangeStart: PropTypes.func,
  handleChangeEnd: PropTypes.func,
  guestArray: PropTypes.array,

  // Router props
  location: PropTypes.object,

  // Redux props
  exchangeRatesInfo: PropTypes.object,
  paymentInfo: PropTypes.object,
  userInfo: PropTypes.object,
  dispatch: PropTypes.func,
  searchDatesInfo: PropTypes.object
};

function mapStateToProps(state) {
  const { paymentInfo, exchangeRatesInfo, userInfo, searchDatesInfo } = state;
  return {
    paymentInfo,
    exchangeRatesInfo,
    userInfo,
    searchDatesInfo
  };
}

export default withRouter(connect(mapStateToProps)(AirTicketsDetailsBookingPanel));
