import PropTypes from 'prop-types';
import React from 'react';
import { slide as Menu } from 'react-burger-menu';

import './style.css';

class BurgerMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showMenu: false
    };

    this.showMenu = this.showMenu.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
  }

  showMenu(event) {
    if (event) {
      event.preventDefault();
    }

    this.setState({ showMenu: true }, () => {
      document.addEventListener('click', this.closeMenu);
    });
  }

  toggleMenu() {
    this.setState({ showMenu: !this.state.menuOpen });
  }

  handleStateChange(state) {
    this.setState({ showMenu: state.isOpen });
  }

  closeMenu() {
    this.setState({ showMenu: false }, () => {
      document.removeEventListener('click', this.closeMenu);
    });
  }

  render() {
    const menuClass = this.state.showMenu ? 'menu open' : 'menu';
    return (
      <div className="burger-menu mb-only">
        <button className="toggle-button" onClick={this.showMenu}><span className="fa fa-bars"></span></button>
        <div className={`${menuClass}`}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

BurgerMenu.propTypes = {
};

export default BurgerMenu;