import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import PropTypes from 'prop-types';
import moment from 'moment';
import queryString from 'query-string';
import { Config } from '../../../config.js';
import { CONFIRM_PAYMENT_WITH_LOC, CREATE_WALLET, PENDING_BOOKING_LOC, PENDING_BOOKING_FIAT } from '../../../constants/modals.js';
import { PROCESSING_TRANSACTION } from '../../../constants/infoMessages.js';
import { SERVICE_UNAVAILABLE } from '../../../constants/errorMessages';
import { LONG } from '../../../constants/notificationDisplayTimes.js';
import { HotelReservation } from '../../../services/blockchain/hotelReservation';
import { RoomsXMLCurrency } from '../../../services/utilities/roomsXMLCurrency';
import { CurrencyConverter } from '../../../services/utilities/currencyConverter';
import requester from '../../../requester';
import BookingSteps from '../../common/bookingSteps';
import LocPrice from '../../common/utility/LocPrice';
import QuoteLocPrice from '../../common/utility/QuoteLocPrice';
import QuoteLocPricePP from '../../common/utility/QuoteLocPricePP';
import LocPriceUpdateTimer from '../../common/utility/LocPriceUpdateTimer';
import { closeModal, openModal } from '../../../actions/modalsInfo.js';
import { reset } from '../../../actions/locPriceUpdateTimerInfo';
import { isActive } from '../../../selectors/modalsInfo.js';
import { getCurrency, getCurrencySign } from '../../../selectors/paymentInfo';
import { getLocEurRate, getCurrencyExchangeRates } from '../../../selectors/exchangeRatesInfo.js';
import { getSeconds } from '../../../selectors/locPriceUpdateTimerInfo.js';
import { getLocAmountById, getQuotePPFiatAmount, getQuotePPAdditionalFees, getQuotePPFundsSufficient } from '../../../selectors/locAmountsInfo.js';
import RecoverWallerPassword from '../../common/utility/RecoverWallerPassword';
import { ExchangerWebsocket } from '../../../services/socket/exchangerWebsocket';

import '../../../styles/css/components/hotels/book/hotel-booking-confirm-page.css';
import ConfirmPaymentWithLocModal from './modals/ConfirmPaymentWithLocModal';
import PendingBookingLocModal from './modals/PendingBookingLocModal';
import PendingBookingFiatModal from './modals/PendingBookingFiatModal';

const ERROR_MESSAGE_TIME = 20000;
const DEFAULT_CRYPTO_CURRENCY = 'EUR';
// const TEST_FIAT_AMOUNT_IN_EUR = 15;
const PAYMENT_PROCESSOR_IDENTIFICATOR = '-PP';
const DEFAULT_QUOTE_LOC_ID = 'quote';
const DEFAULT_QUOTE_LOC_PP_ID = DEFAULT_QUOTE_LOC_ID + PAYMENT_PROCESSOR_IDENTIFICATOR;
const SAFECHARGE_VAR = 'SCPaymentModeOn';

