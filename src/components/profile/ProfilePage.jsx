import { Route, Switch, withRouter } from 'react-router-dom';

import AdminPage from './admin/AdminPage';
import CalendarPage from './calendar/CalendarPage';
import DashboardPage from './dashboard/DashboardPage';
import MessagesChatPage from './messages/MessagesChatPage';
import MessagesPage from './messages/MessagesPage';
import MyGuestsPage from './guests/MyGuestsPage';
import MyListingsPage from './listings/MyListingsPage';
import ProfileNav from './ProfileNav';
import ProfileEditPage from './me/ProfileEditPage';
import PropTypes from 'prop-types';
import React from 'react';
import TripsRouter from './trips/TripsRouter';
import AffiliatesPage from './affiliates/AffiliatesPage';
import WalletPage from './wallet/WalletIndexPage';
import BuyLocPage from './buyloc/BuyLocPage';
import { connect } from 'react-redux';
import { isLogged } from '../../selectors/userInfo';

function ProfilePage(props) {
  return (
    <React.Fragment>
      {props.isUserLogged && <ProfileNav />}
      <Switch>
        <Route exact path="/profile/dashboard" render={() => <DashboardPage />} />
        <Route exact path="/profile/affiliates" render={() => <AffiliatesPage />} />
        <Route exact path="/profile/listings" render={() => <MyListingsPage />} />
        <Route exact path="/profile/listings/calendar/:id" render={() => <CalendarPage />} />
        <Route exact path="/profile/messages" render={() => <MessagesPage />} />
        <Route exact path="/profile/messages/chat/:id" render={() => <MessagesChatPage />} />
        <Route path="/profile/trips" render={() => <TripsRouter location={props.location} />} />
        <Route path="/profile/reservations" render={() => <MyGuestsPage />} />
        <Route path="/profile/me" render={() => <ProfileEditPage />} />
        <Route path="/profile/wallet" render={() => <WalletPage />} />
        <Route path="/buyloc" render={() => <BuyLocPage />} />
        <Route path="/profile/admin" render={() => <AdminPage />} />
      </Switch>
    </React.Fragment>
  );
}

ProfilePage.propTypes = {
  location: PropTypes.object,

  // Redux props
  isUserLogged: PropTypes.bool
};

const mapStateToProps = ({ userInfo }) => ({
  isUserLogged: isLogged(userInfo),
});

export default withRouter(connect(mapStateToProps)(ProfilePage));
