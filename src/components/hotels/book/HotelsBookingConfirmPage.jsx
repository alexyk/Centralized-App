import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import PropTypes from 'prop-types';
import moment from 'moment';
import queryString from 'query-string';
import { Config } from '../../../config.js';
import { PASSWORD_PROMPT, CREATE_WALLET } from '../../../constants/modals.js';
import { PROCESSING_TRANSACTION } from '../../../constants/infoMessages.js';
import { ROOM_NO_LONGER_AVAILABLE } from '../../../constants/warningMessages';
import { LONG } from '../../../constants/notificationDisplayTimes.js';
import { HotelReservation } from '../../../services/blockchain/hotelReservation';
import { RoomsXMLCurrency } from '../../../services/utilities/roomsXMLCurrency';
import { CurrencyConverter } from '../../../services/utilities/currencyConverter';
import requester from '../../../requester';
import WalletPasswordModal from '../../common/modals/WalletPasswordModal';
import BookingSteps from '../../common/utility/BookingSteps';
import LocPrice from '../../common/utility/LocPrice';
import LocPriceUpdateTimer from '../../common/utility/LocPriceUpdateTimer';
import { closeModal, openModal } from '../../../actions/modalsInfo.js';
import { setCurrency } from '../../../actions/paymentInfo';
import { setFiatAmount } from '../../../actions/dynamicLocRatesInfo';
import RecoverWallerPassword from '../../common/utility/RecoverWallerPassword';

import '../../../styles/css/components/hotels/book/hotel-booking-confirm-page.css';

const ERROR_MESSAGE_TIME = 20000;
const DEFAULT_CRYPTO_CURRENCY = 'EUR';
const TEST_FIAT_AMOUNT_IN_EUR = 15;

class HotelBookingConfirmPage extends React.Component {
  constructor(props) {
    super(props);

    this.captcha = null;

    this.state = {
      data: null,
      password: '',
      userConfirmedPaymentWithLOC: false,
      fiatPriceRoomsXML: null,
      testFiatPriceRoomsXML: null
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onChange = this.onChange.bind(this);
    this.payWithLocSingleWithdrawer = this.payWithLocSingleWithdrawer.bind(this);
    this.requestUserInfo = this.requestUserInfo.bind(this);
    this.requestBookingInfo = this.requestBookingInfo.bind(this);
    this.createBackUrl = this.createBackUrl.bind(this);
  }

  componentDidMount() {
    this.requestUserInfo();
    this.requestBookingInfo();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currenciesRatesInfo.rates !== this.props.currenciesRatesInfo.rates && this.state.fiatPriceRoomsXML) {
      const { rates } = nextProps.currenciesRatesInfo;
      const { fiatPriceRoomsXML } = this.state;
      const fiatPriceRoomsXMLInEur = rates && CurrencyConverter.convert(rates, RoomsXMLCurrency.get(), DEFAULT_CRYPTO_CURRENCY, fiatPriceRoomsXML);
      const testFiatPriceRoomsXML = rates && CurrencyConverter.convert(rates, DEFAULT_CRYPTO_CURRENCY, RoomsXMLCurrency.get(), TEST_FIAT_AMOUNT_IN_EUR);
      const testFiatPriceRoomsXMLInEur = rates && CurrencyConverter.convert(rates, RoomsXMLCurrency.get(), DEFAULT_CRYPTO_CURRENCY, testFiatPriceRoomsXML);
      this.props.dispatch(setFiatAmount(fiatPriceRoomsXMLInEur));

      this.setState({ fiatPriceRoomsXML, testFiatPriceRoomsXML, fiatPriceRoomsXMLInEur, testFiatPriceRoomsXMLInEur });

      this.props.dispatch(setFiatAmount(fiatPriceRoomsXMLInEur));
    }
  }

  componentWillUnmount() {
    this.props.dispatch(setFiatAmount(1000));
  }

  requestUserInfo() {
    requester.getUserInfo().then(res => {
      res.body.then(data => {
        this.setState({ userInfo: data });
      });
    });
  }

