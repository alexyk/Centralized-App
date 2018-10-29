import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { setShowMenu } from '../../../actions/burgerMenuInfo.js';

import './style.css';

class BurgerMenu extends React.Component {
  constructor(props) {
    super(props);

    this.closeMenu = this.closeMenu.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.showMenu && this.props.showMenu) {
      document.addEventListener('click', this.closeMenu);
    } else if (prevProps.showMenu && !this.props.showMenu) {
      document.removeEventListener('click', this.closeMenu);
    }
  }

  closeMenu() {
    this.props.dispatch(setShowMenu(false));
  }

  render() {
    const menuClass = this.props.showMenu ? 'menu open' : 'menu';
    return (
      <div className="burger-menu mb-only">
        <div className={`${menuClass}`}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

BurgerMenu.propTypes = {
  // Redux props
  showMenu: PropTypes.bool,
  dispatch: PropTypes.func,
};

const mapStateToProps = (state) => ({
  showMenu: state.burgerMenuInfo.showMenu 
});

export default connect(mapStateToProps)(BurgerMenu);