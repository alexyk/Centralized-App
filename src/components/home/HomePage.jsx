import BancorConvertWidget from '../external/BancorConvertWidget';
import HeroComponent from '../hotels/HeroComponent';
import PopularDestinationsCarousel from '../hotels/carousel/PopularDestinationsCarousel';
import PopularListingItem from '../common/listing/PopularListingItem';
import PropTypes from 'prop-types';
import React from 'react';
import Slider from 'react-slick';
import { connect } from 'react-redux';
import { setRegion } from '../../actions/searchInfo';
import { withRouter } from 'react-router-dom';
import HomePageContentItem from './HomePageContentItem';
import requester from '../../initDependencies';

import '../../styles/css/components/home/home_page.css';

let slider = null;

const SlickButton = (props) => {
  const { currentSlide, slideCount, ...arrowProps } = props;
  return (
    <button type="button" {...arrowProps} />
  );
};

class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      listings: '',
    };

    this.handleDestinationPick = this.handleDestinationPick.bind(this);
    this.redirectToSearchPage = this.redirectToSearchPage.bind(this);
  }

  componentDidMount() {
    requester.getTopListings().then(res => {
      res.body.then(data => {
        this.setState({ listings: data.content });
      });
    });

    requester.getCountries(true).then(res => {
      res.body.then(data => {
        this.setState({ countries: data.content });
      });
    });
  }

  handleDestinationPick(region) {
    this.props.dispatch(setRegion(region));
    document.getElementsByName('stay')[0].click();
  }

  redirectToSearchPage(queryString) {
    this.props.history.push('/hotels/listings' + queryString);
  }

  render() {
    const { listings } = this.state;
    const settings = {
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      nextArrow: <SlickButton />,
      prevArrow: <SlickButton />,
      className: 'hotels-cards',
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
          }
        }
      ]
    };
    return (
      <div>
        <HeroComponent redirectToSearchPage={this.redirectToSearchPage} />
        <BancorConvertWidget />
        <section className="home-page-content">
          <HomePageContentItem
            title="Explore"
            text="What are you looking for?"
            content={<div className="images-container">
              <img src={null} alt="hotels" />
              <img src={null} alt="homes" />
            </div>}
          />
          <HomePageContentItem
            title="Popular"
            text="Hotels around the world"
            content={<h3>Work in progress - waiting end point from backend team.</h3>}
          />
          <HomePageContentItem
            title="Popular"
            text="Homes around the world"
            content={listings &&
              <Slider ref={s => slider = s}
                {...settings}>
                {listings.map((listing, i) => {
                  return (
                    <PopularListingItem
                      key={i}
                      listing={listing}
                      listingsType="homes"
                    />
                  );
                })}
              </Slider>}
          />
          <HomePageContentItem
            title="Top Destinations"
            text="Discover your next experience"
            content={<PopularDestinationsCarousel handleDestinationPick={this.handleDestinationPick} />}
          />
          <section className="get-started">
            <h2>Host on LocKchain</h2>
            <div className="get-started-content">Easily list your home or hotel on LockChain and start earning money</div>
            <button className="btn">Get started</button>
            <div className="get-started-graphic" />
          </section>
        </section>
      </div>
    );
  }
}

HomePage.propTypes = {
  // Router props
  history: PropTypes.object,

  // Redux props
  dispatch: PropTypes.func
};

export default connect()(withRouter(HomePage));