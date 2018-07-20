import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';

function ListingTypeNav() {
  return (
    <div>
      <nav id="second-nav">
        <div className="container">
          <ul>
            <li><NavLink to='/hotels' activeClassName="active">HOTELS</NavLink></li>
            <li><NavLink to='/homes' activeClassName="active">HOMES</NavLink></li>
            <li><NavLink to='/buyloc' activeClassName="active">Buy LOC</NavLink></li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default withRouter(ListingTypeNav);