  requestBookingInfo() {
    const booking = this.getBooking(queryString.parse(this.props.location.search));
    requester.createReservation(booking).then(res => {
      if (res.success) {
        res.body.then(data => {
          const { rates } = this.props.currenciesRatesInfo;
          const fiatPriceRoomsXML = data.fiatPrice;
          const fiatPriceRoomsXMLInEur = rates && CurrencyConverter.convert(rates, RoomsXMLCurrency.get(), DEFAULT_CRYPTO_CURRENCY, fiatPriceRoomsXML);
          const testFiatPriceRoomsXML = rates && CurrencyConverter.convert(rates, DEFAULT_CRYPTO_CURRENCY, RoomsXMLCurrency.get(), TEST_FIAT_AMOUNT_IN_EUR);
          const testFiatPriceRoomsXMLInEur = rates && CurrencyConverter.convert(rates, RoomsXMLCurrency.get(), DEFAULT_CRYPTO_CURRENCY, testFiatPriceRoomsXML);
          this.props.dispatch(setFiatAmount(fiatPriceRoomsXMLInEur));

          this.setState({ data: data, booking: booking, fiatPriceRoomsXML, testFiatPriceRoomsXML, fiatPriceRoomsXMLInEur, testFiatPriceRoomsXMLInEur });
        });
      } else {
        res.errors.then((res) => {
          const errors = res.errors;
          console.log(errors);
          if (errors.hasOwnProperty('RoomsXmlResponse')) {
            if (errors['RoomsXmlResponse'].message.indexOf('QuoteNotAvailable:') !== -1) {
              NotificationManager.warning(ROOM_NO_LONGER_AVAILABLE, '', LONG);
              const pathname = this.props.location.pathname.indexOf('/mobile') !== -1 ? '/mobile/details' : '/hotels/listings';
              const id = this.props.match.params.id;
              const search = this.getQueryString(queryString.parse(this.props.location.search));
              this.props.history.push(`${pathname}/${id}${search}`);
            }
          } else {
            for (let key in errors) {
              if (typeof errors[key] !== 'function') {
                NotificationManager.warning(errors[key].message, '', LONG);
              }
            }
          }
        });
      }
    });
  }

  getBooking(queryParams) {
    return {
      currency: queryParams.currency,
      rooms: JSON.parse(queryParams.rooms),
      quoteId: queryParams.quoteId
    };
  }

  getQueryString(queryStringParameters) {
    let queryString = '?';
    queryString += 'region=' + encodeURI(queryStringParameters.region);
    queryString += '&currency=' + encodeURI(queryStringParameters.currency);
    queryString += '&startDate=' + encodeURI(queryStringParameters.startDate);
    queryString += '&endDate=' + encodeURI(queryStringParameters.endDate);
    queryString += '&rooms=' + encodeURI(queryStringParameters.rooms);
    return queryString;
  }

  getEnvironment() {
    return Config.getValue('env');
  }

  createBackUrl() {
    const currency = this.props.paymentInfo.currency;
    const queryParams = queryString.parse(this.props.location.search);
    let rooms = JSON.parse(queryParams.rooms);
    rooms.forEach((room) => {
      room.adults = room.adults.length;
    });

    const id = this.props.match.params.id;
    rooms = encodeURI(JSON.stringify(rooms));

    return `hotels/listings/${id}?region=${queryParams.region}&currency=${currency}&startDate=${queryParams.startDate}&endDate=${queryParams.endDate}&rooms=${rooms}`;
  }

