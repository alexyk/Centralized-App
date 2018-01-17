import React from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';

import HomePage from './home/HomePage.jsx';
import ListingPage from './listings/ListingsPage';
import PropertyPage from './property/PropertyPage';

import DashboardPage from './profile/dashboard/DashboardPage';
import MyListingsPage from './profile/listings/MyListingsPage';
import CalendarPage from './profile/calendar/CalendarPage';
import MyReservationsPage from './profile/reservations/MyReservationsPage';
import MyTripsPage from './profile/trips/MyTripsPage';
import MessagesPage from './profile/messages/MessagesPage';
import MessagesChatPage from './profile/messages/MessagesChatPage';
import ProfileEditPage from './profile/me/ProfileEditPage';
import ProfilePhotosPage from './profile/me/ProfilePhotosPage';
import AccountNotificationsPage from './profile/account/AccountNotificationsPage';

import CreateListingPage from './createListing/CreateListingPage';
import EditListingPage from './editListing/EditListingPage';

import observer from '../services/observer';

import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import { Config } from "../config";

class App extends React.Component {
    constructor(props) {
        super(props);
        BigCalendar.setLocalizer(
            BigCalendar.momentLocalizer(moment)
        );
        let currency = '';
        let currencySign = '';

        if (localStorage["currency"] && localStorage["currencySign"]) {
            currency = localStorage["currency"];
            currencySign = localStorage["currencySign"];
        }
        else {
            currency = "USD";
            currencySign = "$";

            localStorage["currency"] = currency;
            localStorage["currencySign"] = currencySign;
        }

        this.state = { currency: currency, currencySign: currencySign }

        this.currencyChange = this.currencyChange.bind(this);
    }

    componentDidMount() {
        observer.currencyChange = this.currencyChange;
    };

    currencyChange(currency) {
        let currencySign = '';
        switch (currency) {
            case "EUR": currencySign = '€'
                break;
            case "GBP": currencySign = '£'
                break;
            default: currencySign = '$';
                break;
        }

        localStorage["currency"] = currency;
        localStorage["currencySign"] = currencySign;

        this.setState({ currency, currencySign });
    }

    isAuthenticated() {
        let token = localStorage.getItem(Config.getValue("domainPrefix") + '.auth.lockchain');
        if (token) {
            return true;
        }
        return false;
    }

    render() {
        return (
            <Switch>
                <Route exact path="/" render={() => <HomePage currency={this.state.currency} currencySign={this.state.currencySign} />} />
                <Route exact path="/listings" render={() => <ListingPage currency={this.state.currency} currencySign={this.state.currencySign} />} />
                <Route exact path="/property" render={() => <PropertyPage currency={this.state.currency} currencySign={this.state.currencySign} />} />
                <Route exact path="/profile/dashboard" render={() => !this.isAuthenticated() ? <Redirect to="/" /> : <DashboardPage currency={this.state.currency} currencySign={this.state.currencySign} />} />
                <Route exact path="/profile/listings" render={() => !this.isAuthenticated() ? <Redirect to="/" /> : <MyListingsPage currency={this.state.currency} currencySign={this.state.currencySign} />} />
                <Route exact path="/profile/listings/calendar/:id" render={() => !this.isAuthenticated() ? <Redirect to="/" /> : <CalendarPage />} />
                <Route exact path="/profile/reservations" render={() => !this.isAuthenticated() ? <Redirect to="/" /> : <MyReservationsPage currency={this.state.currency} currencySign={this.state.currencySign} />} />
                <Route exact path="/profile/trips" render={() => !this.isAuthenticated() ? <Redirect to="/" /> : <MyTripsPage location={this.props.location} currency={this.state.currency} currencySign={this.state.currencySign} />} />
                <Route exact path="/profile/messages" render={() => !this.isAuthenticated() ? <Redirect to="/" /> : <MessagesPage currency={this.state.currency} currencySign={this.state.currencySign} />} />
                <Route exact path="/profile/messages/chat/:id" render={() => !this.isAuthenticated() ? <Redirect to="/" /> : <MessagesChatPage currency={this.state.currency} currencySign={this.state.currencySign} />} />
                <Route exact path="/profile/me/edit" render={() => !this.isAuthenticated() ? <Redirect to="/" /> : <ProfileEditPage currency={this.state.currency} currencySign={this.state.currencySign} />} />
                <Route exact path="/profile/me/photos" render={() => !this.isAuthenticated() ? <Redirect to="/" /> : <ProfilePhotosPage currency={this.state.currency} currencySign={this.state.currencySign} />} />
                <Route exact path="/profile/account/notifications" render={() => !this.isAuthenticated() ? <Redirect to="/" /> : <AccountNotificationsPage currency={this.state.currency} currencySign={this.state.currencySign} />} />
                <Route exact path="/users/resetPassword/:confirm" render={() => <HomePage currency={this.state.currency} currencySign={this.state.currencySign} />} />
                <Route path="/profile/listings/create" render={() => !this.isAuthenticated() ? <Redirect to="/" /> : <CreateListingPage />} />
                <Route path="/profile/listings/edit/:id" render={() => !this.isAuthenticated() ? <Redirect to="/" /> : <EditListingPage />} />
                <Route path="/listings/:id" render={() => <PropertyPage currency={this.state.currency} currencySign={this.state.currencySign} />} />
            </Switch>
        );
    }
}

export default withRouter(App);