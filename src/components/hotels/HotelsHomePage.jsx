import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import PopularDestinationsCarousel from './carousel/PopularDestinationsCarousel';
import HeroComponent from './HeroComponent';
import { connect } from 'react-redux';
import BancorConvertWidget from '../external/BancorConvertWidget';

import { setRegion } from '../../actions/searchInfo';

function HotelsHomePage(props) {
  const handleDestinationPick = (region) => {
    props.dispatch(setRegion(region));
    document.getElementsByName('stay')[0].click();
  };

  const redirectToSearchPage = (queryString) => {
    props.history.push('/hotels/listings' + queryString);
  };

  console.log('TEST');

  return (
    <div>
      <HeroComponent redirectToSearchPage={redirectToSearchPage} />
      <BancorConvertWidget />
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