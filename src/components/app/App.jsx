import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

import AccountNotificationsPage from '../profile/account/AccountNotificationsPage';
import BigCalendar from 'react-big-calendar';
import CalendarPage from '../profile/calendar/CalendarPage';
import { Config } from '../../config';
import CreateListingPage from '../listingCRUD/CreateListingPage';
import EditListingPage from '../listingCRUD/EditListingPage';
import HomePageRouter from '../home/HomePageRouter';
import ListingPage from '../listings/ListingPage';
import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import MainNav from '../mainNav/MainNav';
import Footer from '../footer/Footer';
import AttachedFooter from '../footer/AttachedFooter';

import ProfilePage from '../profile/ProfilePage';
import PropTypes from 'prop-types';

class App extends React.Component {
    constructor(props) {
        super(props);
        BigCalendar.setLocalizer(
            BigCalendar.momentLocalizer(moment)
        );
    }

    isAuthenticated() {
        let token = localStorage.getItem(Config.getValue('domainPrefix') + '.auth.lockchain');
        if (token) {
            return true;
        }
        return false;
    }

    render() {
        return (
            <div>
                <MainNav />
                <Switch>
                    <Route exact path="/" render={() => <HomePageRouter />} />
                    <Route exact path="/profile/listings/edit/:step/:id" render={() => !this.isAuthenticated() ? <Redirect to="/" /> : <EditListingPage />} />
                    <Route exact path="/profile/listings/calendar/:id" render={() => !this.isAuthenticated() ? <Redirect to="/" /> : <CalendarPage />} />
                    <Route exact path="/profile/account/notifications" render={() => !this.isAuthenticated() ? <Redirect to="/" /> : <AccountNotificationsPage />} />
                    <Route exact path="/users/resetPassword/:confirm" render={() => <HomePageRouter />} />
                    <Route path="/listings" render={() => <ListingPage />} />
                    <Route path="/profile/listings/create" render={() => !this.isAuthenticated() ? <Redirect to="/" /> : <CreateListingPage />} />
                    <Route path="/profile/" render={() => !this.isAuthenticated() ? <Redirect to="/" /> : <ProfilePage location={this.props.location} />} />
                    <Route render={() => <HomePageRouter />} />
                </Switch>
                <Footer />
                <AttachedFooter />
            </div>
        );
    }
}

App.propTypes = {
    // start Router props
    location: PropTypes.object,

    // start Redux props
    dispatch: PropTypes.func,
    paymentInfo: PropTypes.object
};

export default withRouter(connect(mapStateToProps)(App));

function mapStateToProps(state) {
    const { paymentInfo } = state;
    return {
        paymentInfo
    };
}