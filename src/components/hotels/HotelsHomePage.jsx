import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import PopularDestinationsCarousel from './carousel/PopularDestinationsCarousel';
import HeroComponent from './HeroComponent';

import { setRegion } from '../../actions/searchInfo';

function HotelsHomePage(props) {
  const handleDestinationPick = (region) => {
    this.props.dispatch(setRegion(region));
    document.getElementsByName('stay')[0].click();
  };

  const redirectToSearchPage = (queryString) => {
    props.history.push('/hotels/listings' + queryString);
  };

  return (
    <div>
      <HeroComponent redirectToSearchPage={redirectToSearchPage} />
      <section id="popular-hotels-box">
        <h2>Popular Destinations</h2>
        <PopularDestinationsCarousel handleDestinationPick={handleDestinationPick} />
        <div className="clearfix"></div>
      </section>

      <section id="get-started">
        <div className="container">
          <div className="get-started-graphic">
            <div className="clearfix"></div>
          </div>
        </div>
      </section>
    </div>
  );
}

HotelsHomePage.propTypes = {
  // start Router props
  history: PropTypes.object,
};

export default withRouter(HotelsHomePage);