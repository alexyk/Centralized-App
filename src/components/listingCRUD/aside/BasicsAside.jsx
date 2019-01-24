import React from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

function BasicAside(props) {
  return (
    <div className="basics-aside">
      <div className="host-step">
        <NavLink exact activeClassName="active" to={props.routes.placetype}>
          Place Type
        </NavLink>
      </div>
      <div className="host-step">
        <NavLink exact activeClassName="active" to={props.routes.accommodation}>
          Accommodation
        </NavLink>
      </div>
      <div className="host-step">
        <NavLink exact activeClassName="active" to={props.routes.facilities}>
          Facilities
        </NavLink>
      </div>
      <div className="host-step">
        <NavLink
          exact
          activeClassName="active"
          to={props.routes.safetyamenities}
        >
          Safety amenities
        </NavLink>
      </div>
      <div className="host-step">
        <NavLink exact activeClassName="active" to={props.routes.location}>
          Location
        </NavLink>
      </div>
    </div>
  );
}

BasicAside.propTypes = {
  routes: PropTypes.any
};

export default BasicAside;
