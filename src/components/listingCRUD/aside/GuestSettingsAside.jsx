import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

function GuestSettingsAside(props) {
  return (
    <div className="guest-settings-aside">
      <div className="host-step"><NavLink exact activeClassName="active" to={props.routes.houserules}>House Rules</NavLink></div>
      <div className="host-step"><NavLink exact activeClassName="active" to={props.routes.checking}>Check-in / Check-out</NavLink></div>
      <div className="host-step"><NavLink exact activeClassName="active" to={props.routes.price}>Price</NavLink></div>
    </div>
  );
}

GuestSettingsAside.propTypes = {
  routes: PropTypes.any,
};

export default GuestSettingsAside;