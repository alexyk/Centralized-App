import React from 'react';

import { NavLink } from 'react-router-dom';

import '../../../styles/css/components/profile/admin_panel/navigation-tab.css';

function TripsNav() {
  return (
    <div>
      <ul className="navigation-tab">
        <li><NavLink exact activeClassName="active" to="/profile/trips/hotels"><h2>Hotels</h2></NavLink></li>
        <li><NavLink exact activeClassName="active" to="/profile/trips/homes"><h2>Homes</h2></NavLink></li>
      </ul>
    </div>
  );
}

export default TripsNav;