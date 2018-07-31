import BancorConvertWidget from '../external/BancorConvertWidget';
import PopularDestinationsCarousel from '../hotels/carousel/PopularDestinationsCarousel';
import PopularListingItem from '../common/listing/PopularListingItem';
import HeroComponent from './HeroComponent';
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
    <button type="button" {...arrowProps} style={{ display: 'none' }} />
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
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
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

  handleDestinationPick(region, searchUrl) {
    this.props.dispatch(setRegion(region));
    this.props.history.push(searchUrl);
  }

  redirectToSearchPage(queryString) {
    this.props.history.push('/hotels/listings' + queryString);
  }

  next() {
    this.slider.slickNext();
  }

  prev() {
    this.slider.slickPrev();
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
          breakpoint: 1300,
          settings: {
            slidesToShow: 3,
          }
        },
        {
          breakpoint: 980,
          settings: {
            slidesToShow: 2,
          }
        },
        {
          breakpoint: 650,
          settings: {
            slidesToShow: 1,
          }
        }
      ]
    };
    return (
      <div>
        <HeroComponent homePage={this.props.homePage} />
        <BancorConvertWidget />
        <section className="home-page-content">
          <HomePageContentItem
            title="Explore"
            text="What are you looking for?"
            content={
              <ul className="categories">
                <li>
                  <a href="#"><img src="/images/hotels.jpg" alt="hotels" />
                    <h3>Hotels</h3>
                  </a>
                </li>
                <li className="homes">
                  <a href="#"><img src="/images/homes.jpg" alt="homes" />
                    <h3>Homes</h3>
                  </a>
                </li>
              </ul>}
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
              <div>
                <Slider ref={s => this.slider = s}
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
                </Slider>
                <div className="carousel-nav">
                  <ul>
                    <li><button className="icon-arrow-left" onClick={this.prev}></button></li>
                    <li><button className="btn">See all</button></li>
                    <li><button className="icon-arrow-right" onClick={this.next}></button></li>
                  </ul>
                </div>
              </div>}
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
  homePage: PropTypes.string,

  // Router props
  history: PropTypes.object,

  // Redux props
  dispatch: PropTypes.func
};

export default connect()(withRouter(HomePage));
