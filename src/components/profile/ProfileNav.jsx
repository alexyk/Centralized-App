import '../../styles/css/components/profile/me/profile-nav.css';

import { NavDropdown } from 'react-bootstrap/lib';
import { NavLink, withRouter } from 'react-router-dom';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isAdmin } from '../../selectors/userInfo';
import { Config } from '../../config';

function ProfileNav(props) {
  return (
    <nav id="profile-nav">
      <div className="container">
        <ul className="navbar-profile">
          <li><NavLink exact activeClassName="active" to="/profile/dashboard">Dashboard</NavLink></li>
          <li><NavLink exact activeClassName="active" to="/profile/affiliates">Affiliate</NavLink></li>
          <li><NavLink exact activeClassName="active" to="/profile/listings">My Listings</NavLink></li>
          <li><NavLink activeClassName="active" to="/profile/trips">My Trips</NavLink></li>
          <li><NavLink activeClassName="active" to="/profile/reservations">My Guests</NavLink></li>
          <li><NavLink activeClassName="active" to="/profile/flights">My Air Tickets</NavLink></li>
          <li><NavLink activeClassName="active" to="/profile/messages">Messages</NavLink></li>
          <li><NavLink activeClassName="active" to="/profile/me/edit">Profile</NavLink></li>
          <li><NavLink activeClassName="active" to="/profile/wallet">Wallet</NavLink></li>
          <li><NavLink activeClassName="active" to="/buyloc">Buy LOC</NavLink></li>
          {Config.getValue('env') !== 'production' ?
            <li><NavLink activeClassName="active" to="/profile/sendTransactionData">Send Tokens</NavLink></li> :
            ''}
          {props.isUserAdmin && <NavDropdown id="admin-panel" title="Admin">
            <li><NavLink activeClassName="active" to="/profile/admin/listings">All Listings</NavLink></li>
            <li><NavLink activeClassName="active" to="/profile/admin/users">All Users</NavLink></li>
            <li><NavLink activeClassName="active" to="/profile/admin/safecharge">Safecharge</NavLink></li>
            <li><NavLink activeClassName="active" to="/profile/admin/reservation/booking/all">Reservations</NavLink></li>
          </NavDropdown>}
        </ul>
      </div>
    </nav>
  );
}

ProfileNav.propTypes = {
  isUserAdmin: PropTypes.bool
};

const mapStateToProps = ({ userInfo }) => ({
  isUserAdmin: isAdmin(userInfo),
});

export default withRouter(connect(mapStateToProps)(ProfileNav));