  payWithCard() {
    const { data, testFiatPriceRoomsXML, testFiatPriceRoomsXMLInEur, fiatPriceRoomsXML, fiatPriceRoomsXMLInEur } = this.state;
    const { rates } = this.props.currenciesRatesInfo;
    const { currency } = this.props.paymentInfo;
    const { locAmounts } = this.props.locAmountsInfo;

    let fiatAmount;
    let locAmount;
    let quotedPair;

    if (this.getEnvironment() === 'production') {
      fiatAmount = CurrencyConverter.convert(rates, RoomsXMLCurrency.get(), currency, fiatPriceRoomsXML);
      locAmount = locAmounts[fiatPriceRoomsXMLInEur].locAmount;
      quotedPair = locAmounts[fiatPriceRoomsXMLInEur].quotedPair;
    } else {
      fiatAmount = CurrencyConverter.convert(rates, RoomsXMLCurrency.get(), currency, testFiatPriceRoomsXML);
      locAmount = locAmounts[testFiatPriceRoomsXMLInEur].locAmount;
      quotedPair = locAmounts[testFiatPriceRoomsXMLInEur].quotedPair;
    }

    const paymentInfo = {
      fiatAmount,
      locAmount,
      quotedPair,
      currency,
      bookingId: data.preparedBookingId,
      backUrl: this.createBackUrl(),
    };

    const id = this.props.match.params.id;
    const isWebView = this.props.location.pathname.indexOf('/mobile') !== -1;
    const rootURL = !isWebView ? `/hotels/listings/book/${id}/profile` : `/mobile/book/${id}/profile`;
    const search = this.props.location.search;
    this.props.history.push({
      pathname: rootURL,
      search: search,
      state: { paymentInfo: paymentInfo, testFiatPriceRoomsXMLInEur }
    });
  }

