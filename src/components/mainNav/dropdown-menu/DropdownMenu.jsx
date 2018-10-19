import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './style.css';

class DropdownMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMenu: false,
    };

    this.showMenu = this.showMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
  }

  showMenu(event) {
    event.preventDefault();

    this.setState({ showMenu: true }, () => {
      document.addEventListener('click', this.closeMenu);
    });
  }

  closeMenu() {
    this.setState({ showMenu: false }, () => {
      document.removeEventListener('click', this.closeMenu);
    });
  }

  render() {
    return (
      <div className="nav-dropdown-menu sm-none">
        <div className="nav-dropdown-menu__button" onClick={this.showMenu}>
          {this.props.buttonText}
        </div>

        {
          this.state.showMenu
            ? (
              <div
                className="menu"
                ref={(element) => {
                  this.dropdownMenu = element;
                }}
              >
                {this.props.children}
              </div>
            )
            : (
              null
            )
        }
      </div>
    );
  }
}

DropdownMenu.propTypes = {
  buttonText: PropTypes.string,
};

export default DropdownMenu;