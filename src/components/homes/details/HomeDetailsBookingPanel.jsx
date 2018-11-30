import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { openModal } from '../../../actions/modalsInfo.js';
import { setGuests } from '../../../actions/homesSearchInfo';
import { LOGIN } from '../../../constants/modals.js';
import Datepicker from '../../common/datepicker';
import moment from 'moment';
import { CurrencyConverter } from '../../../services/utilities/currencyConverter';
import { RoomsXMLCurrency } from '../../../services/utilities/roomsXMLCurrency';
import LocPrice from '../../common/utility/LocPrice';
import { isInvalidRange, getPriceForPeriod } from '../common/detailsPageUtils.js';
import { initStickyElements } from '../common/detailsPageUtils.js';

class HomeDetailsBookingPanel extends React.Component {
  componentDidMount() {
    initStickyElements();
  }

  getExcludedDates(calendar) {
    return calendar
      .filter(item => item.available === false)
      .map(item => moment(item.date, 'DD/MM/YYYY'));
  }  
  
  calculateNights(startDate, endDate) {
    let diffDays = endDate.startOf('day').diff(startDate.startOf('day'), 'days');
    return endDate > startDate ? diffDays : 0;
  }

  render() {
    const { currencyExchangeRates } = this.props.exchangeRatesInfo;
    if (!currencyExchangeRates || !this.props.calendar) {
      return <div className="loader"></div>;
    }

    const { calendar, currencyCode, cleaningFee } = this.props;
    const { startDate, endDate } = this.props.searchDatesInfo;
    const { currency, currencySign } = this.props.paymentInfo;
    
    const nights = this.calculateNights(startDate, endDate);
    const price = getPriceForPeriod(startDate, nights, calendar);
    const excludedDates = calendar && this.getExcludedDates(calendar);

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
        <div className="default-price"><span className="main-fiat">{currencySign}{defaultDailyPrice.toFixed(3)}</span> <LocPrice fiat={fiatPriceInRoomsXMLCurrency} /> / night</div>
        <div className="booking-dates">
          <Datepicker minDate={moment()} enableRanges monthsToShow={1} excludedDates={excludedDates}/>
          <div className="days-of-stay">
            <span className="icon-moon"></span>
            <span>{nights} nights</span>
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
            <div>{nights} nights</div>
            <div>{currencySign}{(defaultDailyPrice * nights).toFixed(3)} <LocPrice fiat={fiatPriceInRoomsXMLCurrency * nights} /></div>
          </div>
          <div className="cleaning-fee">
            <div>Cleaning fee</div>
            <div>{currencySign}{defaultCleaningFee.toFixed(3)} <LocPrice fiat={fiatCleaningFeePriceInRoomsXMLCurrency}/></div>
          </div>
          <div className="total">
            <div>Total</div>
            <div>{currencySign}{((defaultDailyPrice * nights) + defaultCleaningFee).toFixed(3)} <LocPrice fiat={(fiatPriceInRoomsXMLCurrency * nights) + fiatCleaningFeePriceInRoomsXMLCurrency} /></div>
          </div>
        </div>
        <hr />
        {this.props.userInfo.isLogged ?
          <Link to={`/homes/listings/${this.props.match.params.id}/book?startDate=${startDate.format('DD/MM/YYYY')}&endDate=${endDate.format('DD/MM/YYYY')}&guests=${this.props.homesSearchInfo.guests}`} onClick={e => invalidRange && e.preventDefault()} className={[invalidRange ? 'disabled' : null, 'button'].join(' ')}>Request Booking</Link> :
          <button className="button" onClick={(e) => this.props.dispatch(openModal(LOGIN, e))}>Login</button>}
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
  homesSearchInfo: PropTypes.object,
  searchDatesInfo: PropTypes.object
};

function mapStateToProps(state) {
  const { paymentInfo, exchangeRatesInfo, userInfo, homesSearchInfo, searchDatesInfo } = state;
  return {
    paymentInfo,
    exchangeRatesInfo,
    userInfo,
    homesSearchInfo,
    searchDatesInfo
  };
}

export default withRouter(connect(mapStateToProps)(HomeDetailsBookingPanel));
