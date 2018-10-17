import PropTypes from 'prop-types';
import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import { Link } from 'react-router-dom';

import './style.css';
import { LOGIN, REGISTER } from '../../../constants/modals';

class BurgerMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      menuOpen: false
    };

    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu() {
    this.setState({ menuOpen: !this.state.menuOpen });
  }

  handleStateChange(state) {
    this.setState({ menuOpen: state.isOpen });
  }

  closeMenu () {
    this.setState({menuOpen: false});
  }

  render() {
    return (
      <React.Fragment>
        <Menu right isOpen={this.state.menuOpen} customBurgerIcon={false} onStateChange={(state) => this.handleStateChange(state)}>
          {this.props.isUserLogged
            ? <React.Fragment>
              <Link className="menu-item" to="/profile/dashboard" onClick={() => { this.closeMenu(); }}>Dashboard</Link>
              <Link className="menu-item" to="/profile/reservations" onClick={() => { this.closeMenu(); }}>My Guests</Link>
              <Link className="menu-item" to="/profile/trips" onClick={() => { this.closeMenu(); }}>My Trips</Link>
              <Link className="menu-item" to="/profile/listings" onClick={() => { this.closeMenu(); }}>My Listings</Link>
              <Link className="menu-item" to="/profile/wallet" onClick={() => { this.closeMenu(); }}>Wallet</Link>
              <Link className="menu-item" to="/profile/messages" onClick={() => { this.closeMenu(); }}>Messages({this.props.unreadMessages})</Link>
              <Link className="menu-item" to="/profile/me/edit" onClick={() => { this.closeMenu(); }}>Profile</Link>
              <Link className="menu-item" to="/airdrop" onClick={() => { this.closeMenu(); }}>Airdrop</Link>
              <Link className="menu-item" to="/" onClick={() => { this.closeMenu(); this.props.logout(); }}>Logout</Link>
            </React.Fragment>
            : <React.Fragment>
              <Link className="menu-item" to="/login" onClick={() => { this.props.openModal(LOGIN); this.closeMenu(); }}>Login</Link>
              <Link className="menu-item" to="/signup" onClick={() => { this.props.openModal(REGISTER); this.closeMenu(); }}>Register</Link>
            </React.Fragment>
          }
        </Menu>
        <button onClick={this.toggleMenu}>X</button>
      </React.Fragment>
    );
  }
}

BurgerMenu.propTypes = {
};

export default BurgerMenu;