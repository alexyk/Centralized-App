import "../../styles/css/components/main_nav/main_nav.css";

import { LOGIN, REGISTER } from "../../constants/modals.js";
import { Link, withRouter } from "react-router-dom";
import { closeModal, openModal } from "../../actions/modalsInfo";
import { logOut } from "../../actions/userInfo";

import { Config } from "../../config";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import requester from "../../requester";
import BurgerMenu from "./burger-menu";
import DropdownMenu from "./dropdown-menu";
import ListMenu from "./list-menu";
import { setShowMenu } from "../../actions/burgerMenuInfo.js";

import { selectors as UserSelectors } from "../../reducers/userInfo";
import "./links-to-other-sites.css"

class MainNav extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      unreadMessages: ""
    };

    this.onChange = this.onChange.bind(this);
    this.logout = this.logout.bind(this);

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.setMessageListenerPollingInterval = this.setMessageListenerPollingInterval.bind(
      this
    );
    this.getCountOfMessages = this.getCountOfMessages.bind(this);
    this.showMenu = this.showMenu.bind(this);
  }

  componentDidMount() {
    this.setMessageListenerPollingInterval();
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  logout(e) {
    if (e) {
      e.preventDefault();
    }

    localStorage.removeItem(Config.getValue("domainPrefix") + ".auth.locktrip");
    localStorage.removeItem(Config.getValue("domainPrefix") + ".auth.username");

    this.props.dispatch(logOut());

    this.props.history.push("/");
  }

  openModal(modal, e) {
    if (e) {
      e.preventDefault();
    }

    this.props.dispatch(openModal(modal));
  }

  closeModal(modal, e) {
    if (e) {
      e.preventDefault();
    }

    this.props.dispatch(closeModal(modal));
  }

  setMessageListenerPollingInterval() {
    this.getCountOfMessages();
    setInterval(() => {
      this.getCountOfMessages();
    }, 120000);
  }

  getCountOfMessages() {
    if (
      localStorage[Config.getValue("domainPrefix") + ".auth.locktrip"] &&
      localStorage[Config.getValue("domainPrefix") + ".auth.username"]
    ) {
      requester.getCountOfMyUnreadMessages().then(res => {
        res.body.then(data => {
          this.setState({ unreadMessages: data.count });
        });
      });
    }
  }

  showMenu() {
    this.props.dispatch(setShowMenu(true));
  }

  render() {
    const { unreadMessages } = this.state;
    return (
      <React.Fragment>
      <div id="main_tabs" className="token-tabs">
        <a href="#" className={"main"}>Marketplace</a>
        <a href="#">Blockchain</a>
        <a href="#" className="economy">Token Economy</a>
      </div>
      <nav id="main-nav" className="navbar">
        <div className="container">
          <div className="nav-container">
            <Link className="navbar-logo" to="/">
              <img
                src={Config.getValue("basePath") + "images/locktrip_logo.svg"}
                alt="logo"
              />
            </Link>
            {this.props.isLogged ? (
              <ListMenu>
                <Link className="list-menu-item" to="/profile/reservations">
                  Hosting
                </Link>
                <Link className="list-menu-item" to="/profile/trips">
                  Traveling
                </Link>
                <Link className="list-menu-item" to="/profile/wallet">
                  Wallet
                </Link>
                <a
                  href="https://locktrip.zendesk.com/hc/en-us"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="list-menu-item"
                >
                  FAQ
                </a>
                <a
                  href="https://locktrip.zendesk.com/hc/en-us/requests/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="list-menu-item"
                >
                  Support
                </a>
                <Link className="list-menu-item" to="/profile/messages">
                  <div className="messages">
                    <span className="fa fa-envelope-o mailbox" />
                    {unreadMessages > 0 && (
                      <span className="fa fa-circle count-background" />
                    )}
                    {unreadMessages > 0 && (
                      <span className="count">
                        {unreadMessages > 9 ? 9 : unreadMessages}
                      </span>
                    )}
                  </div>
                </Link>
                <DropdownMenu
                  buttonText={
                    localStorage[
                      Config.getValue("domainPrefix") + ".auth.username"
                    ]
                  }
                >
                  <Link className="dropdown-menu-item" to="/profile/dashboard">
                    Dashboard
                  </Link>
                  <Link className="dropdown-menu-item" to="/profile/affiliates">
                    Affiliate
                  </Link>
                  <Link className="dropdown-menu-item" to="/profile/listings">
                    My Listings
                  </Link>
                  <Link className="dropdown-menu-item" to="/profile/trips">
                    My Trips
                  </Link>
                  <Link
                    className="dropdown-menu-item"
                    to="/profile/reservations"
                  >
                    My Guests
                  </Link>
                  <Link className="dropdown-menu-item" to="/profile/me/edit">
                    Profile
                  </Link>
                  <Link
                    className="dropdown-menu-item"
                    to="/"
                    onClick={this.logout}
                  >
                    Logout
                  </Link>
                </DropdownMenu>
              </ListMenu>
              ) : ( <ListMenu>
                <a href="https://locktrip.zendesk.com/hc/en-us" target="_blank" rel="noopener noreferrer" className="list-menu-item">FAQ</a>
                <a href="https://locktrip.zendesk.com/hc/en-us/requests/new" target="_blank" rel="noopener noreferrer" className="list-menu-item">Support</a>
                <div className="list-menu-item" onClick={() => { this.openModal(LOGIN); }}>Login</div>
                <div className="list-menu-item" onClick={() => { this.openModal(REGISTER); }}>Register</div>
              </ListMenu>
            )}

            {this.props.isLogged ? (
              <BurgerMenu>
                <Link className="menu-item" to="/profile/dashboard">
                  Dashboard
                </Link>
                <Link className="menu-item" to="/profile/affiliates">
                  Affiliate
                </Link>
                <Link className="menu-item" to="/profile/reservations">
                  My Guests
                </Link>
                <Link className="menu-item" to="/profile/trips">
                  My Trips
                </Link>
                <Link className="menu-item" to="/profile/listings">
                  My Listings
                </Link>
                <Link className="menu-item" to="/profile/wallet">
                  Wallet
                </Link>
                <Link className="menu-item" to="/profile/messages">
                  Messages
                </Link>
                <Link className="menu-item" to="/profile/me/edit">
                  Profile
                </Link>
                <Link className="menu-item" to="/" onClick={this.logout}>
                  Logout
                </Link>
              </BurgerMenu>
            ) : (
              <BurgerMenu>
                <div
                  className="menu-item"
                  onClick={() => {
                    this.openModal(LOGIN);
                  }}
                >
                  Login
                </div>
                <div
                  className="menu-item"
                  onClick={() => {
                    this.openModal(REGISTER);
                  }}
                >
                  Register
                </div>
              </BurgerMenu>
            )}
          </div>
          <button
            className="slider-menu-toggle-button mb-only"
            onClick={this.showMenu}
          >
            <span className="fa fa-bars" />
          </button>
        </div>
      </nav>
      </React.Fragment>
    );
  }
}

MainNav.propTypes = {
  // start Router props
  location: PropTypes.object,
  history: PropTypes.object,
  isLogged: PropTypes.bool,

  // start Redux props
  dispatch: PropTypes.func
};

export default withRouter(
  connect(function mapStateToProps(state) {
    return {
      isLogged: UserSelectors.getUserId(state.userInfo) !== null
    };
  })(MainNav)
);
