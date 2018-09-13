import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../../styles/css/components/profile/calendar/calendar.css';

import Calendar from './Calendar';
import CalendarAside from './CalendarAside';
import CalendarAsideStatic from './CalendarAsideStatic';
import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment-timezone';
import requester from '../../../initDependencies';
import { withRouter } from 'react-router-dom';

class CalendarPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listing: null,
      prices: [],
      reservations: [],
      loading: false,
      allEvents: [],

      defaultDailyPrice: '',

      selectedDay: '',
      selectedDate: {},
      available: 'true',
      price: null,

      currencySign: '',
      currencyCode: '',
    };

    this.onCancel = this.onCancel.bind(this);
    this.onSelectSlot = this.onSelectSlot.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.updateDailyPrice = this.updateDailyPrice.bind(this);
  }


  componentDidMount() {
    requester.getListing(this.props.match.params.id).then(res => {
      res.body.then(data => {
        let currencyCode = data.currencyCode;
        let currencySign = '';

        switch (currencyCode) {
          case 'USD': currencySign = '$';
            break;
          case 'GBP': currencySign = '£';
            break;
          case 'EUR': currencySign = '€';
            break;
          default: currencySign = 'null';
        }

        this.setState({
          currencySign: currencySign,
          currencyCode: currencyCode,
          listing: data.content,
          defaultDailyPrice: data.defaultDailyPrice
        }, () => {
          this.updateCalendar();
        });
      });
    });
  }

  async updateCalendar() {
    const DAY_INTERVAL = 365;

    let now = moment();
    let end = moment().add(DAY_INTERVAL, 'days');

    let searchTermMap = [
      `listing=${this.props.match.params.id}`,
      `startDate=${now.format('DD/MM/YYYY')}`,
      `endDate=${end.format('DD/MM/YYYY')}`,
      'page=0',
      `toCode=${this.state.currencyCode}`,
      `size=${DAY_INTERVAL}`
    ];

    let prices = await requester.getCalendarByListingIdAndDateRange(searchTermMap).then(res => {
      return res.body.then(data => {
        let prices = [];
        for (let dateInfo of data.content) {
          let availableText = dateInfo.available ? this.state.currencySign + Math.round(dateInfo.price, 2) : 'Blocked';
          let price = {
            'title': <span className="calendar-price bold" >{availableText}</span>,
            'start': moment(dateInfo.date, 'DD/MM/YYYY'),
            'end': moment(dateInfo.date, 'DD/MM/YYYY'),
            'allDay': true,
            'price': Math.round(dateInfo.price),
            'available': dateInfo.available
          };
          prices.push(price);
        }
        return prices;
      });
    });

    let reservations = await requester.getMyReservations().then(res => {
      return res.body.then(data => {
        let reservations = data.content.filter(r => r.listingId === this.props.match.params.id);
        let events = [];
        for (let reservation of reservations) {
          let event = {
            'title': <span className="calendar-reservation-event" name={reservation.guestName}>{reservation.guestName}</span>,
            'start': moment(reservation.startDate, 'DD/MM/YYYY'),
            'end': moment(reservation.endDate, 'DD/MM/YYYY').add(1, 'days'),
            'isReservation': true,
            'price': reservation.price,
            'guests': reservation.guests
          };
          events.push(event);
        }
        return events;
      });
    });

    let merged = this.mergeEvents(prices, reservations);

    let allEvents = merged.concat(reservations);
    this.setState({ reservations, prices, allEvents });
  }

  mergeEvents(prices, reservations) {
    for (let reservationIndex = 0; reservationIndex < reservations.length; reservationIndex++) {
      let reservation = reservations[reservationIndex];

      let reservationDate = Object.assign({}, reservation.start);
      for (reservationDate = moment(reservation.start); reservationDate < reservation.end; reservationDate.add(1, 'days')) {
        for (let priceIndex = 0; priceIndex < prices.length; priceIndex++) {
          let priceDate = prices[priceIndex].start;

          if (priceDate.isSame(reservationDate)) {
            prices.splice(priceIndex, 1);
          }
        }
      }
    }
    return prices;
  }

  onCancel() {
    this.setState({ selectedDay: null, date: null, price: null, available: 'true' });
  }

  onSelectSlot(e) {
    let date = e.start;
    let day = moment(e.start).format('DD');

    let selectedPriceEvent = this.state.prices.find(function (obj) { return obj.start.isSame(date); });
    if (selectedPriceEvent) {
      this.setState({ selectedDay: day, selectedDate: date, price: selectedPriceEvent.price, available: `${selectedPriceEvent.available}` });
    }
    else {
      this.onCancel();
    }
  }

  onSubmit(captchaToken) {
    let listingId = this.props.match.params.id;

    let slotInfo = {
      date: moment(this.state.selectedDate).format('YYYY-MM-DD'),
      price: this.state.price,
      available: this.state.available
    };

    requester.publishCalendarSlot(listingId, slotInfo, captchaToken).then(res => {
      if (res.success) {
        let prices = this.state.prices;
        let indexOfSlot = prices.findIndex(x => x.start.isSame(this.state.selectedDate));

        let calendarSlotToChange = prices[indexOfSlot];
        let availableText = slotInfo.available === 'true' ? this.state.currencySign + Math.round(slotInfo.price, 2) : 'Blocked';

        calendarSlotToChange.title = <span className="calendar-price bold">{availableText}</span>;
        calendarSlotToChange.available = Boolean(slotInfo.available);
        calendarSlotToChange.price = Number(slotInfo.price);

        prices[indexOfSlot] = calendarSlotToChange;

        let merged = this.mergeEvents(prices, this.state.reservations);
        let allEvents = merged.concat(this.state.reservations);
        this.setState({ selectedDay: null, date: null, price: null, available: 'true', prices, allEvents });
      }
    });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  updateDailyPrice(captchaToken) {
    this.setState({ loading: true });

    const listingId = this.props.match.params.id;
    const priceObj = {
      defaultDailyPrice: this.state.defaultDailyPrice
    };

    requester.editDefaultDailyPrice(listingId, priceObj, captchaToken).then(res => {
      if (res.success) {
        let prices = this.state.prices;
        for (let i = 0; i < prices.length; i++) {
          let priceObj = prices[i];
          if (priceObj.available === true) {
            priceObj.title = <span className="calendar-price bold" style={{ opacity: 1 }}>{this.state.currencySign}{Math.round(this.state.defaultDailyPrice)}</span>;
            priceObj.price = Number(this.state.defaultDailyPrice);
          }
        }
        let merged = this.mergeEvents(prices, this.state.reservations);
        let allEvents = merged.concat(this.state.reservations);
        this.setState({ loading: false, prices, allEvents });
      }
    });
  }

  render() {
    if (this.state.listing === null) {
      return <div className="loader"></div>;
    }

    return (
      <div className="container">
        <div className="calendar">
          <div>
            <Calendar
              allEvents={this.state.allEvents}
              loading={this.state.loading}
              onCancel={this.onCancel}
              onSelectSlot={this.onSelectSlot}
              selectedDay={this.state.selectedDay}
              selectedDate={this.state.selectedDate}
              price={this.state.price}
              defaultDailyPrice={this.state.defaultDailyPrice}
              available={this.state.available}
              onSubmit={this.onSubmit}
              onChange={this.onChange}
              updateDailyPrice={this.updateDailyPrice}
              currencySign={this.state.currencySign} />
          </div>
          <div>
            {this.state.selectedDay !== null && this.state.selectedDay !== '' ? <CalendarAside onCancel={this.onCancel}
              day={this.state.selectedDay}
              date={this.state.selectedDate}
              price={this.state.price}
              available={this.state.available}
              onSubmit={this.onSubmit}
              onChange={this.onChange}
              currencySign={this.state.currencySign} /> :
              <CalendarAsideStatic
                currencySign={this.state.currencySign}
                defaultDailyPrice={this.state.defaultDailyPrice}
                onChange={this.onChange}
                updateDailyPrice={this.updateDailyPrice} />}
          </div>
        </div>
      </div>
    );
  }
}

CalendarPage.propTypes = {
  history: PropTypes.object,
  match: PropTypes.object,
};

export default withRouter(CalendarPage);
