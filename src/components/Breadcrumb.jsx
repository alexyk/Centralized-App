import React from 'react';
import { Link } from 'react-router-dom';

function Breadcrumb() {
  return (
    <section id="breadcrumb-bar">
      <div className="container">
        <ul className="breadcrumb">
          <li>
            <Link to="/">Home</Link>
          </li>
        </ul>
        <div className="breadcrumb-arrow"></div>
        <div className="search-term">Listings</div>
      </div>
    </section>
  );
}

export default Breadcrumb;