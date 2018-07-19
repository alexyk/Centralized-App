import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/css/components/hero-component.css';
import '../../styles/css/components/tabs-component.css';
import SearchBar from './search/HotelsSearchBar';
import ListingTypeNav from '../common/listingTypeNav/ListingTypeNav';

function HeroComponent(props) {
  return (
    <div className="hero">
      <div className="container">
        <div className="hero-content">
          <h1>Discover your next experience</h1>
          <h2>Browse for homes &amp; hotels worldwide</h2>
          <div className="source-data">
            <ListingTypeNav />
            <SearchBar redirectToSearchPage={props.redirectToSearchPage} />
          </div>
        </div>
      </div>
    </div>
  );
}

HeroComponent.propTypes = {
  redirectToSearchPage: PropTypes.func
};

export default HeroComponent;