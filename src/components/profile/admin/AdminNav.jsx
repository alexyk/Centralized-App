import React from 'react';

import { NavLink } from 'react-router-dom';

import '../../../styles/css/components/profile/admin_panel/navigation-tab.css';

function AdminNav() {
  return (
    <div>
      <ul className="navigation-tab">
        <li><NavLink exact activeClassName="active" to="/profile/admin/listings/published"><h2>Published</h2></NavLink></li>
        <li><NavLink exact activeClassName="active" to="/profile/admin/listings/unpublished"><h2>Unpublished</h2></NavLink></li>
      </ul>
    </div>
  );
}

export default AdminNav;