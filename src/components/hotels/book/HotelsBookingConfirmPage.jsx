import '../../../styles/css/components/hotels/book/hotel-booking-confirm-page.css';

import { EXTRA_LONG, LONG } from '../../../constants/notificationDisplayTimes.js';
import { Link, withRouter } from 'react-router-dom';
import { closeModal, openModal } from '../../../actions/modalsInfo.js';
import { setBookingCofirmPage, setCurrency, setLocRate, setLocRateInEur } from '../../../actions/paymentInfo';

import { Config } from '../../../config.js';
import { CurrencyConverter } from '../../../services/utilities/currencyConverter';
import { HotelReservation } from '../../../services/blockchain/hotelReservation';
import { LOC_PAYMENT_INITIATED } from '../../../constants/successMessages.js';
import { NotificationManager } from 'react-notifications';
import { PASSWORD_PROMPT } from '../../../constants/modals.js';
import { PROCESSING_TRANSACTION } from '../../../constants/infoMessages.js';
import PasswordModal from '../../common/modals/PasswordModal';
import PropTypes from 'prop-types';
import React from 'react';
import { RoomsXMLCurrency } from '../../../services/utilities/roomsXMLCurrency';
import { SEARCH_EXPIRED } from '../../../constants/infoMessages.js';
import { connect } from 'react-redux';
import moment from 'moment';
import queryString from 'query-string';
import requester from '../../../initDependencies';
import BookingSteps from '../../common/utility/BookingSteps';
import { setBestLocPrice } from '../../../actions/bookingBestPrice';

// import SMSCodeModal from '../modals/SMSCodeModal';

const ERROR_MESSAGE_TIME = 20000;
const SEARCH_EXPIRE_TIME = 900000;
const DEFAULT_CRYPTO_CURRENCY = 'EUR';
const TEST_FIAT_AMOUNT_IN_EUR = 15;
const SOCKET_RECONNECT_DELAY = 5000;

class HotelBookingConfirmPage extends React.Component {
  constructor(props) {
    super(props);

    this.captcha = null;
    this.timer = null;
    this.socket = null;
    this.testLocPrice = null;
    this.shoudSocketReconnect = true;

    this.state = {
      data: null,
      showRoomsCanxDetails: false,
      loading: true,
      password: '',
      confirmed: false,
      fiatPriceRoomsXML: null,
      locPrice: null,
      locRate: null,
      seconds: 30,
      testLocPrice: null
    };

    this.timeout = null;

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.toggleCanxDetails = this.toggleCanxDetails.bind(this);
    this.handleSubmitSingleWithdrawer = this.handleSubmitSingleWithdrawer.bind(this);
    this.requestUserInfo = this.requestUserInfo.bind(this);
    this.requestBookingInfo = this.requestBookingInfo.bind(this);
    this.requestCurrencyRates = this.requestCurrencyRates.bind(this);
    this.setSearchExpirationTimeout = this.setSearchExpirationTimeout.bind(this);
    this.tick = this.tick.bind(this);

    // SOCKET BINDINGS
    this.initializeSocket = this.initializeSocket.bind(this);
    this.connectSocket = this.connectSocket.bind(this);
    this.handleReceiveMessage = this.handleReceiveMessage.bind(this);
    this.disconnectSocket = this.disconnectSocket.bind(this);
    this.socketClose = this.socketClose.bind(this);
  }

  componentDidMount() {
    this.requestUserInfo();
    this.requestBookingInfo();
    this.requestCurrencyRates();
    this.setSearchExpirationTimeout();

    this.props.dispatch(setBookingCofirmPage(true));
  }

  componentWillReceiveProps(nextProps) {
    const { currency } = nextProps.paymentInfo;
    if (currency !== this.props.paymentInfo.currency) {
      localStorage['currency'] = currency;
      const { fiatPriceRoomsXML, rates } = this.state;
      const fiatAmount = fiatPriceRoomsXML && CurrencyConverter.convert(rates, RoomsXMLCurrency.get(), DEFAULT_CRYPTO_CURRENCY, fiatPriceRoomsXML);
      this.setLocRateInRedux(fiatAmount / this.state.locPrice, this.calculateLocRate(this.state.locPrice, currency, fiatAmount));
    }
  }

