import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AdminPage from './admin/AdminPage';
import CalendarPage from './calendar/CalendarPage';
import DashboardPage from './dashboard/DashboardPage';
import MessagesChatPage from './messages/MessagesChatPage';
import MessagesPage from './messages/MessagesPage';
import MyGuestsPage from './guests/MyGuestsPage';
import MyListingsPage from './listings/MyListingsPage';
import ProfileNav from './ProfileNav';
import ProfileEditPage from './me/ProfileEditPage';
import TripsRouter from './trips/TripsRouter';
import WalletPage from './wallet/WalletIndexPage';
import AirdropPage from './airdrop/AirdropPage';
import BuyLocPage from './buyloc/BuyLocPage';
import AirTicketsPage from './airTickets/AirTicketsPage';

function ProfilePage(props) {
  return (
    <React.Fragment>
      {props.isLogged && <ProfileNav />}
      <Switch>
        <Route exact path="/profile/dashboard" render={() => <DashboardPage />} />
        <Route exact path="/profile/listings" render={() => <MyListingsPage />} />
        <Route exact path="/profile/listings/calendar/:id" render={() => <CalendarPage />} />
        <Route exact path="/profile/messages" render={() => <MessagesPage />} />
        <Route exact path="/profile/messages/chat/:id" render={() => <MessagesChatPage />} />
        <Route path="/profile/trips" render={() => <TripsRouter location={props.location} />} />
        <Route path="/profile/reservations" render={() => <MyGuestsPage />} />
        <Route path="/profile/tickets" render={() => <AirTicketsPage />} />
        <Route path="/profile/me" render={() => <ProfileEditPage />} />
        <Route path="/profile/wallet" render={() => <WalletPage />} />
        <Route path="/airdrop" render={() => <AirdropPage />} />
        <Route path="/buyloc" render={() => <BuyLocPage />} />
        <Route path="/profile/admin" render={() => <AdminPage />} />
      </Switch>
    </React.Fragment>
  );
}

ProfilePage.propTypes = {
  isLogged: PropTypes.bool,
  location: PropTypes.object,
};

const mapStateToProps = ({ userInfo }) => ({
  isLogged: userInfo.isLogged,
});

export default withRouter(connect(mapStateToProps)(ProfilePage));
