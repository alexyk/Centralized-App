import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';

import '../../../../styles/css/components/profile/me/profile-edit-nav.css';

function AirTicketsBookingProfileEditNav() {
  return (
    <Fragment>
      <div className="host-step"><NavLink exact activeClassName="active" to="/tickets/results/:id/profile">Profile</NavLink></div>
      <div className="host-step"><NavLink exact activeClassName="active" to="/tickets/results/:id/profile/invoice">Invoice</NavLink></div>
      <div className="host-step"><NavLink exact activeClassName="active" to="/tickets/results/:id/profile/photos">Services</NavLink></div>
      <div className="host-step"><NavLink exact activeClassName="active" to="/tickets/results/:id/profile/verification">Passengers</NavLink></div>
    </Fragment>
  );
}

export default AirTicketsBookingProfileEditNav;
