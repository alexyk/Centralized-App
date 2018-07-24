import HeroComponent from './HeroComponent';
import PopularDestinationsCarousel from './carousel/PopularDestinationsCarousel';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { setRegion } from '../../actions/searchInfo';
import { withRouter } from 'react-router-dom';

function HotelsHomePage(props) {
  const handleDestinationPick = (region) => {
    props.dispatch(setRegion(region));
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
  // Router props
  history: PropTypes.object,

  // Redux props
  dispatch: PropTypes.func
};

export default connect()(withRouter(HotelsHomePage));