  requestUserInfo() {
    requester.getUserInfo().then(res => {
      res.body.then(data => {
        this.setState({ userInfo: data });
      });
    });
  }

  requestBookingInfo() {
    const search = this.props.location.search;
    const searchParams = this.getSearchParams(search);
    const booking = JSON.parse(decodeURI(searchParams.get('booking')));
    requester.createReservation(booking).then(res => {
      if (res.success) {
        res.body.then(data => {
          const fiatPriceRoomsXML = data.fiatPrice;
          this.setState({ data: data, booking: booking, fiatPriceRoomsXML }, () => this.initializeSocket());
        });
      } else {
        res.errors.then((res) => {
          const errors = res.errors;
          console.log(errors);
          if (errors.hasOwnProperty('RoomsXmlResponse')) {
            if (errors['RoomsXmlResponse'].message.indexOf('QuoteNotAvailable:') !== -1) {
              NotificationManager.warning('Room is no longer available', '', LONG);
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

  getQueryString(queryStringParameters) {
    let queryString = '?';
    queryString += 'region=' + encodeURI(queryStringParameters.region);
    queryString += '&currency=' + encodeURI(queryStringParameters.currency);
    queryString += '&startDate=' + encodeURI(queryStringParameters.startDate);
    queryString += '&endDate=' + encodeURI(queryStringParameters.endDate);
    queryString += '&rooms=' + encodeURI(queryStringParameters.rooms);
    return queryString;
  }

  requestCurrencyRates() {
    requester.getCurrencyRates().then(res => {
      res.body.then(data => {
        this.setState({ rates: data });
      });
    });
  }

  getLocEurRate() {
    requester.getLocRateByCurrency(DEFAULT_CRYPTO_CURRENCY).then(res => {
      res.body.then(data => {
        const locEurRate = data[0]['price_eur'];
        if (locEurRate && locEurRate !== 0) {
          const testLocPrice = TEST_FIAT_AMOUNT_IN_EUR / locEurRate;
          const locPrice = CurrencyConverter.convert(this.state.rates, RoomsXMLCurrency.get(), DEFAULT_CRYPTO_CURRENCY, this.state.fiatPriceRoomsXML) / locEurRate;
          this.setState({
            locPrice,
            locRate: locEurRate,
            testLocPrice
          }, () => {
            this.setLocRateInRedux(locEurRate, this.calculateLocRate(this.state.locPrice, RoomsXMLCurrency.get(), this.state.fiatPriceRoomsXML));
          });
        }
      });
    });
  }

  setSearchExpirationTimeout() {
    this.timeout = setTimeout(() => {
      NotificationManager.info(SEARCH_EXPIRED, '', EXTRA_LONG);
      this.props.history.push('/hotels');
    }, SEARCH_EXPIRE_TIME);
  }

  componentWillUnmount() {
    this.props.dispatch(setBookingCofirmPage(false));
    clearTimeout(this.timeout);
    clearInterval(this.timer);
    this.disconnectSocket();
  }

  tick() {
    const { seconds } = this.state;
    let { locPrice, locRate, testLocPrice } = this.state;
    if (seconds === 1) {
      const bestLocPrice = this.props.bookingBestPrice.locPrice;
      const testLocPrice = this.testLocPrice;
      const locRate = this.props.paymentInfo.locRateInEur;
      this.setState({
        locPrice: bestLocPrice,
        seconds: 30,
        locRate,
        testLocPrice
      });
    } else {
      if (locPrice === null) {
        locPrice = this.props.bookingBestPrice.locPrice;
      }
      if (testLocPrice === null) {
        testLocPrice = this.testLocPrice;
      }
      if (!locRate) {
        locRate = this.props.paymentInfo.locRateInEur;
      }
      this.setState((prevState) => {
        return {
          seconds: prevState.seconds - 1,
          locPrice,
          locRate,
          testLocPrice
        };
      });
    }
  }

  setLocRateInRedux(locEurRate, locCurrentCurrencyRate) {
    this.props.dispatch(setLocRateInEur(locEurRate, true, 'ConfirmPage'));
    this.props.dispatch(setLocRate(locCurrentCurrencyRate, true, 'ConfirmPage'));
  }

  calculateLocRate(locAmount, currency, fiatAmount) {
    const fiat = this.state.rates && CurrencyConverter.convert(this.state.rates, DEFAULT_CRYPTO_CURRENCY, currency, fiatAmount);
    return fiat / locAmount;
  }

  initializeSocket() {
    this.socket = new WebSocket(Config.getValue('SOCKET_HOST_PRICE'));
    this.socket.onmessage = this.handleReceiveMessage;
    this.socket.onopen = this.connectSocket;
    this.socket.onclose = this.socketClose;
  }

  connectSocket() {
    const { fiatPriceRoomsXML, rates } = this.state;
    const fiatAmount = fiatPriceRoomsXML && CurrencyConverter.convert(rates, RoomsXMLCurrency.get(), DEFAULT_CRYPTO_CURRENCY, fiatPriceRoomsXML);
    this.socket.send(JSON.stringify({ id: 'real', fiatAmount }));
    this.socket.send(JSON.stringify({ id: 'test', fiatAmount: TEST_FIAT_AMOUNT_IN_EUR }));
    this.timer = setInterval(this.tick, 1000);
  }

  handleReceiveMessage(event) {
    let locPrice;
    const data = JSON.parse(event.data);
    if (data.id === 'real') {
      locPrice = data.locAmount;

      const { fiatPriceRoomsXML, rates } = this.state;
      const fiatAmount = fiatPriceRoomsXML && CurrencyConverter.convert(rates, RoomsXMLCurrency.get(), DEFAULT_CRYPTO_CURRENCY, fiatPriceRoomsXML);
      this.setLocRateInRedux(fiatAmount / locPrice, this.calculateLocRate(locPrice, this.props.paymentInfo.currency, fiatAmount));
      this.props.dispatch(setBestLocPrice(locPrice));
    } else if (data.id === 'test') {
      this.testLocPrice = data.locAmount;
    }
  }

  disconnectSocket() {
    this.shoudSocketReconnect = false;
    if (this.socket) {
      this.socket.close();
    }
  }

  socketClose() {
    if (this.shoudSocketReconnect) {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
        this.setState({
          seconds: 30
        });
      }
      this.getLocEurRate();
      setTimeout(() => {
        this.initializeSocket();
      }, SOCKET_RECONNECT_DELAY);
    }
  }

  getEnvironment() {
    return Config.getValue('env');
  }

  payWithCreditCard(path) {
    const form = document.createElement('form');
    form.method = 'post';
    form.action = path;
    form.style = 'display: none';

    document.body.appendChild(form);
    form.submit();
  }

  createBackUrl() {
    const currency = this.props.paymentInfo.currency;
    const queryParams = queryString.parse(this.props.location.search);
    const decodeBooking = JSON.parse(decodeURI(queryParams.booking));
    let rooms = decodeBooking.rooms;
    rooms.forEach((room) => {
      room.adults = room.adults.length;
    });

    const id = this.props.match.params.id;
    rooms = encodeURI(JSON.stringify(rooms));

    return `hotels/listings/${id}?region=${queryParams.region}&currency=${currency}&startDate=${queryParams.startDate}&endDate=${queryParams.endDate}&rooms=${rooms}`;
  }

  payWithCard() {
    const { data, locPrice, fiatPriceRoomsXML, rates, testLocPrice } = this.state;
    const currency = this.props.paymentInfo.currency;
    let fiatAmount;
    let locAmount;
    if (this.getEnvironment() === 'production') {
      fiatAmount = CurrencyConverter.convert(rates, RoomsXMLCurrency.get(), currency, fiatPriceRoomsXML);
      locAmount = locPrice;
    } else {
      fiatAmount = CurrencyConverter.convert(rates, DEFAULT_CRYPTO_CURRENCY, currency, TEST_FIAT_AMOUNT_IN_EUR);
      locAmount = testLocPrice;
    }
    const paymentInfo = {
      fiatAmount,
      locAmount,
      currency,
      bookingId: data.preparedBookingId,
      backUrl: this.createBackUrl(),
    };

    const search = this.props.location.search;
    const id = this.props.match.params.id;
    this.props.history.push({
      pathname: `/hotels/listings/book/profile/${id}`,
      search: search,
      state: { paymentInfo: paymentInfo }
    });
  }

  getSearchParams() {
    const map = new Map();
    const pairs = this.props.location.search.substr(1).split('&');
    for (let i = 0; i < pairs.length; i++) {
      let pair = pairs[i].split('=');
      map.set(pair[0], pair[1]);
    }

    return map;
  }

  getNumberOfTravelers() {
    const rooms = this.state.booking.rooms;
    let numberOfTravelers = 0;
    for (let i = 0; i < rooms.length; i++) {
      numberOfTravelers += rooms[i].adults.length;
      numberOfTravelers += rooms[i].children.length;
    }

    return numberOfTravelers;
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

  handleSubmit() {
    requester.getCancellationFees(this.state.data.preparedBookingId).then(res => {
      res.body.then(data => {
        const password = this.state.password;
        const preparedBookingId = this.state.data.preparedBookingId;
        // console.log(preparedBookingId);
        const wei = (this.tokensToWei(this.state.data.locPrice.toString()));
        // console.log(wei);
        const booking = this.state.data.booking.hotelBooking;
        const startDate = moment.utc(booking[0].arrivalDate, 'YYYY-MM-DD');
        const endDate = moment.utc(booking[0].arrivalDate, 'YYYY-MM-DD').add(booking[0].nights, 'days');
        // const daysBeforeStartOfRefund = ['0'];
        // const refundPercentages = ['100'];
        const hotelId = this.props.match.params.id;
        const roomId = this.state.booking.quoteId;
        const numberOfTravelers = this.getNumberOfTravelers();
        const cancellationFees = data;
        const daysBeforeStartOfRefund = [];
        const refundPercentages = [];
        for (let key in cancellationFees) {
          daysBeforeStartOfRefund.unshift(key.toString());
          refundPercentages.unshift(cancellationFees[key].toString());
        }

        NotificationManager.info(PROCESSING_TRANSACTION, 'Transactions', 0);
        this.setState({ confirmed: true });
        this.closeModal(PASSWORD_PROMPT);

        const queryString = this.props.location.search;

        requester.getMyJsonFile().then(res => {
          res.body.then(data => {
            setTimeout(() => {
              HotelReservation.createReservation(
                data.jsonFile,
                password,
                preparedBookingId.toString(),
                wei,
                startDate.unix().toString(),
                endDate.unix().toString(),
                daysBeforeStartOfRefund,
                refundPercentages,
                hotelId,
                roomId,
                numberOfTravelers.toString()
              ).then(transaction => {
                const bookingConfirmObj = {
                  bookingId: preparedBookingId,
                  transactionHash: transaction.hash,
                  queryString: queryString
                };

                // console.log(bookingConfirmObj);
                requester.confirmBooking(bookingConfirmObj).then(() => {
                  NotificationManager.success(LOC_PAYMENT_INITIATED, '', LONG);
                  setTimeout(() => {
                    this.props.history.push('/profile/trips/hotels');
                  }, 2000);
                });
              }).catch(error => {
                if (error.hasOwnProperty('message')) {
                  NotificationManager.warning(error.message, 'Transactions', LONG);
                } else if (error.hasOwnProperty('err') && error.err.hasOwnProperty('message')) {
                  NotificationManager.warning(error.err.message, 'Transactions', LONG);
                } else if (typeof x === 'string') {
                  NotificationManager.warning(error, 'Transactions', LONG);
                } else {
                  NotificationManager.warning(error, '', LONG);
                }

                this.closeModal(PASSWORD_PROMPT);
                this.setState({ confirmed: false });
              });
            }, 1000);
          });
        });
      });
    });
  }

  handleSubmitSingleWithdrawer() {
    const password = this.state.password;
    const preparedBookingId = this.state.data.preparedBookingId;
    const wei = (this.tokensToWei(this.state.data.locPrice.toString()));
    console.log(wei);
    const booking = this.state.data.booking.hotelBooking;
    const endDate = moment.utc(booking[0].arrivalDate, 'YYYY-MM-DD').add(booking[0].nights, 'days');

    NotificationManager.info(PROCESSING_TRANSACTION, 'Transactions', 60000);
    this.setState({ confirmed: true });
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
            this.setState({ confirmed: false });
          });
        }, 1000);
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

  toggleCanxDetails() {
    this.setState({ showRoomsCanxDetails: !this.state.showRoomsCanxDetails });
  }

  getRoomRows(booking) {
    const rows = [];

    if (booking) {
      const { paymentInfo } = this.props;
      booking.forEach((bookingRoom, index) => {
        const fiatPrice = this.state.rates && (CurrencyConverter.convert(this.state.rates, RoomsXMLCurrency.get(), paymentInfo.currency, bookingRoom.room.totalSellingPrice.amt)).toFixed(2);
        const locPrice = this.state.rates && this.state.locRate && (CurrencyConverter.convert(this.state.rates, RoomsXMLCurrency.get(), DEFAULT_CRYPTO_CURRENCY, bookingRoom.room.totalSellingPrice.amt) / this.state.locRate).toFixed(4);
        rows.push(
          <tr key={(1 + index) * 1000} className="booking-room">
            <td>{bookingRoom.room.roomType.text}</td>
            <td>
              <span className="booking-price">{paymentInfo.currency} {fiatPrice} ({locPrice} LOC)
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
          className="booking-price">{this.props.paymentInfo.currency} 0.00 (0.0000 LOC)</span>
        </td>
      </tr>
    );
  }

  addCheckInClauseRow(fees, rows, arrivalDate) {
    const fiatPrice = this.state.data && this.state.data.fiatPrice;
    const currency = this.props.paymentInfo.currency;
    rows.push(
      <tr key={2}>
        <td
          key={fees.length}>{`Cancelling on ${moment(arrivalDate).format('DD MMM YYYY')} will cost you`}</td>
        <td><span
          className="booking-price">{currency} {this.state.rates && (CurrencyConverter.convert(this.state.rates, RoomsXMLCurrency.get(), currency, fiatPrice)).toFixed(2)} ({this.state.rates && this.state.locRate && (CurrencyConverter.convert(this.state.rates, RoomsXMLCurrency.get(), DEFAULT_CRYPTO_CURRENCY, fiatPrice) / this.state.locRate).toFixed(4)} LOC)</span>
        </td>
      </tr>
    );
  }

  getRoomFees() {
    const arrivalDate = this.state.data.booking.hotelBooking[0].arrivalDate;
    const rows = [];
    const fees = this.getCancellationFees();
    const currency = this.props.paymentInfo.currency;

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
              <td>{`Canceling on or after ${date} will cost you`}</td>
              <td><span
                className="booking-price">{currency} {this.state.rates && (CurrencyConverter.convert(this.state.rates, RoomsXMLCurrency.get(), currency, amount)).toFixed(2)} ({this.state.rates && this.state.locRate && (CurrencyConverter.convert(this.state.rates, RoomsXMLCurrency.get(), DEFAULT_CRYPTO_CURRENCY, amount) / this.state.locRate).toFixed(4)} LOC)</span>
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

  isUserInfoIsComplete(userInfo) {
    let infoFieldsToCheck = ['firstName', 'lastName', 'phoneNumber', 'city', 'country', 'address', 'zipCode'];

    for (let i = 0; i < infoFieldsToCheck.length; i++) {
      let item = infoFieldsToCheck[i];

      for (let key in userInfo) {
        if (userInfo.hasOwnProperty(key)) {
          if (key === item && userInfo[key] === null) {
            return false;
          }
        }
      }
    }

    return true;

  }

  getButtonIfUserHasFullInfo(isUserInfoIsComplete) {
    return isUserInfoIsComplete
      ? (<button className="btn btn-primary" disabled={!this.state.locPrice} onClick={() => this.payWithCard()}>Pay with Credit Card</button>)
      : (<div>Your profile isn't complete to pay with credit card. Please go to <Link to="/profile/me/edit">Edit Profile</Link> and provide mandatory information</div>);
  }

  render() {
    const { data, userInfo, seconds, confirmed, password, fiatPriceRoomsXML, locPrice, rates, testLocPrice } = this.state;
    if (userInfo == null) {
      return <div className="loader"></div>;
    }
    const isMobile = this.props.location.pathname.indexOf('/mobile') !== -1;

    const booking = data && data.booking.hotelBooking;
    const isUserInfoIsComplete = this.isUserInfoIsComplete(userInfo);
    const currency = this.props.paymentInfo.currency;
    const currencySign = this.props.paymentInfo.currencySign;
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
                  </div>
                  <div className="payment-methods">
                    <div className="payment-methods-card">
                      <div className="details">
                        {(env === 'development' || env === 'staging') &&
                          <p style={{ color: 'red' }}>
                            <strong>Pay with Credit Card: TEST Price: {currencySign} {(CurrencyConverter.convert(rates, DEFAULT_CRYPTO_CURRENCY, currency, 15)).toFixed(2)}</strong>
                          </p>}
                        <p className="booking-card-price">
                          Pay with Credit Card: Current Market Price: <span className="important">{currencySign}{fiatPriceRoomsXML && (CurrencyConverter.convert(rates, RoomsXMLCurrency.get(), currency, fiatPriceRoomsXML)).toFixed(2)}</span>
                        </p>
                        {this.getButtonIfUserHasFullInfo(isUserInfoIsComplete)}
                      </div>
                      <div className="logos">
                        <div className="logos-row">
                          <div className="logo visa">
                            <img src={Config.getValue('basePath') + 'images/logos/visa.png'} alt="Visa Logo" />
                          </div>
                          <div className="logo mastercard">
                            <img src={Config.getValue('basePath') + 'images/logos/mastercard.png'} alt="Mastercard Logo" />
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
                            <strong>Pay Directly With LOC: TEST Price: {currencySign} {(CurrencyConverter.convert(rates, DEFAULT_CRYPTO_CURRENCY, currency, 15)).toFixed(2)}</strong>
                          </p>}
                        <p>Pay Directly With LOC: <span className="important">{currencySign}{fiatPriceRoomsXML && (CurrencyConverter.convert(rates, RoomsXMLCurrency.get(), currency, fiatPriceRoomsXML)).toFixed(2)}</span></p>
                        {(env === 'development' || env === 'staging') &&
                          <p style={{ color: 'red' }}>
                            <strong>Order LOC Total: TEST Price: {testLocPrice && `LOC ${(testLocPrice).toFixed(4)}`}</strong>
                          </p>}
                        <p>Order LOC Total: <span className="important">LOC {locPrice && (locPrice).toFixed(4)}</span></p>
                        <div className="price-update-timer" tooltip="Seconds until we update your quoted price">
                          LOC price will update in <i className="fa fa-clock-o" aria-hidden="true"></i>&nbsp;{seconds} sec &nbsp;
                        </div>
                        <p>(Click <a href="">here</a> to learn how you can buy LOC directly to enjoy cheaper travel)</p>
                        {!confirmed
                          ? <button className="btn btn-primary" onClick={(e) => this.openModal(PASSWORD_PROMPT, e)}>Pay with LOC Tokens</button>
                          : <button className="btn btn-primary" disabled>Processing Payment...</button>
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
            <PasswordModal
              isActive={this.props.modalsInfo.isActive[PASSWORD_PROMPT]}
              text={'Enter your wallet password'}
              placeholder={'Wallet password'}
              handleSubmit={() => this.handleSubmitSingleWithdrawer()}
              closeModal={this.closeModal}
              password={password}
              onChange={this.onChange}
            />
          </div>
        }
      </React.Fragment>
    );
  }
}

HotelBookingConfirmPage.propTypes = {
  countries: PropTypes.array,
  match: PropTypes.object,

  // start Router props
  history: PropTypes.object,
  location: PropTypes.object,

  // start Redux props
  dispatch: PropTypes.func,
  userInfo: PropTypes.object,
  paymentInfo: PropTypes.object,
  modalsInfo: PropTypes.object,
  bookingBestPrice: PropTypes.object
};

function mapStateToProps(state) {
  const { userInfo, paymentInfo, modalsInfo, bookingBestPrice } = state;
  return {
    userInfo,
    paymentInfo,
    modalsInfo,
    bookingBestPrice,
  };
}

export default withRouter(connect(mapStateToProps)(HotelBookingConfirmPage));
