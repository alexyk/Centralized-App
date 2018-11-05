import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { openModal } from '../../../actions/modalsInfo.js';
import { setGuests } from '../../../actions/homesSearchInfo';
import { LOGIN } from '../../../constants/modals.js';
import DatePickerPreview from './DatePickerPreview';
import { CurrencyConverter } from '../../../services/utilities/currencyConverter';
import { RoomsXMLCurrency } from '../../../services/utilities/roomsXMLCurrency';
import LocPrice from '../../common/utility/LocPrice';
import { isInvalidRange, getPriceForPeriod } from '../common/detailsPageUtils.js';
import { initStickyElements } from '../common/detailsPageUtils.js';

class HomeDetailsBookingPanel extends React.Component {
  componentDidMount() {
    initStickyElements();
  }

  render() {
    const { currencyExchangeRates } = this.props.exchangeRatesInfo;
    if (!currencyExchangeRates || !this.props.calendar) {
      return <div className="loader"></div>;
    }

    const {
      calendar,
      nights,
      startDate,
      currencyCode,
      cleaningFee,
    } = this.props;

    const { currency,
      currencySign } = this.props.paymentInfo;

    const price = getPriceForPeriod(startDate, nights, calendar);

    let defaultDailyPrice = CurrencyConverter.convert(currencyExchangeRates, currencyCode, currency, price);
    let fiatPriceInRoomsXMLCurrency = CurrencyConverter.convert(currencyExchangeRates, currencyCode, RoomsXMLCurrency.get(), price);

    let defaultCleaningFee = CurrencyConverter.convert(currencyExchangeRates, currencyCode, currency, cleaningFee);
    let fiatCleaningFeePriceInRoomsXMLCurrency = CurrencyConverter.convert(currencyExchangeRates, currencyCode, RoomsXMLCurrency.get(), cleaningFee);

    const invalidRange = isInvalidRange(startDate, nights, calendar);

    if (invalidRange === true) {
      defaultDailyPrice = 0;
      fiatPriceInRoomsXMLCurrency = 0;
      defaultCleaningFee = 0;
      fiatCleaningFeePriceInRoomsXMLCurrency = 0;
    }

    return (<div className="home-booking-panel">
      <div className="box" id="test">
        <p className="default-price"><span className="main-fiat">{currencySign}{defaultDailyPrice.toFixed(3)}</span> <LocPrice fiat={fiatPriceInRoomsXMLCurrency} /> /per night</p>
        <div className="booking-dates">
          <div className="datepicker">
            <DatePickerPreview
              startDate={this.props.startDate}
              endDate={this.props.endDate}
              handleChangeStart={this.props.handleChangeStart}
              handleChangeEnd={this.props.handleChangeEnd}
              calendar={this.props.calendar}
            />
          </div>
          <div className="days-of-stay">
            <span className="icon-moon"></span>
            <span>{this.props.nights} nights</span>
          </div>
        </div>
        <div className="booking-guests">
          <select
            value={this.props.homesSearchInfo.guests}
            onChange={e => this.props.dispatch(setGuests(e.target.value))}
          >
            {this.props.guestArray.map((item, i) => {
              return <option key={i} value={item}>{`${item} Guests`}</option>;
            })}
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
        {/* <button className="pay-in">Request Booking in FIAT</button> */}
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
          <Link to={`/homes/listings/book/${this.props.match.params.id}?startDate=${this.props.startDate.format('DD/MM/YYYY')}&endDate=${this.props.endDate.format('DD/MM/YYYY')}&guests=${this.props.homesSearchInfo.guests}`} onClick={e => invalidRange && e.preventDefault()} className={[invalidRange ? 'disabled' : null, 'pay-in'].join(' ')}>Request Booking in LOC</Link> :
          <button className="pay-in" onClick={(e) => this.props.dispatch(openModal(LOGIN, e))}>Login</button>}
        <p className="booking-helper">You won&#39;t be charged yet</p>
      </div>
    </div>);
  }
}

HomeDetailsBookingPanel.propTypes = {
  startDate: PropTypes.any,
  endDate: PropTypes.any,
  handleChangeStart: PropTypes.func,
  handleChangeEnd: PropTypes.func,
  calendar: PropTypes.array,
  nights: PropTypes.number,
  guestArray: PropTypes.array,
  cleaningFee: PropTypes.number,
  currencyCode: PropTypes.string,
  match: PropTypes.object,

  // Redux props
  dispatch: PropTypes.func,
  paymentInfo: PropTypes.object,
  exchangeRatesInfo: PropTypes.object,
  userInfo: PropTypes.object,
  homesSearchInfo: PropTypes.object
};

function mapStateToProps(state) {
  const { paymentInfo, exchangeRatesInfo, userInfo, homesSearchInfo } = state;
  return {
    paymentInfo,
    exchangeRatesInfo,
    userInfo,
    homesSearchInfo
  };
}

export default withRouter(connect(mapStateToProps)(HomeDetailsBookingPanel));
