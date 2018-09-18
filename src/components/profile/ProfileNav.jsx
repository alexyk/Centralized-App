import '../../styles/css/components/profile/me/profile-nav.css';

import { NavDropdown } from 'react-bootstrap/lib';
import { NavLink, withRouter } from 'react-router-dom';
import React from 'react';
import { connect } from 'react-redux';

function ProfileNav(props) {
  return (
    <nav id="profile-nav">
      <div className="container">
        <ul className="navbar-profile">
          <li><NavLink exact activeClassName="active" to="/profile/dashboard">Dashboard</NavLink></li>
          <li><NavLink exact activeClassName="active" to="/profile/listings">My Listings</NavLink></li>
          <li><NavLink activeClassName="active" to="/profile/trips">My Trips</NavLink></li>
          <li><NavLink activeClassName="active" to="/profile/reservations">My Guests</NavLink></li>
          <li><NavLink activeClassName="active" to="/profile/messages">Messages</NavLink></li>
          <li><NavLink activeClassName="active" to="/profile/me/edit">Profile</NavLink></li>
          <li><NavLink activeClassName="active" to="/profile/wallet">Wallet</NavLink></li>
          <li><NavLink activeClassName="active" to="/airdrop">Airdrop</NavLink></li>
          <li><NavLink activeClassName="active" to="/buyloc">Buy LOC</NavLink></li>
          {props.isAdmin && <NavDropdown id="admin-panel" title="Admin">
            <li><NavLink activeClassName="active" to="/profile/admin/listings">All Listings</NavLink></li>
            <li><NavLink activeClassName="active" to="/profile/admin/users">All Users</NavLink></li>
          </NavDropdown>}
        </ul>
      </div>
    </nav>
  );
}

const mapStateToProps = ({ userInfo }) => ({
  isAdmin: userInfo.isAdmin,
});

export default withRouter(connect(mapStateToProps)(ProfileNav));
