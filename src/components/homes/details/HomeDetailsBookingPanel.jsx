import { openModal } from '../../../actions/modalsInfo.js';
import { LOGIN } from '../../../constants/modals.js';
import DatePickerPreview from './DatePickerPreview';
import { CurrencyConverter } from '../../../services/utilities/currencyConverter';
import LocPrice from '../../common/utility/LocPrice';
import { Link } from 'react-router-dom';
import { RoomsXMLCurrency } from '../../../services/utilities/roomsXMLCurrency';
import { connect } from 'react-redux';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { isInvalidRange } from '../common/detailsPageUtils.js';

class HomeDetailsBookingPanel extends React.Component {
    render() {
        const { rates } = this.props.currenciesRatesInfo;
        if (rates === null || !this.props.calendar) {
            return <div className="loader"></div>
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

        function getPriceForPeriod(startDate, nights, calendar) {
            let price = 0;

            let startDateIndex = calendar.findIndex(x => x.date === startDate.format('DD/MM/YYYY'));
            if(startDateIndex && startDateIndex < 0) {
                return 0;
            }
            for (let i = startDateIndex; i < nights + startDateIndex; i++) {
                price += calendar[i].price
            }
            if (nights === 0) {
                return 0;
            }
            return price / nights;
        }
        debugger;
        const price = getPriceForPeriod(startDate, nights, calendar);

        let defaultDailyPrice = CurrencyConverter.convert(rates, currencyCode, currency, price);
        let fiatPriceInRoomsXMLCurrency = CurrencyConverter.convert(rates, currencyCode, RoomsXMLCurrency.get(), price);

        let defaultCleaningFee = CurrencyConverter.convert(rates, currencyCode, currency, cleaningFee);
        let fiatCleaningFeePriceInRoomsXMLCurrency = CurrencyConverter.convert(rates, currencyCode, RoomsXMLCurrency.get(), cleaningFee);

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
                    <select>
                        {this.props.guestArray.map((item, i) => {
                            return <option key={i}>{`${item} Guests`}</option>
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
                    <Link to={`/homes/listings/book/${this.props.match.params.id}${this.props.location.search}`} onClick={e => invalidRange && e.preventDefault()} className={[invalidRange ? 'disabled' : null, "pay-in"].join(' ')}>Request Booking in LOC</Link> :
                    <button className="pay-in" onClick={(e) => this.props.dispatch(openModal(LOGIN, e))}>Login</button>}
                <p className="booking-helper">You won't be charged yet</p>
            </div>
        </div>)
    }
}

function mapStateToProps(state) {
    const { paymentInfo, currenciesRatesInfo, userInfo } = state;
    return {
        paymentInfo,
        currenciesRatesInfo,
        userInfo
    };
}

export default withRouter(connect(mapStateToProps)(HomeDetailsBookingPanel));