import React from 'react';
import AdminNav from '../AdminNav.jsx';
import { NavLink } from "react-router-dom";


export default function UsersTopBar(props) {
  return (
    <AdminNav>
      <div>
        <li>
          <NavLink
            exact
            activeClassName="active"
            to="/profile/admin/users/unverified"
          >
            <h2>Unverified</h2>
          </NavLink>
        </li>
        <li>
          <NavLink
            exact
            activeClassName="active"
            to="/profile/admin/users/verified"
          >
            <h2>Verified</h2>
          </NavLink>
        </li>
        <li>
          <NavLink
            exact
            activeClassName="active"
            to="/profile/admin/users/eraseprofile"
          >
            <h2>Delete User</h2>
          </NavLink>
        </li>
      </div>
    </AdminNav>
  )
}