  getCancellationFees() {
    const hotelBooking = this.state.data.booking.hotelBooking;
    const arrivalDateString = hotelBooking[0].arrivalDate;
    const creationDateString = hotelBooking[0].creationDate;
    const diffDaysBetweenCreationAndArrivalDates = moment(arrivalDateString, 'YYYY-MM-DD').diff(moment(creationDateString, 'YYYY-MM-DD'), 'days');
    let feeTable = Array(diffDaysBetweenCreationAndArrivalDates).fill({ from: '', amt: 0, locPrice: 0 }); // jagged array for storing all rooms fees
    const cancellationFees = [];

    for (let i = 0; i < hotelBooking.length; i++) {
      const creationDate = moment(hotelBooking[i].creationDate, 'YYYY-MM-DD');
      if (hotelBooking[i].room.canxFees.length === 0) {
        continue;
      }
      const earliestToLatestRoomCancellationFees = hotelBooking[i].room.canxFees.sort((x, y) => {
        return x.from >= y.from ? 1 : -1; // sort ascending by 'from date'
      });

      const roomFeesByDaysBefore = Array(diffDaysBetweenCreationAndArrivalDates).fill({ amt: 0, locPrice: 0 });

      for (let j = 0; j < earliestToLatestRoomCancellationFees.length; j++) {
        const cancellation = earliestToLatestRoomCancellationFees[j];
        let fromDate = moment(cancellation.from);

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
          const creationDate = moment(creationDateString, 'YYYY-MM-DD');
          cancellationFees.push({
            from: creationDate.add(i, 'days').format('YYYY-MM-DD'),
            amt: 0,
            loc: 0
          });
        }
        const creationDate = moment(creationDateString, 'YYYY-MM-DD');
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
    const env = Config.getValue('env');
    if (env === 'staging' || env === 'development') {
      tokens = '1';
    }

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

  payWithLocSingleWithdrawer() {
    this.props.requestLockOnQuoteId().then(() => {
      const password = this.state.password;
      const preparedBookingId = this.state.data.preparedBookingId;
      const wei = (this.tokensToWei(this.state.data.locPrice.toString()));
      console.log(wei);
      const booking = this.state.data.booking.hotelBooking;
      const endDate = moment.utc(booking[0].arrivalDate, 'YYYY-MM-DD').add(booking[0].nights, 'days');

      NotificationManager.info(PROCESSING_TRANSACTION, 'Transactions', 60000);
      this.setState({ userConfirmedPaymentWithLOC: true });
      this.closeModal(PASSWORD_PROMPT);

      const queryString = this.props.location.search;

      requester.getMyJsonFile().then(res => {
        res.body.then(data => {
          setTimeout(() => {
            console.log('HotelBookingConfirmPage.jsx, wei:', wei.toString());
            console.log('HotelBookingConfirmPage.jsx, end date:', endDate.unix().toString());

            HotelReservation.createSimpleReservationSingleWithdrawer(
              data.jsonFile,
              password,
              wei.toString(),
              endDate.unix().toString(),
            ).then(transaction => {
              console.log('transaction', transaction);
              const bookingConfirmObj = {
                bookingId: preparedBookingId,
                transactionHash: transaction.hash,
                queryString: queryString,
                locAmount: this.state.locPrice
              };

              requester.confirmBooking(bookingConfirmObj).then(() => {
                NotificationManager.success('LOC Payment has been initiated. We will send you a confirmation message once it has been processed by the Blockchain.', '', LONG);
                setTimeout(() => {
                  this.props.history.push('/profile/trips/hotels');
                }, 2000);
              }).catch(error => {
                NotificationManager.success('Something with your transaction went wrong...', '', LONG);
                console.log(error);
              });
            }).catch(error => {
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

              this.closeModal(PASSWORD_PROMPT);
              this.setState({ userConfirmedPaymentWithLOC: false });
            });
          }, 1000);
        });
      });
    });
  }


  openModal(modal, e) {
    if (e) {
      e.preventDefault();
    }

    this.props.dispatch(openModal(modal));
  }

  closeModal(modal, e) {
    if (e) {
      e.preventDefault();
    }

    this.props.dispatch(closeModal(modal));
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  getRoomRows(booking) {
    const rows = [];

    if (booking) {
      const { paymentInfo, currenciesRatesInfo } = this.props;
      booking.forEach((bookingRoom, index) => {
        const fiatPrice = currenciesRatesInfo.rates && (CurrencyConverter.convert(currenciesRatesInfo.rates, RoomsXMLCurrency.get(), paymentInfo.currency, bookingRoom.room.totalSellingPrice.amt)).toFixed(2);
        rows.push(
          <tr key={(1 + index) * 1000} className="booking-room">
            <td>{bookingRoom.room.roomType.text}</td>
            <td>
              <span className="booking-price">{paymentInfo.currency} {fiatPrice} <LocPrice fiat={bookingRoom.room.totalSellingPrice.amt} method="quoteLoc" withTimer />
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
        <td>{`Cancelling on or before ${moment(date).format('DD MMM YYYY')} will cost you`}</td>
        <td><span
          className="booking-price">{this.props.paymentInfo.currency} 0.00 (0.00 LOC)</span>
        </td>
      </tr>
    );
  }

  addCheckInClauseRow(fees, rows, arrivalDate) {
    const fiatPrice = this.state.data && this.state.data.fiatPrice;
    const { currency } = this.props.paymentInfo;
    const { rates } = this.props.currenciesRatesInfo;
    rows.push(
      <tr key={2}>
        <td
          key={fees.length}>{`Cancelling on ${moment(arrivalDate).format('DD MMM YYYY')} will cost you`}
        </td>
        <td>
          <span className="booking-price">
            {currency} {rates && (CurrencyConverter.convert(rates, RoomsXMLCurrency.get(), currency, fiatPrice)).toFixed(2)} <LocPrice fiat={fiatPrice} method="quoteLoc" withTimer />
          </span>
        </td>
      </tr>
    );
  }

  getRoomFees() {
    const arrivalDate = this.state.data.booking.hotelBooking[0].arrivalDate;
    const rows = [];
    const fees = this.getCancellationFees();
    const { currency } = this.props.paymentInfo;
    const { rates } = this.props.currenciesRatesInfo;

    if (fees.length === 0) {
      this.addFreeClauseRow(rows, arrivalDate);
      this.addCheckInClauseRow(fees, rows, arrivalDate);
    } else {
      fees.forEach((fee, feeIndex) => {
        if (fee.amt === 0 && fee.loc === 0) {
          this.addFreeClauseRow(rows, fee.from);
        } else {
          let date = moment(fee.from).add(1, 'days').format('DD MMM YYYY');
          const arrivalDateFormat = moment(arrivalDate).format('DD MMM YYYY');
          let amount = fee.amt;
          if (fee.from === arrivalDate) {
            date = arrivalDate;
          } else if (date === arrivalDateFormat) {
            amount = this.state.data && this.state.data.fiatPrice;
          }
          rows.push(
            <tr key={3 * 1000 + feeIndex + 1}>
              <td>
                {`Canceling on or after ${date} will cost you`}
              </td>
              <td>
                <span className="booking-price">
                  {currency} {rates && (CurrencyConverter.convert(rates, RoomsXMLCurrency.get(), currency, amount)).toFixed(2)} <LocPrice fiat={amount} method="quoteLoc" withTimer />
                </span>
              </td>
            </tr>
          );
        }
      });

      if (fees[fees.length - 1].from !== arrivalDate && fees[fees.length - 1].amt !== this.state.data.fiatPrice) {
        this.addCheckInClauseRow(fees, rows, arrivalDate);
      }
    }

    return (
      <table>
        <thead>
          <tr>
            <th>Cancelation condition</th>
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
    const { data, userInfo, userConfirmedPaymentWithLOC, password, fiatPriceRoomsXML, testFiatPriceRoomsXML } = this.state;
    const hasLocAddress = !!this.props.userInfo.locAddress;
    const { rates } = this.props.currenciesRatesInfo;
    if (userInfo == null) {
      return <div className="loader"></div>;
    }
    const isMobile = this.props.location.pathname.indexOf('/mobile') !== -1;

    const booking = data && data.booking.hotelBooking;
    const { currency, currencySign } = this.props.paymentInfo;
    const env = this.getEnvironment();

    return (
      <React.Fragment>
        <div className="sm-none">
          <BookingSteps steps={['Provide Guest Information', 'Review Room Details', 'Confirm and Pay']} currentStepIndex={2} />
        </div>

        {!data ?
          <div className="loader"></div> :
          <div id="room-book-confirm">
            <div className="container">
              <div className="booking-details">

                <div className="booking-details-header">
                  <h2>Confirm and Pay</h2>
                  <h2>{this.props.userInfo.firstName} {this.props.userInfo.lastName}</h2>
                </div>
                <hr className="header-underline" />

                <div className="confirm-pay-info">
                  <div className="text-center room-dates">
                    {moment(booking[0].arrivalDate, 'YYYY-MM-DD').format('DD MMM, YYYY')} <i
                      className="fa fa-long-arrow-right"></i> {moment(booking[0].arrivalDate, 'YYYY-MM-DD').add(booking[0].nights, 'days').format('DD MMM, YYYY')}
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
                          {this.getRoomRows(booking)}
                        </tbody>
                      </table>
                    </div>
                    <hr className="table-splitter" />
                    <div className="confirm-and-pay-table">
                      <h4>Cancelation Details</h4>
                      {this.getRoomFees(booking)}
                    </div>
                    <div className="billing-disclaimer">The charge will appear on your bill as LockChain Ltd. (team@locktrip.com)</div>
                  </div>
                  <div className="payment-methods">
                    <div className="payment-methods-card">
                      <div className="details">
                        {(env === 'development' || env === 'staging') &&
                          <p style={{ color: 'red' }}>
                            <strong>Pay with Credit Card: TEST Price: {currencySign} {rates && (CurrencyConverter.convert(rates, DEFAULT_CRYPTO_CURRENCY, currency, 15)).toFixed(2)}</strong>
                          </p>}
                        <p className="booking-card-price">
                          Pay with Credit Card: Current Market Price: <span className="important">{currencySign}{fiatPriceRoomsXML && rates && (CurrencyConverter.convert(rates, RoomsXMLCurrency.get(), currency, fiatPriceRoomsXML)).toFixed(2)}</span>
                        </p>
                        <button className="btn btn-primary" disabled={!this.props.locAmountsInfo.locAmounts[this.state.testFiatPriceRoomsXMLInEur]} onClick={() => this.payWithCard()}>Pay with Credit Card</button>
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
                    <div className="payment-methods-loc">
                      <div className="details">
                        {(env === 'development' || env === 'staging') &&
                          <p style={{ color: 'red' }}>
                            <strong>Pay Directly With LOC: TEST Price: {currencySign} {rates && (CurrencyConverter.convert(rates, DEFAULT_CRYPTO_CURRENCY, currency, 15)).toFixed(2)}</strong>
                          </p>}
                        <p>Pay Directly With LOC: <span className="important">{currencySign}{rates && fiatPriceRoomsXML && (CurrencyConverter.convert(rates, RoomsXMLCurrency.get(), currency, fiatPriceRoomsXML)).toFixed(2)}</span></p>
                        {(env === 'development' || env === 'staging') &&
                          <p style={{ color: 'red' }}>
                            <strong>Order Total: TEST Price: <LocPrice fiat={testFiatPriceRoomsXML} method="quoteLoc" params={{ bookingId: data.preparedBookingId }} brackets={false} withTimer /></strong>
                          </p>}
                        <p>Order Total: <span className="important"><LocPrice fiat={fiatPriceRoomsXML} method="quoteLoc" brackets={false} withTimer /></span></p>
                        <div className="price-update-timer" tooltip="Seconds until we update your quoted price">
                          LOC price will update in <i className="fa fa-clock-o" aria-hidden="true"></i>&nbsp;{<LocPriceUpdateTimer initialSeconds={10} />} sec &nbsp;
                        </div>
                        <p>(Click <a href="">here</a> to learn how you can buy LOC directly to enjoy cheaper travel)</p>
                        {userConfirmedPaymentWithLOC
                          ? <button className="btn btn-primary" disabled>Processing Payment...</button>
                          : hasLocAddress 
                            ? <button className="btn btn-primary" onClick={(e) => this.openModal(PASSWORD_PROMPT, e)}>Pay with LOC Tokens</button>
                            : <button className="btn btn-primary" onClick={(e) => this.openModal(CREATE_WALLET, e)}>Create Wallet</button>
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
              {isMobile &&
                <div>
                  <button className="btn btn-primary btn-book" onClick={(e) => this.props.history.goBack()}>Back</button>
                  <select
                    className="currency"
                    value={currency}
                    style={{ 'height': '40px', 'marginBottom': '10px', 'textAlignLast': 'right', 'paddingRight': '45%', 'direction': 'rtl' }}
                    onChange={(e) => this.props.dispatch(setCurrency(e.target.value))}
                  >
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              }
            </div>
            <WalletPasswordModal
              isActive={this.props.modalsInfo.isActive[PASSWORD_PROMPT]}
              text={'Enter your wallet password'}
              placeholder={'Wallet password'}
              handleSubmit={() => this.payWithLocSingleWithdrawer()}
              openModal={this.openModal}
              closeModal={this.closeModal}
              password={password}
              onChange={this.onChange}
            />
            <RecoverWallerPassword />
          </div>
        }
      </React.Fragment>
    );
  }
}

HotelBookingConfirmPage.propTypes = {
  requestLockOnQuoteId: PropTypes.func,

  // start Router props
  history: PropTypes.object,
  location: PropTypes.object,
  match: PropTypes.object,

  // start Redux props
  dispatch: PropTypes.func,
  userInfo: PropTypes.object,
  paymentInfo: PropTypes.object,
  modalsInfo: PropTypes.object,
  currenciesRatesInfo: PropTypes.object,
  locAmountsInfo: PropTypes.object
};

function mapStateToProps(state) {
  const { userInfo, paymentInfo, modalsInfo, currenciesRatesInfo, locAmountsInfo } = state;
  return {
    userInfo,
    paymentInfo,
    modalsInfo,
    currenciesRatesInfo,
    locAmountsInfo
  };
}

export default withRouter(connect(mapStateToProps)(HotelBookingConfirmPage));
