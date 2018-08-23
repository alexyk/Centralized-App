import { NavDropdown } from 'react-bootstrap/lib';
import { NavLink } from 'react-router-dom';
import React from 'react';
import requester from '../../initDependencies';

class NavProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      roles: '',
      loading: true
    };
  }

  componentDidMount() {
    requester.getUserInfo().then(res => {
      res.body.then(data => {
        this.setState({ roles: data.roles, loading: false });
      });
    });
  }

  isAdmin() {
    return this.state.roles.filter(c => c.name === 'ADMIN').length > 0;
  }

  render() {
    if (this.state.loading) {
      return <div className="loader"></div>;
    }

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
            {this.isAdmin() && <NavDropdown id="admin-panel" title="Admin">
              <li><NavLink activeClassName="active" to="/profile/admin/listings">All Listings</NavLink></li>
              <li><NavLink activeClassName="active" to="/profile/admin/users">All Users</NavLink></li>
            </NavDropdown>}

          </ul>
        </div>
      </nav>
    );
  }
}

export default NavProfile;
