import React from 'react';
import { withRouter } from 'react-router-dom';

import BigCalendar from "react-big-calendar";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
    getCalendarByListingIdAndDateRange,
    getMyReservations,
    getPropertyById,
    publishCalendarSlot,
    getCalendarSlotByListingIdAndStartDate,
    getListingCurrency,
    getMyListings
} from "../../../requester";
import moment from 'moment';
import CalendarAside from './CalendarAside';
import Calendar from './Calendar';
import ProfileHeader from '../ProfileHeader';
import Footer from '../../Footer';


class CalendarPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listing: null,
            prices: null,
            reservations: null,
            myListings: null,
            selectedDay: '',
            selectedDate: '',
            available: 'true',
            price: '',
            currencySign: '',
            selectedListing: this.props.match.params.id
        };

        this.onCancel = this.onCancel.bind(this);
        this.onSelectSlot = this.onSelectSlot.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.getSlotInfo = this.getSlotInfo.bind(this);
        this.onListingChange = this.onListingChange.bind(this);
    }


    componentDidMount() {
        let now = new Date();
        let end = new Date();
        const DAY_INTERVAL = 90;
        end.setUTCHours(now.getUTCHours() + 24 * DAY_INTERVAL);

        getPropertyById(this.props.match.params.id)
            .then(res => {
                this.setState({ listing: res.content });
            });

        getMyListings().then((data) => {
            this.setState({ myListings: data.content });
        })

        getListingCurrency(this.props.match.params.id).then((data) => {
            let currencyCode = data.code;

            let currencySign = '';

            switch (currencyCode) {
                case "USD": currencySign = '$'
                    break;
                case "GBP": currencySign = '£'
                    break;
                case "EUR": currencySign = '€'
                    break;
            }

            this.setState({ currencySign: currencySign });

            getCalendarByListingIdAndDateRange(
                this.props.match.params.id,
                now,
                end,
                0,
                DAY_INTERVAL
            ).then(res => {
                let prices = [];
                for (let dateInfo of res.content) {
                    let availableStyle = dateInfo.available ? 1 : 0.5;
                    prices.push(
                        {
                            "title": <span className="calendar-price bold" style={{ opacity: availableStyle }}>{currencySign}{dateInfo.price}</span>,
                            "start": new Date(dateInfo.date),
                            "end": new Date(dateInfo.date),
                            "allDay": true
                        }
                    )
                }

                this.setState({ prices: prices });
            });

            getMyReservations()
                .then(res => {
                    let reservations = res.content.filter(r => r.listingId == this.props.match.params.id);
                    let events = [];
                    for (let reservation of reservations) {
                        let event = {
                            "title": <span className="calendar-reservation-event">{reservation.guestName}</span>,
                            "start": new Date(reservation.startDate),
                            "end": new Date(reservation.endDate), //.setDate(new Date(reservation.endDate).getDate() + 1)
                            "isReservation": true,
                            "price": reservation.price,
                            "guests": reservation.guests
                        };
                        events.push(event);
                    }

                    this.setState({
                        reservations: events
                    });
                });
        })


    }

    mergeEvents(prices, reservations) {
        let myArray = prices;
        for (let i = 0; i <= reservations.length - 1; i++) {
            let reservation = reservations[i];

            let reservationStartDate = new Date(reservation["start"]);
            let reservationEndDate = new Date(reservation["end"]);

            for (let d = reservationStartDate; d < reservationEndDate; d.setDate(d.getDate() + 1)) {
                for (let i = myArray.length - 1; i >= 0; i--) {
                    if (new Date(myArray[i].start).getTime() === new Date(d).getTime()) {
                        myArray.splice(i, 1);
                    }
                }
            }
        }
    }

    onCancel() {
        this.setState({ selectedDay: null, date: null, price: '', available: "true" });
    }

    onSelectSlot(e) {
        let date = e.start;
        let day = moment(e.start).format('DD');

        this.setState({ selectedDay: day, selectedDate: date });
    }

    onSubmit() {
        let listingId = this.props.match.params.id;

        let slotInfo = {
            date: moment(this.state.selectedDate).format('YYYY-MM-DD'),
            price: this.state.price,
            available: this.state.available
        }
        publishCalendarSlot(listingId, slotInfo).then((res) => {
            if (res.status === 200) {
                this.setState({ selectedDay: null, price: null });
                this.componentDidMount();
            }
        })
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    onListingChange(e) {
        this.setState({
            listing: null,
            prices: null,
            reservations: null,
            myListings: null,
            selectedDay: '',
            selectedDate: '',
            available: 'true',
            price: '',
            currencySign: '',
            selectedListing: e.target.value
        });
        this.props.history.push(`/profile/listings/calendar/${e.target.value}`);
        this.componentDidMount();
    }

    getSlotInfo() {
        let formatedDate = moment(this.state.selectedDate).format('DD/MM/YYYY');

        getCalendarSlotByListingIdAndStartDate(this.props.match.params.id, formatedDate).then((data) => {
            if (data.content.length > 0) {
                this.setState({ price: data.content[0].price, available: `${data.content[0].available}`});
            }
        })
    }

    render() {
        if (this.state.listing === null || this.state.prices === null || this.state.reservations === null) {
            return <div className="loader"></div>
        }

        this.mergeEvents(this.state.prices, this.state.reservations);

        let allEvents = this.state.prices.concat(this.state.reservations);

        return (
            <div>
                <ProfileHeader />
                <div className="col-md-12">
                    <div className="container">
                        <Calendar allEvents={allEvents}
                            onCancel={this.onCancel}
                            onSelectSlot={this.onSelectSlot}
                            selectedDay={this.state.selectedDay}
                            selectedDate={this.state.selectedDate}

                            price={this.state.price}
                            available={this.state.available}
                            onSubmit={this.onSubmit}
                            onChange={this.onChange}
                            getSlotInfo={this.getSlotInfo}
                            currencySign={this.state.currencySign}
                            myListings={this.state.myListings}
                            selectedListing={this.state.selectedListing}
                            onListingChange={this.onListingChange} />
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}


export default withRouter(CalendarPage);



