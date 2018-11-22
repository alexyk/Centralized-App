import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import HomesSearchBar from '../homes/search/HomesSearchBar';
import HotelsSearchBar from '../hotels/search/HotelsSearchBar';
import ListingTypeNav from '../common/listingTypeNav/ListingTypeNav';

import '../../styles/css/components/hero-component.css';
import '../../styles/css/components/tabs-component.css';

class HeroComponent extends React.Component {
  constructor(props) {
    super(props);

    this.searchHotels = this.searchHotels.bind(this);
    this.searchHomes = this.searchHomes.bind(this);
  }

  searchHotels(queryString) {
    this.props.history.push('/hotels/listings' + queryString);
  }

  searchHomes(queryString) {
    this.props.history.push('/homes/listings' + queryString);
  }

  render() {
    return (
      <div className="hero">
        <div className="hero-content">
          <h1>Discover your next experience</h1>
          <h2>Browse for homes &amp; hotels worldwide</h2>
          <div className="source-data">
            <ListingTypeNav />
            {this.props.homePage === 'hotels' ?
              <HotelsSearchBar search={this.searchHotels} /> :
              <HomesSearchBar search={this.searchHomes} />}
          </div>
        </div>
      </div>
    );
  }
}

HeroComponent.propTypes = {
  homePage: PropTypes.string,

  // Router props
  history: PropTypes.object
};

export default withRouter(HeroComponent);