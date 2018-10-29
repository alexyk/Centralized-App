import BancorConvertWidget from '../external/BancorConvertWidget';
import PopularDestinationsCarousel from '../hotels/carousel/PopularDestinationsCarousel';
import PopularItem from './PopularItem';
import HeroComponent from './HeroComponent';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import Slider from 'react-slick';
import { connect } from 'react-redux';
import { setRegion } from '../../actions/searchInfo';
import { withRouter, Link } from 'react-router-dom';
import HomePageContentItem from './HomePageContentItem';
import moment from 'moment';
import PopularHomesPrice from './PopularHomesPrice';

import '../../styles/css/components/home/home_page.css';

const SlickButton = ({ currentSlide, slideCount, ...arrowProps }) => {
  return (
    <button {...arrowProps} style={{ display: 'none' }} />
  );
};

class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.sliderHotels = null;
    this.sliderListings = null;

    this.handleDestinationPick = this.handleDestinationPick.bind(this);
    this.redirectToSearchPage = this.redirectToSearchPage.bind(this);
  }

  handleDestinationPick(region, searchUrl) {
    this.props.dispatch(setRegion(region));
    this.props.history.push(searchUrl);
  }

  redirectToSearchPage(queryString) {
    this.props.history.push('/hotels/listings' + queryString);
  }

  next(slider) {
    slider.slickNext();
  }

  prev(slider) {
    slider.slickPrev();
  }

  getSlider(items, itemsType) {
    const settings = {
      infinite: false,
      draggable: false,
      lazyLoad: 'ondemand',
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

    let allLink = '/hotels';
    let slider = itemsType === 'hotels' ? this.sliderHotels : this.sliderListings;

    if (itemsType === 'hotels') {
      allLink = items && `/hotels/listings?region=${items[0].region}&currency=${this.props.paymentInfo.currency}&startDate=${moment(new Date(new Date().setHours(24)), 'DD/MM/YYYY').format('DD/MM/YYYY')}&endDate=${moment(new Date(new Date().setHours(48)), 'DD/MM/YYYY').format('DD/MM/YYYY')}&rooms=%5B%7B"adults":2,"children":%5B%5D%7D%5D`;
    } else {
      allLink = `/homes/listings?countryId=2&startDate=${moment(new Date(new Date().setHours(24)), 'DD/MM/YYYY').format('DD/MM/YYYY')}&endDate=${moment(new Date(new Date().setHours(48)), 'DD/MM/YYYY').format('DD/MM/YYYY')}&guests=2`;
    }

    return items ?
      <Fragment>
        <Slider ref={s => slider = s}
          {...settings}>
          {items.map((item, i) => {
            let itemLink = '';
            if (itemsType === 'hotels') {
              itemLink = `/hotels/listings/${item.id}?region=${item.region}&currency=${this.props.paymentInfo.currency}&startDate=${moment(new Date(new Date().setHours(24)), 'DD/MM/YYYY').format('DD/MM/YYYY')}&endDate=${moment(new Date(new Date().setHours(48)), 'DD/MM/YYYY').format('DD/MM/YYYY')}&rooms=%5B%7B"adults":1,"children":%5B%5D%7D%5D`;
            } else {
              itemLink = `/homes/listings/${item.id}?startDate=${moment(new Date(new Date().setHours(24)), 'DD/MM/YYYY').format('DD/MM/YYYY')}&endDate=${moment(new Date(new Date().setHours(48)), 'DD/MM/YYYY').format('DD/MM/YYYY')}&guests=2`;
            }
            return (
              <div key={i} className="card">
                <PopularItem
                  item={item}
                  itemType={itemsType}
                  itemLink={itemLink}
                />
                {itemsType === 'homes' && <PopularHomesPrice item={item} />}
              </div>
            );
          })}
        </Slider>
        <div className="carousel-nav">
          <ul>
            <li><button className="icon-arrow-left" onClick={() => this.prev(slider)}></button></li>
            <li><Link to={allLink} className="btn">See all</Link></li>
            <li><button className="icon-arrow-right" onClick={() => this.next(slider)}></button></li>
          </ul>
        </div>
      </Fragment> : <div className="loader sm-none"></div>;
  }

  render() {
    const { listings, hotels } = this.props;
    const isHotels = this.props.match.url.indexOf('/hotels') >= 0;

    return (
      <div>
        <HeroComponent homePage={this.props.homePage} />
        <BancorConvertWidget />
        <section className="home-page-content">
          <HomePageContentItem
            title="Explore"
            text="What are you looking for?"
          >
            <ul className="categories">
              <li className={isHotels ? 'active' : ''}>
                <Link to="/hotels">
                  <img src="/images/hotels.jpg" alt="hotels" />
                  <h3>Hotels</h3>
                </Link>
              </li>
              <li className={!isHotels ? 'active homes' : 'homes'}>
                <Link to="/homes">
                  <img src="/images/homes.jpg" alt="homes" />
                  <h3>Homes</h3>
                </Link>
              </li>
            </ul>
          </HomePageContentItem>
          <HomePageContentItem
            title="Popular"
            text="Hotels around the world"
          >
            {hotels[0] && this.getSlider(hotels, 'hotels')}
          </HomePageContentItem>
          <HomePageContentItem
            title="Popular"
            text="Homes around the world"
          >
            {listings[0] && this.getSlider(listings, 'homes')}
          </HomePageContentItem>
          <HomePageContentItem
            title="Top Destinations"
            text="Discover your next experience"
          >
            <PopularDestinationsCarousel handleDestinationPick={this.handleDestinationPick} />
          </HomePageContentItem>
          <section className="get-started">
            <h2>Host on LocKtrip</h2>
            <div className="get-started-content">Easily list your home or hotel on Locktrip and start earning money</div>
            <Link to="/profile/listings/create/landing" className="btn">Get started</Link>
            <div className="get-started-graphic" />
          </section>
        </section>
      </div>
    );
  }
}

HomePage.propTypes = {
  homePage: PropTypes.string,
  listings: PropTypes.array,
  hotels: PropTypes.array,

  // Router props
  history: PropTypes.object,

  // Redux props
  dispatch: PropTypes.func,
  paymentInfo: PropTypes.object
};

function mapStateToProps(state) {
  const { paymentInfo } = state;
  return {
    paymentInfo
  };
}

export default connect(mapStateToProps)(withRouter(HomePage));
