import { closeModal, openModal } from '../../../actions/modalsInfo.js';

import { HotelReservation } from '../../../services/blockchain/hotelReservation';
import { NotificationManager } from 'react-notifications';
import { PASSWORD_PROMPT } from '../../../constants/modals.js';
import { PROCESSING_TRANSACTION } from '../../../constants/infoMessages.js';
import PasswordModal from '../../common/modals/PasswordModal';
import PropTypes from 'prop-types';
import { ROOMS_XML_CURRENCY, ROOMS_XML_CURRENCY_DEV } from '../../../constants/currencies.js';
import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import requester from '../../../initDependencies';
import { setCurrency, setLocRate } from '../../../actions/paymentInfo';
import { setBestPrice } from '../../../actions/bookingBestPrice';
import { withRouter, Link } from 'react-router-dom';
import { Config } from '../../../config.js';

import { LOC_PAYMENT_INITIATED } from '../../../constants/successMessages.js';
import { SEARCH_EXPIRED } from '../../../constants/infoMessages.js';
import { LONG, EXTRA_LONG } from '../../../constants/notificationDisplayTimes.js';

import '../../../styles/css/components/hotels/book/hotel-booking-confirm-page.css';

const ERROR_MESSAGE_TIME = 20000;

class HotelBookingConfirmPage extends React.Component {
  constructor(props) {
    super(props);

    this.captcha = null;
    this.timer = null;
    this.socket = null;

    this.state = {
      data: null,
      showRoomsCanxDetails: false,
      loading: true,
      locRate: null,
      password: '',
      confirmed: false,
      fiatPriceInEUR: null,
      seconds: 0,
    };

    this.timeout = null;

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.toggleCanxDetails = this.toggleCanxDetails.bind(this);
    this.handleSubmitSingleWithdrawer = this.handleSubmitSingleWithdrawer.bind(this);
    this.tick = this.tick.bind(this);

    // SOCKET BINDINGS
    this.initializeSocket = this.initializeSocket.bind(this);
    this.connectSocket = this.connectSocket.bind(this);
    this.handleReceiveMessage = this.handleReceiveMessage.bind(this);
    this.disconnectSocket = this.disconnectSocket.bind(this);
  }

  componentDidMount() {
    const search = this.props.location.search;
    const searchParams = this.getSearchParams(search);
    const booking = JSON.parse(decodeURI(searchParams.get('booking')));

    requester.createReservation(booking).then(res => {
      if (res.success) {
        res.body.then(data => {
          this.setState({ data: data, booking: booking }, this.initializeSocket());
          // requester.getLocRateByCurrency(data.currency).then(res => {
          //   res.body.then(locData => {
          //     this.setState({ locRate: locData[0]['price_' + data.currency.toLowerCase()] });
          //   });
          // });

          requester.getCurrencyRates().then(res => {
            res.body.then(data => {
              this.setState({ rates: data });
            });
          });
        });
      } else {
        res.errors.then((res) => {
          const errors = res.errors;
          for (let key in errors) {
            if (typeof errors[key] !== 'function') {
              NotificationManager.warning(errors[key].message, '', LONG);
            }
          }
        });
      }
    });

    this.timeout = setTimeout(() => {
      NotificationManager.info(SEARCH_EXPIRED, '', EXTRA_LONG);
      this.props.history.push('/hotels');
    }, 600000);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
    clearInterval(this.timer);
    this.disconnectSocket();
  }

  tick() {
    const { seconds } = this.state;
    let { fiatPriceInEUR } = this.state;
    if (seconds === 29) {
      const bestPrice = this.props.bookingBestPrice.price;
      this.setState({
        fiatPriceInEUR: bestPrice,
        seconds: 0,
      });
      this.props.dispatch(setLocRate((bestPrice / this.state.data.locPrice) * this.state.rates[ROOMS_XML_CURRENCY][this.props.paymentInfo.currency]));
    } else {
      if (fiatPriceInEUR === null) {
        fiatPriceInEUR = this.props.bookingBestPrice.price;
        const locRate = (fiatPriceInEUR / this.state.data.locPrice) * this.state.rates[ROOMS_XML_CURRENCY][this.props.paymentInfo.currency];
        this.props.dispatch(setLocRate(locRate));
      }
      this.setState((prevState) => {
        return {
          seconds: prevState.seconds + 1,
          fiatPriceInEUR
        };
      });
    }
  }

  initializeSocket() {
    this.socket = new WebSocket(Config.getValue('SOCKET_HOST_PRICE'));
    this.socket.onmessage = this.handleReceiveMessage;
    this.socket.onopen = this.connectSocket;
  }

  connectSocket() {
    const locAmount = this.state.data && this.state.data.locPrice;
    this.socket.send(JSON.stringify({ locAmount }));
    this.timer = setInterval(this.tick, 1000);
  }