class HotelsBookingConfirmPage extends Component {
  constructor(props) {
    super(props);

    this.timer = null;

    this.state = {
      password: '',
      isQuoteStopped: false,
      userConfirmedPaymentWithLOC: false,
      safeChargeMode: false
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onChange = this.onChange.bind(this);
    this.payWithLocSingleWithdrawer = this.payWithLocSingleWithdrawer.bind(this);
    this.createBackUrl = this.createBackUrl.bind(this);
    this.requestSafechargeMode = this.requestSafechargeMode.bind(this);
    this.handlePayWithLOC = this.handlePayWithLOC.bind(this);
  }

  componentDidMount() {
    this.requestSafechargeMode();
    this.props.requestCreateReservation();

    this.timer = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.props.dispatch(reset());
  }

  requestSafechargeMode() {
    requester.getConfigVarByName(SAFECHARGE_VAR)
      .then((res) => {
        if (res.success) {
          res.body.then((data) => {
            this.setState({
              safeChargeMode: data.value === 'true'
            });
          });
        } else {
          res.errors.then((err) => {
          });
        }
      });
  }

  getEnvironment() {
    return Config.getValue('env');
  }

  createBackUrl() {
    const { currency, location, match } = this.props;
    const queryParams = queryString.parse(location.search);
    let rooms = JSON.parse(queryParams.rooms);
    rooms.forEach((room) => {
      room.adults = room.adults.length;
    });

    const id = match.params.id;
    rooms = encodeURI(JSON.stringify(rooms));

    return `hotels/listings/${id}?region=${queryParams.region}&currency=${currency}&startDate=${queryParams.startDate}&endDate=${queryParams.endDate}&rooms=${rooms}&nat=${queryParams.nat}`;
  }

  stopQuote() {
    ExchangerWebsocket.sendMessage(
      DEFAULT_QUOTE_LOC_ID, 
      'approveQuote', 
      { bookingId: this.props.reservation.preparedBookingId }
    );

    ExchangerWebsocket.sendMessage(
      DEFAULT_QUOTE_LOC_PP_ID, 
      'approveQuote', 
      { bookingId: this.props.reservation.preparedBookingId + PAYMENT_PROCESSOR_IDENTIFICATOR }
    );

    this.setState({
      isQuoteStopped: true
    });
  }

  restartQuote() {
    ExchangerWebsocket.sendMessage(DEFAULT_QUOTE_LOC_ID, 'quoteLoc', { bookingId: this.props.reservation.preparedBookingId });
    ExchangerWebsocket.sendMessage(DEFAULT_QUOTE_LOC_PP_ID, 'quoteLoc', { bookingId: this.props.reservation.preparedBookingId + PAYMENT_PROCESSOR_IDENTIFICATOR });

    this.setState({
      isQuoteStopped: false
    });
  }

  handlePayWithCard(fiatAmount) {
    this.stopQuote();
    requester.getUserHasPendingBooking()
      .then(res => res.body).then(data => {
        if (data.userHasPendingBooking) {
          this.openModal(PENDING_BOOKING_FIAT);
        } else {
          this.payWithCard(fiatAmount);
        }
      }).catch(() => {
        this.restartQuote();
        NotificationManager.error(SERVICE_UNAVAILABLE);
      });
  }

  payWithCard(fiatAmount) {
    const { reservation, currency, location, match, quotePPLocAmount } = this.props;

    const paymentInfo = {
      fiatAmount,
      locAmount: quotePPLocAmount,
      currency,
      bookingId: reservation.preparedBookingId,
      backUrl: this.createBackUrl(),
    };

    const id = match.params.id;
    const isWebView = location.pathname.indexOf('/mobile') !== -1;
    const rootURL = !isWebView ? `/hotels/listings/book/${id}/profile` : `/mobile/hotels/listings/book/${id}/profile`;
    const search = location.search;
    this.props.history.push({
      pathname: rootURL,
      search: search,
      state: { paymentInfo: paymentInfo }
    });
  }

  getCancellationFees() {
    const hotelBooking = this.props.reservation.booking.hotelBooking;
    const arrivalDateString = hotelBooking[0].arrivalDate;
    const creationDateString = hotelBooking[0].creationDate;
    const diffDaysBetweenCreationAndArrivalDates = moment(arrivalDateString).diff(moment(creationDateString), 'days');
    let feeTable = Array(diffDaysBetweenCreationAndArrivalDates).fill({ from: '', amt: 0, locPrice: 0 }); // jagged array for storing all rooms fees
    const cancellationFees = [];

    for (let i = 0; i < hotelBooking.length; i++) {
      const creationDate = moment(hotelBooking[i].creationDate);
      if (hotelBooking[i].room.canxFees.length === 0) {
        continue;
      }
      const earliestToLatestRoomCancellationFees = hotelBooking[i].room.canxFees.sort((x, y) => {
        return x.from >= y.from ? 1 : -1; // sort ascending by 'from date'
      });

      const roomFeesByDaysBefore = Array(diffDaysBetweenCreationAndArrivalDates).fill({ amt: 0, locPrice: 0 });

      for (let j = 0; j < earliestToLatestRoomCancellationFees.length; j++) {
        const cancellation = earliestToLatestRoomCancellationFees[j];
        let fromDate = moment(cancellation.from).utc();
        const daysBefore = moment(fromDate).diff(creationDate, 'days');

        const amt = cancellation.amount.amt;
        const locPrice = cancellation.locPrice;

        roomFeesByDaysBefore.fill({ from: fromDate.format('DD MMM YYYY'), amt, locPrice }, daysBefore, roomFeesByDaysBefore.length);
      }

      feeTable = feeTable.map(function (fee, idx) {
        return { from: roomFeesByDaysBefore[idx].from, amt: fee.amt + roomFeesByDaysBefore[idx].amt, locPrice: fee.locPrice + roomFeesByDaysBefore[idx].locPrice };
      });
    }

    const uniqueFees = [...new Set(feeTable.map(item => item.amt))];

    if (uniqueFees.length === 1 && uniqueFees[0] === 0) {
      return cancellationFees;
    }

    for (let i = 0; i < feeTable.length; i++) {
      if ((i === 0 && feeTable[i].amt !== 0) || (feeTable[i].amt !== 0 && feeTable[i - 1].from !== feeTable[i].from && feeTable[i - 1].amt !== feeTable[i].amt)) {
        if (i !== 0 && feeTable[i - 1].amt === 0) {
          const creationDate = moment(creationDateString);
          cancellationFees.push({
            from: creationDate.add(i, 'days').format('YYYY-MM-DD'),
            amt: 0,
            loc: 0
          });
        }
        const creationDate = moment(creationDateString);
        cancellationFees.push({
          from: creationDate.add(i, 'days').format('YYYY-MM-DD'),
          amt: feeTable[i].amt,
          loc: feeTable[i].locPrice
        });
      }
    }

    return cancellationFees;
  }

  tokensToWei(tokens) {
    // const env = Config.getValue('env');
    // if (env === 'staging' || env === 'development') {
    //   tokens = '1';
    // }

    let index = tokens.indexOf('.');
    let trailingZeroes = 0;
    let wei = '';
    if (index === -1) {
      trailingZeroes = 18;
    } else {
      trailingZeroes = 18 - (tokens.length - 1 - index);
    }

    wei = tokens.replace(/[.,]/g, '');
    if (trailingZeroes >= 0) {
      wei = wei + '0'.repeat(trailingZeroes);
    } else {
      wei = wei.substring(0, index + 18);
    }

    return wei;
  }

  showLeavePagePromt(e) {
    e.preventDefault();
    e.returnValue = 'You have a pending transaction. Are you sure you want to leave the page?';
  }

  handlePayWithLOC() {
    this.stopQuote();
    requester.getUserHasPendingBooking()
      .then(res => res.body).then(data => {
        if (data.userHasPendingBooking) {
          this.openModal(PENDING_BOOKING_LOC);
        } else {
          this.openModal(CONFIRM_PAYMENT_WITH_LOC);
        }
      }).catch((e) => {
        this.restartQuote();
        NotificationManager.error(SERVICE_UNAVAILABLE);
      });
  }

  payWithLocSingleWithdrawer() {
    window.addEventListener('beforeunload', this.showLeavePagePromt);

    this.props.requestLockOnQuoteId('privateWallet').then(() => {
      const { password } = this.state;
      const { reservation, quoteLocAmount, locEurRate, currencyExchangeRates } = this.props;
      const preparedBookingId = reservation.preparedBookingId;

      const locAmount = quoteLocAmount || CurrencyConverter.convert(currencyExchangeRates, reservation.currency, DEFAULT_CRYPTO_CURRENCY, reservation.fiatPrice) / locEurRate;

      const wei = (this.tokensToWei(locAmount.toString()));
      const booking = reservation.booking.hotelBooking;
      const endDate = moment.utc(booking[0].arrivalDate, 'YYYY-MM-DD').add(booking[0].nights, 'days');

      NotificationManager.info(PROCESSING_TRANSACTION, 'Transactions', 60000);
      this.setState({ userConfirmedPaymentWithLOC: true });
      this.closeModal(CONFIRM_PAYMENT_WITH_LOC);

      const queryString = this.props.location.search;

      requester.getMyJsonFile().then(res => {
        res.body.then(data => {
          setTimeout(() => {

            HotelReservation.createSimpleReservationSingleWithdrawer(
              data.jsonFile,
              password,
              wei.toString(),
              endDate.unix().toString(),
            ).then(transaction => {
              const bookingConfirmObj = {
                bookingId: preparedBookingId,
                transactionHash: transaction.hash,
                queryString: queryString,
                locAmount
              };

              requester.confirmBooking(bookingConfirmObj).then(() => {
                NotificationManager.success('LOC Payment has been initiated. We will send you a confirmation message once it has been processed by the Blockchain.', '', LONG);
                window.removeEventListener('beforeunload', this.showLeavePagePromt);
                setTimeout(() => {
                  this.props.history.push('/profile/trips/hotels');
                }, 2000);
              }).catch(error => {
                this.restartQuote();
                NotificationManager.success('Something with your transaction went wrong...', '', LONG);
                window.removeEventListener('beforeunload', this.showLeavePagePromt);
              });
            }).catch(error => {
              this.restartQuote();
              if (error.hasOwnProperty('message')) {
                if (error.message === 'nonce too low') {
                  NotificationManager.warning('You have a pending transaction. Please try again later.', 'Transactions', ERROR_MESSAGE_TIME);
                } else {
                  NotificationManager.warning(error.message, 'Transactions', ERROR_MESSAGE_TIME);
                }
              } else if (error.hasOwnProperty('err') && error.err.hasOwnProperty('message')) {
                NotificationManager.warning(error.err.message, 'Transactions', ERROR_MESSAGE_TIME);
              } else if (typeof x === 'string') {
                NotificationManager.warning(error, 'Transactions', ERROR_MESSAGE_TIME);
              } else {
                NotificationManager.warning(error, 'Transactions', ERROR_MESSAGE_TIME);
              }

              this.setState({ userConfirmedPaymentWithLOC: false });
              window.removeEventListener('beforeunload', this.showLeavePagePromt);
            });
          }, 1000);
        });
      }).catch(() => {
        this.restartQuote();
      });
    }).catch(() => {
      this.restartQuote();
    });
  }

  openModal(modal, e) {
    if (e) {
      e.preventDefault();
    }

    this.props.dispatch(openModal(modal));
  }

  closeModal(modal, e, shouldRestartQuote) {
    if (e) {
      e.preventDefault();
    }

    if (shouldRestartQuote) {
      this.restartQuote();
    }

    this.props.dispatch(closeModal(modal));
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  getRoomRows(booking, currency, currencyExchangeRates) {
    const rows = [];

    if (booking) {
      booking.forEach((bookingRoom, index) => {
        const fiatPrice = currencyExchangeRates && (CurrencyConverter.convert(currencyExchangeRates, RoomsXMLCurrency.get(), currency, bookingRoom.room.totalSellingPrice.amt)).toFixed(2);
        rows.push(
          <tr key={(1 + index) * 1000} className="booking-room">
            <td>{bookingRoom.room.roomType}</td>
            <td>
              <span className="booking-price">{currency} {fiatPrice} <LocPrice fiat={bookingRoom.room.totalSellingPrice.amt} />
              </span>
            </td>
          </tr>
        );
      });

      return rows;
    }
  }

  addFreeClauseRow(rows, date) {
    rows.push(
      <tr key={1}>
        <td>{`Cancelling before ${moment(date).format('DD MMM YYYY')} will cost you`}</td>
        <td><span
          className="booking-price">{this.props.currency} 0.00 (0.00 LOC)</span>
        </td>
      </tr>
    );
  }

  addCheckInClauseRow(fees, rows, arrivalDate) {
    const { currency, reservation, currencyExchangeRates } = this.props;
    const fiatPrice = reservation && reservation.fiatPrice;
    rows.push(
      <tr key={2}>
        <td
          key={fees.length}>{`Cancelling on ${moment(arrivalDate).format('DD MMM YYYY')} will cost you`}
        </td>
        <td>
          <span className="booking-price">
            {currency} {currencyExchangeRates && (CurrencyConverter.convert(currencyExchangeRates, RoomsXMLCurrency.get(), currency, fiatPrice)).toFixed(2)} <LocPrice fiat={fiatPrice} />
          </span>
        </td>
      </tr>
    );
  }

  getRoomFees(reservation) {
    const arrivalDate = reservation.booking.hotelBooking[0].arrivalDate;
    const rows = [];
    const fees = this.getCancellationFees();
    console.log(fees);
    const { currency, currencyExchangeRates } = this.props;

    if (fees.length === 0) {
      this.addFreeClauseRow(rows, arrivalDate);
      this.addCheckInClauseRow(fees, rows, arrivalDate);
    } else {
      fees.forEach((fee, feeIndex) => {
        if (fee.amt === 0 && fee.loc === 0) {
          this.addFreeClauseRow(rows, fee.from);
        } else {
          let date = moment(fee.from)/*.add(1, 'days')*/.format('DD MMM YYYY');
          const arrivalDateFormat = moment(arrivalDate).format('DD MMM YYYY');
          let amount = fee.amt;
          if (fee.from === arrivalDate) {
            date = arrivalDate;
          } else if (date === arrivalDateFormat) {
            amount = reservation && reservation.fiatPrice;
          }

          rows.push(
            <tr key={3 * 1000 + feeIndex + 1}>
              <td>
                {`Cancelling on or after ${date} will cost you`}
              </td>
              <td>
                <span className="booking-price">
                  {currency} {currencyExchangeRates && (CurrencyConverter.convert(currencyExchangeRates, RoomsXMLCurrency.get(), currency, amount)).toFixed(2)} <LocPrice fiat={amount} />
                </span>
              </td>
            </tr>
          );
        }
      });

      if (fees[fees.length - 1].from !== arrivalDate && fees[fees.length - 1].amt !== reservation.fiatPrice) {
        this.addCheckInClauseRow(fees, rows, arrivalDate);
      }
    }

    return (
      <table>
        <thead>
          <tr>
            <th>Cancellation condition</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }

  render() {
    if (!this.props.userInfo || !this.props.reservation) {
      return <div className="loader"></div>;
    }

    const { reservation, isActive, currency, currencySign, quoteLocAmount, quotePPFiatAmount, quotePPAdditionalFees, quotePPFundsSufficient, currencyExchangeRates, userInfo, seconds } = this.props;
    const { userConfirmedPaymentWithLOC, password, isQuoteStopped, safeChargeMode } = this.state;
    const hasLocAddress = !!userInfo.locAddress;

    const booking = reservation && reservation.booking.hotelBooking;
    const essentialInformation = reservation && reservation.essentialInformation;

    const fiatAmountPP = currencyExchangeRates && quotePPFiatAmount && CurrencyConverter.convert(currencyExchangeRates, DEFAULT_CRYPTO_CURRENCY, currency, quotePPFiatAmount);
    const additionalFeesPP = currencyExchangeRates && quotePPAdditionalFees && CurrencyConverter.convert(currencyExchangeRates, DEFAULT_CRYPTO_CURRENCY, currency, quotePPAdditionalFees).toFixed(2);
    const fiatPriceInUserCurrency = currencyExchangeRates && CurrencyConverter.convert(currencyExchangeRates, reservation.currency, currency, reservation.fiatPrice).toFixed(2);

    const addFeePP = Number(additionalFeesPP) + fiatAmountPP - reservation.fiatPrice;

    return (
      <React.Fragment>
        <LocPriceUpdateTimer />

        <div className="sm-none">
          <BookingSteps steps={['Provide Guest Information', 'Review Room Details', 'Confirm and Pay']} currentStepIndex={2} />
        </div>

        <div id="room-book-confirm">
          <div className="container">
            <div className="booking-details">

              <div className="booking-details-header">
                <h2>Confirm and Pay</h2>
                <h2>{userInfo.firstName} {userInfo.lastName}</h2>
              </div>
              <hr className="header-underline" />

              <div className="confirm-pay-info">
                <div className="text-center room-dates">
                  {moment(booking[0].arrivalDate).format('DD MMM, YYYY')} <i
                    className="fa fa-long-arrow-right"></i> {moment(booking[0].arrivalDate).add(booking[0].nights, 'days').format('DD MMM, YYYY')}
                </div>
                <div className="tables-container">
                  <div className="confirm-and-pay-table">
                    <h4>Payment Details</h4>
                    <table>
                      <thead>
                        <tr>
                          <th>Room Type</th>
                          <th>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.getRoomRows(booking, currency, currencyExchangeRates)}
                      </tbody>
                    </table>
                  </div>
                  <hr className="table-splitter" />
                  <div className="confirm-and-pay-table">
                    <h4>Cancellation Details</h4>
                    {this.getRoomFees(reservation)}
                  </div>
                  <p className='billing-disclaimer'>The charge will appear on your bill as LockChain Ltd. (team@locktrip.com)</p>
                  <hr className="table-splitter" />
                  <div className="confirm-and-pay-table">
                    <h4>Essential Information</h4>
                    {essentialInformation.map(function(essen){
                      return <div>{essen}</div>
                    })}
                  </div>
                </div>
                <div className="payment-methods">
                  <div className="hide">
                    {this.props.isQuoteLocValid &&
                      <QuoteLocPricePP fiat={reservation.fiatPrice} bookingId={reservation.preparedBookingId + PAYMENT_PROCESSOR_IDENTIFICATOR} brackets={false} invalidateQuoteLoc={this.props.invalidateQuoteLoc} redirectToHotelDetailsPage={this.props.redirectToHotelDetailsPage} />}
                  </div>
                  {quotePPFundsSufficient && safeChargeMode &&
                    <div className="payment-methods-card">
                      <div className="details">
                        <p className="booking-card-price">
                          {/*Pay with Credit Card: Current Market Price: <span className="important">{currencySign} {fiatAmountPP && (fiatAmountPP).toFixed(2)}</span>*/}
                          Pay with Credit Card: Current Market Price: <span className="important">{currencySign} {fiatAmountPP && (reservation.fiatPrice).toFixed(2)}</span>
                        </p>
                        {/*<p>Additional Fees: <span className="important">{additionalFeesPP > 0 ? (currencySign + ' ' + additionalFeesPP) : 'No fees'}</span></p>*/}
                        <p>Additional Fees: <span className="important">{(additionalFeesPP > 0 &&  addFeePP > 0 )? (currencySign + ' ' + addFeePP.toFixed(2)) : 'No fees'}</span></p>
                        <div className="price-update-timer" tooltip="Seconds until we update your quoted price">
                          {!isQuoteStopped ? <span>Market Price will update in <i className="fa fa-clock-o" aria-hidden="true"></i>&nbsp;{seconds} sec &nbsp;</span> : 'Price will not update during payment'}
                        </div>
                        <div>
                          <button className="button" disabled={!fiatAmountPP} onClick={() => this.handlePayWithCard(fiatAmountPP)}>Pay with Credit Card</button>
                        </div>
                      </div>
                      <div className="logos">
                        <div className="logos-row">
                          <div className="logo credit-cards">
                            <img src={Config.getValue('basePath') + 'images/logos/credit-cards.png'} alt="Credit Cards Logos" />
                          </div>
                        </div>
                        <div className="logos-row">
                          <div className="logo safecharge">
                            <img src={Config.getValue('basePath') + 'images/logos/safecharge.png'} alt="Safecharge Logo" />
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                  <div className="payment-methods-loc">
                    <div className="details">
                      <p>Pay Directly With LOC: <span className="important">{currencySign}{currencyExchangeRates && fiatPriceInUserCurrency}</span></p>
                      <p>Order Total: <span className="important">{this.props.isQuoteLocValid && <QuoteLocPrice fiat={reservation.fiatPrice} bookingId={ reservation.preparedBookingId} brackets={false} invalidateQuoteLoc={this.props.invalidateQuoteLoc} redirectToHotelDetailsPage={this.props.redirectToHotelDetailsPage} />}</span></p>
                      {quoteLocAmount &&
                        <div className="price-update-timer" tooltip="Seconds until we update your quoted price">
                          {!isQuoteStopped ? <span>LOC price will update in <i className="fa fa-clock-o" aria-hidden="true"></i>&nbsp;{seconds} sec &nbsp;</span> : 'Price will not update during payment'}
                        </div>}
                      <p>(Click <a href={`${Config.getValue('basePath')}buyloc`} target="_blank" rel="noopener noreferrer">here</a> to learn how you can buy LOC directly to enjoy cheaper travel)</p>
                      {userConfirmedPaymentWithLOC
                        ? <button className="button" disabled>Processing Payment...</button>
                        : hasLocAddress
                          ? <button className="button" onClick={this.handlePayWithLOC}>Pay with LOC Tokens</button>
                          : <button className="button" onClick={(e) => this.openModal(CREATE_WALLET, e)}>Create Wallet</button>
                      }
                    </div>
                    <div className="logos">
                      <div className="logo loc">
                        <img src={Config.getValue('basePath') + 'images/logos/loc.jpg'} alt="Visa Logo" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ConfirmPaymentWithLocModal
            isActive={isActive[CONFIRM_PAYMENT_WITH_LOC]}
            text={'Enter your wallet password'}
            placeholder={'Wallet password'}
            handleSubmit={() => this.payWithLocSingleWithdrawer()}
            openModal={this.openModal}
            closeModal={this.closeModal}
            password={password}
            onChange={this.onChange}
          />
          <RecoverWallerPassword />
          <PendingBookingLocModal isActive={isActive[PENDING_BOOKING_LOC]} openModal={this.openModal} closeModal={this.closeModal} />
          <PendingBookingFiatModal isActive={isActive[PENDING_BOOKING_FIAT]} openModal={this.openModal} closeModal={this.closeModal} handleSubmit={() => this.payWithCard(fiatAmountPP)} />
        </div>
      </React.Fragment>
    );
  }
}

HotelsBookingConfirmPage.propTypes = {
  userInfo: PropTypes.object,
  reservation: PropTypes.object,
  isQuoteLocValid: PropTypes.bool,
  requestLockOnQuoteId: PropTypes.func,
  requestCreateReservation: PropTypes.func,
  invalidateQuoteLoc: PropTypes.func,
  redirectToHotelDetailsPage: PropTypes.func,

  // start Router props
  history: PropTypes.object,
  location: PropTypes.object,
  match: PropTypes.object,

  // start Redux props
  dispatch: PropTypes.func,
  currency: PropTypes.string,
  currencySign: PropTypes.string,
  isActive: PropTypes.object,
  locEurRate: PropTypes.number,
  currencyExchangeRates: PropTypes.object,
  quoteLocAmount: PropTypes.number,
  quotePPLocAmount: PropTypes.number,
  quotePPFiatAmount: PropTypes.number,
  quotePPFiatAdditionalFees: PropTypes.number,
  quotePPFundsSufficient: PropTypes.bool,
  seconds: PropTypes.number
};

function mapStateToProps(state) {
  const { paymentInfo, modalsInfo, exchangeRatesInfo, locAmountsInfo, locPriceUpdateTimerInfo } = state;

  return {
    currency: getCurrency(paymentInfo),
    currencySign: getCurrencySign(paymentInfo),
    isActive: isActive(modalsInfo),
    locEurRate: getLocEurRate(exchangeRatesInfo),
    currencyExchangeRates: getCurrencyExchangeRates(exchangeRatesInfo),
    quoteLocAmount: getLocAmountById(locAmountsInfo, DEFAULT_QUOTE_LOC_ID),
    quotePPLocAmount: getLocAmountById(locAmountsInfo, DEFAULT_QUOTE_LOC_PP_ID),
    quotePPFiatAmount: getQuotePPFiatAmount(locAmountsInfo),
    quotePPAdditionalFees: getQuotePPAdditionalFees(locAmountsInfo),
    quotePPFundsSufficient: getQuotePPFundsSufficient(locAmountsInfo),
    seconds: getSeconds(locPriceUpdateTimerInfo)
  };
}

export default withRouter(connect(mapStateToProps)(HotelsBookingConfirmPage));
