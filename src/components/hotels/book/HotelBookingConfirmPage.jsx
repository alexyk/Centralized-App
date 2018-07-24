import { closeModal, openModal } from '../../../actions/modalsInfo.js';

import { HotelReservation } from '../../../services/blockchain/hotelReservation';
import { NotificationManager } from 'react-notifications';
import { PASSWORD_PROMPT } from '../../../constants/modals.js';
import { PROCESSING_TRANSACTION } from '../../../constants/infoMessages.js';
import PasswordModal from '../../common/modals/PasswordModal';
import PropTypes from 'prop-types';
import { ROOMS_XML_CURRENCY } from '../../../constants/currencies.js';
import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import requester from '../../../initDependencies';
import { setCurrency } from '../../../actions/paymentInfo';
import { withRouter } from 'react-router-dom';

class HotelBookingConfirmPage extends React.Component {
  constructor(props) {
    super(props);

    this.captcha = null;

    this.state = {
      data: null,
      showRoomsCanxDetails: false,
      loading: true,
      locRate: null,
      password: '',
      confirmed: false
    };

    this.timeout = null;

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.toggleCanxDetails = this.toggleCanxDetails.bind(this);
  }

  componentDidMount() {
    const search = this.props.location.search;
    const searchParams = this.getSearchParams(search);
    const booking = JSON.parse(decodeURI(searchParams.get('booking')));

    requester.createReservation(booking).then(res => {
      if (res.success) {
        res.body.then(data => {
          this.setState({ data: data, booking: booking });
          console.log(data);
          requester.getLocRateByCurrency(data.currency).then(res => {
            res.body.then(locData => {
              this.setState({ locRate: locData[0]['price_' + data.currency.toLowerCase()] });
            });
          });

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
              NotificationManager.warning(errors[key].message);
            }
          }
        });
      }
    });

    this.timeout = setTimeout(() => {
      NotificationManager.info('Your search has expired.', '', 600000);
      this.props.history.push('/hotels');
    }, 600000);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
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
        console.log(cancellationFees);
        const daysBeforeStartOfRefund = [];
        const refundPercentages = [];
        for (let key in cancellationFees) {
          daysBeforeStartOfRefund.unshift(key.toString());
          refundPercentages.unshift(cancellationFees[key].toString());
        }

        NotificationManager.info(PROCESSING_TRANSACTION, 'Transactions', 60000);
        this.setState({ confirmed: true });
        this.closeModal(PASSWORD_PROMPT);

        const queryString = this.props.location.search;
        console.log((queryString));

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
                  NotificationManager.success('LOC Payment has been initiated. We will send you a confirmation message once it has been processed by the Blockchain.');
                  setTimeout(() => {
                    this.props.history.push('/profile/trips/hotels');
                  }, 2000);
                });
              }).catch(error => {
                if (error.hasOwnProperty('message')) {
                  NotificationManager.warning(error.message, 'Send Tokens');
                } else if (error.hasOwnProperty('err') && error.err.hasOwnProperty('message')) {
                  NotificationManager.warning(error.err.message, 'Send Tokens');
                } else if (typeof x === 'string') {
                  NotificationManager.warning(error, 'Send Tokens');
                } else {
                  NotificationManager.warning(error);
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
      booking.forEach((booking, index) => {
        rows.push(
          <tr key={(1 + index) * 1000} className="booking-room">
            <td>{booking.room.roomType.text}</td>
            <td><span
              className="booking-price">{this.props.paymentInfo.currency} {this.state.rates && (booking.room.totalSellingPrice.amt * this.state.rates[ROOMS_XML_CURRENCY][this.props.paymentInfo.currency]).toFixed(2)} ({(booking.room.totalSellingPrice.locPrice).toFixed(4)} LOC)</span>
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
    const fiatPrice = this.state.data && this.state.data.fiatPrice;
    const locPrice = this.state.data && this.state.data.locPrice;
    rows.push(
      <tr key={2}>
        <td
          key={fees.length}>{`Cancel on ${moment(arrivalDate).format('DD MMM YYYY')}`}</td>
        <td><span
          className="booking-price">{this.props.paymentInfo.currency} {this.state.rates && (fiatPrice * this.state.rates[ROOMS_XML_CURRENCY][this.props.paymentInfo.currency]).toFixed(2)} ({(locPrice).toFixed(4)} LOC)</span>
        </td>
      </tr>
    );
  }

  getRoomFees() {
    const arrivalDate = this.state.data.booking.hotelBooking[0].arrivalDate;
    const rows = [];
    const fees = this.getCancellationFees();

    if (fees.length === 0) {
      this.addFreeClauseRow(rows, arrivalDate);
      this.addCheckInClauseRow(fees, rows, arrivalDate);
    } else {
      fees.forEach((fee, feeIndex) => {
        if (fee.amt === 0 && fee.loc === 0) {
          this.addFreeClauseRow(rows, fee.from);
        } else {
          let date = moment(fee.from).add(1, 'days').format('DD MMM YYYY');
          if (fee.from === arrivalDate) {
            date = arrivalDate;
          }
          rows.push(
            <tr key={3 * 1000 + feeIndex + 1}>
              <td>{`Cancel after ${date} including`}</td>
              <td><span
                className="booking-price">{this.props.paymentInfo.currency} {this.state.rates && (fee.amt * this.state.rates[ROOMS_XML_CURRENCY][this.props.paymentInfo.currency]).toFixed(2)} ({(fee.loc).toFixed(4)} LOC)</span>
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
    const fiatPrice = this.state.data && this.state.data.fiatPrice;
    const locPrice = this.state.data && this.state.data.locPrice;

    return (
      <div>
        <div>
          <div className="booking-steps">
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
                    <button onClick={() => this.toggleCanxDetails()}>{this.state.showRoomsCanxDetails ? 'Hide' : 'Show'}</button>
                  </div>
                  {this.state.showRoomsCanxDetails ? this.getRoomFees(booking) : null}
                  <hr />
                  <div className="row order-name">
                    <p>Name: <span
                      className="booking-for">{this.props.userInfo.firstName} {this.props.userInfo.lastName}</span></p>
                  </div>
                  <div className="row order-total">
                    <p>Order Total: <span
                      className="booking-price">{this.props.paymentInfo.currency} {this.state.rates && (fiatPrice * this.state.rates[ROOMS_XML_CURRENCY][this.props.paymentInfo.currency]).toFixed(2)} ({(locPrice).toFixed(4)} LOC)</span>
                    </p>
                  </div>
                </div>
                {!this.state.confirmed
                  ? <button className="btn btn-primary btn-book" onClick={(e) => this.openModal(PASSWORD_PROMPT, e)}>Confirm and Pay</button>
                  : <button className="btn btn-primary btn-book" disabled>Processing Payment...</button>
                }

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
                isActive={this.props.modalsInfo.modals.get(PASSWORD_PROMPT)}
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