  handleReceiveMessage(event) {
    const fiatPriceInEUR = (JSON.parse(event.data)).fiatAmount;
    this.props.dispatch(setBestPrice(fiatPriceInEUR));
  }

  disconnectSocket() {
    this.socket.close();
  }

  payWithCard() {
    const { data, fiatPriceInEUR, rates } = this.state;
    const paymentInfo = {
      fiatAmount: fiatPriceInEUR * rates[ROOMS_XML_CURRENCY][this.props.paymentInfo.currency],
      locAmount: data.locPrice,
      currency: this.props.paymentInfo.currency,
      bookingId: data.preparedBookingId,
    };

    requester.verifyCreditCardPayment(JSON.stringify(paymentInfo))
      .then(res => {
        res.body.then((data) => {
          // requester.payWithCreditCard(res.url);
          window.location.href = data.url;
        });
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

  getTotalPrice(roomResults) {
    let total = 0;
    for (let i = 0; i < roomResults.length; i++) {
      total += roomResults[i].price;
    }

    return total;
  }

  getNights(searchParams) {
    const start = moment(searchParams.get('startDate'), 'DD/MM/YYYY');
    const end = moment(searchParams.get('endDate'), 'DD/MM/YYYY');
    return end.diff(start, 'days');
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

                console.log(bookingConfirmObj);
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
              queryString: queryString
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
                NotificationManager.warning('You have a pending transaction. Please try again later.', 'Send Tokens', ERROR_MESSAGE_TIME);
              } else {
                NotificationManager.warning(error.message, 'Send Tokens', ERROR_MESSAGE_TIME);
              }
            } else if (error.hasOwnProperty('err') && error.err.hasOwnProperty('message')) {
              NotificationManager.warning(error.err.message, 'Send Tokens', ERROR_MESSAGE_TIME);
            } else if (typeof x === 'string') {
              NotificationManager.warning(error, 'Send Tokens', ERROR_MESSAGE_TIME);
            } else {
              NotificationManager.warning(error, ERROR_MESSAGE_TIME);
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

  getRoomsXmlCurrency() {
    const env = Config.getValue('env');
    if (env === 'staging' || env === 'development') {
      console.log('staging');
      return ROOMS_XML_CURRENCY;
    } else {
      console.log('prod');
      return ROOMS_XML_CURRENCY_DEV;
    }
  }

  getRoomRows(booking) {
    const rows = [];
    const roomsXMLCurrency = this.getRoomsXmlCurrency();

    if (booking) {
      booking.forEach((bookingRoom, index) => {
        const locRate = Number(Number(this.props.paymentInfo.locRate).toFixed(2));
        rows.push(
          <tr key={(1 + index) * 1000} className="booking-room">
            <td>{bookingRoom.room.roomType.text}</td>
            <td><span
              className="booking-price">{this.props.paymentInfo.currency} {(bookingRoom.room.totalSellingPrice.locPrice * locRate).toFixed(2)} ({(bookingRoom.room.totalSellingPrice.locPrice).toFixed(4)} LOC)</span>
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
        <td>{`Cancellation fee before ${moment(date).format('DD MMM YYYY')}  including`}</td>
        <td><span
          className="booking-price">{this.props.paymentInfo.currency} 0.00 (0.0000 LOC)</span>
        </td>
      </tr>
    );
  }

  addCheckInClauseRow(fees, rows, arrivalDate) {
    // const fiatPrice = this.state.data && this.state.data.fiatPrice;
    const locPrice = this.state.data && this.state.data.locPrice;
    const locRate = Number(Number(this.props.paymentInfo.locRate).toFixed(2));
    const roomsXMLCurrency = this.getRoomsXmlCurrency();
    rows.push(
      <tr key={2}>
        <td
          key={fees.length}>{`Cancel on ${moment(arrivalDate).format('DD MMM YYYY')}`}</td>
        <td><span
          className="booking-price">{this.props.paymentInfo.currency} {(locPrice * locRate).toFixed(2)} ({(locPrice).toFixed(4)} LOC)</span>
        </td>
      </tr>
    );
  }

  getRoomFees() {
    const arrivalDate = this.state.data.booking.hotelBooking[0].arrivalDate;
    const fiatPriceInEUR = this.state.data && this.state.fiatPriceInEUR;
    const rows = [];
    const fees = this.getCancellationFees();
    const roomsXMLCurrency = this.getRoomsXmlCurrency();

    if (fees.length === 0) {
      this.addFreeClauseRow(rows, arrivalDate);
      this.addCheckInClauseRow(fees, rows, arrivalDate);
    } else {
      const locRate = Number(Number(this.props.paymentInfo.locRate).toFixed(2));
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
            amount = fiatPriceInEUR;
          }
          rows.push(
            <tr key={3 * 1000 + feeIndex + 1}>
              <td>{`Cancel after ${date} including`}</td>
              <td><span
                className="booking-price">{this.props.paymentInfo.currency} {(locRate * fee.loc).toFixed(2)} ({(fee.loc).toFixed(4)} LOC)</span>
              </td>
            </tr>
          );
        }
      });

      if (fees[fees.length - 1].from !== arrivalDate && fees[fees.length - 1].loc !== this.state.data.locPrice) {
        this.addCheckInClauseRow(fees, rows, arrivalDate);
      }
    }

    return (
      <div className="row cancelation-table" >
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
      </div>
    );
  }

  getLastDate(fees) {
    return fees.sort((x, y) => x.from < y.from ? 1 : -1)[0];
  }

  render() {
    const isMobile = this.props.location.pathname.indexOf('/mobile') !== -1;

    const booking = this.state.data && this.state.data.booking.hotelBooking;
    // const fiatPrice = this.state.data && this.state.data.fiatPrice;
    const locPrice = this.state.data && this.state.data.locPrice;
    const isVerify = true;
    const locRate = Number(Number(this.props.paymentInfo.locRate).toFixed(2));
    const roomsXMLCurrency = this.getRoomsXmlCurrency();

    return (
      <div>
        <div>
          <div className="booking-steps sm-none">
            <div className="container">
              <p>1. Provide Guest Information</p>
              <p>2. Review Room Details</p>
              <p>3. Confirm and Pay</p>
            </div>
          </div>

          {!this.state.data ?
            <div className="loader"></div> :
            <div id="room-book-confirm">
              <div className="container">
                <div className="booking-details">
                  <h2>Confirm and Pay</h2>
                  <hr />
                  <div className="confirm-pay-info">
                    <div className="cancelation-fees-info">
                      <div className="row text-center room-dates">
                        {moment(booking[0].arrivalDate, 'YYYY-MM-DD').format('DD MMM, YYYY')} <i
                          className="fa fa-long-arrow-right"></i> {moment(booking[0].arrivalDate, 'YYYY-MM-DD').add(booking[0].nights, 'days').format('DD MMM, YYYY')}
                      </div>
                      <div className="row room-table">
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
                      <hr />
                      <div className="cancelation-fees">
                        <h4>Cancelation Fees</h4>
                        <button className="btn btn-primary" onClick={() => this.toggleCanxDetails()}>{this.state.showRoomsCanxDetails ? 'Hide' : 'Show'}</button>
                      </div>
                      {this.state.showRoomsCanxDetails ? this.getRoomFees(booking) : null}
                    </div>
                    <div className="total-prices-info">
                      <div className="row order-name">
                        <p>Name: &nbsp;</p>
                        <p className="booking-for">{this.props.userInfo.firstName} {this.props.userInfo.lastName}</p>
                      </div>
                      <div className="row order-total">
                        <div>
                          <p>Timer: <strong>{this.state.seconds}</strong> sec</p>
                          <p className="booking-card-price">Order Card Total: {this.props.paymentInfo.currency} {(locRate * locPrice).toFixed(4)}</p>
                          {isVerify
                            ? <button className="btn btn-primary btn-book" onClick={() => this.payWithCard()} disabled>Pay with card</button>
                            : (<React.Fragment>
                              <div className="not-verify-info">Your profile is already not verify. <p> Please verify first. </p></div>
                              <Link to="/profile/me/edit">Profile page</Link>
                            </React.Fragment>)
                          }
                        </div>
                        <div>
                          <p>Order LOC Total:</p>
                          <p className="booking-price">LOC {(locPrice).toFixed(4)}</p>
                          {!this.state.confirmed
                            ? <button className="btn btn-primary btn-book" onClick={(e) => this.openModal(PASSWORD_PROMPT, e)}>Pay with LOC</button>
                            : <button className="btn btn-primary btn-book" disabled>Processing Payment...</button>
                          }</div>
                      </div>
                    </div>
                  </div>
                </div>
                {isMobile &&
                  <div>
                    <button className="btn btn-primary btn-book" onClick={(e) => this.props.history.goBack()}>Back</button>
                    <select
                      className="currency"
                      value={this.props.paymentInfo.currency}
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
                handleSubmit={() => this.handleSubmit()}
                closeModal={this.closeModal}
                password={this.state.password}
                onChange={this.onChange}
              />
              {/* {!isMobile && (
                <ReCAPTCHA
                  ref={el => this.captcha = el}
                  size="invisible"
                  sitekey={Config.getValue('recaptchaKey')}
                  onChange={(token) => {
                    this.handleSubmit(token);
                    this.captcha.reset();
                  }}
                />)} */}
            </div>
          }
        </div>
      </div>
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
  modalsInfo: PropTypes.object
};

function mapStateToProps(state) {
  const { userInfo, paymentInfo, modalsInfo } = state;
  return {
    userInfo,
    paymentInfo,
    modalsInfo,
  };
}

export default withRouter(connect(mapStateToProps)(HotelBookingConfirmPage));
