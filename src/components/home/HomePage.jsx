import BancorConvertWidget from '../external/BancorConvertWidget';
import PopularDestinationsCarousel from '../hotels/carousel/PopularDestinationsCarousel';
import PopularItem from './PopularItem';
import HeroComponent from './HeroComponent';
import PropTypes from 'prop-types';
import React from 'react';
import Slider from 'react-slick';
import { connect } from 'react-redux';
import { setRegion } from '../../actions/searchInfo';
import { withRouter } from 'react-router-dom';
import HomePageContentItem from './HomePageContentItem';
import requester from '../../initDependencies';
import moment from 'moment';

import '../../styles/css/components/home/home_page.css';

let sliderHotels = null;
let sliderListings = null;

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
      hotels: '',
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

    fetch('http://localhost:8080/api/hotels/top')
      .then(res => {
        res.json().then(data => {
          this.setState({ hotels: data.content });
        });
      });

    requester.getCountries().then(res => {
      res.body.then(data => {
        this.setState({ countries: data });
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

  next(slider) {
    slider.slickNext();
  }

  prev(slider) {
    slider.slickPrev();
  }

  getSlider(items, itemsType) {
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

    let slider = itemsType === 'hotels' ? this.sliderHotels : this.sliderListings;

    return items ?
      <div>
        <Slider ref={s => slider = s}
          {...settings}>
          {items.map((item, i) => {
            let itemLink = '';
            if (itemsType === 'hotels') {
              itemLink = `/hotels/listings/${item.id}?region=4455&currency=${this.props.paymentInfo.currency}&startDate=${moment(new Date(new Date().setHours(24)), 'DD/MM/YYYY').format('DD/MM/YYYY')}&endDate=${moment(new Date(new Date().setHours(48)), 'DD/MM/YYYY').format('DD/MM/YYYY')}&rooms=%5B%7B"adults":1,"children":%5B%5D%7D%5D`;
            } else {
              itemLink = `/homes/listings/${item.id}?startDate=${moment(new Date(new Date().setHours(24)), 'DD/MM/YYYY').format('DD/MM/YYYY')}&endDate=${moment(new Date(new Date().setHours(48)), 'DD/MM/YYYY').format('DD/MM/YYYY')}&rooms=%5B%7B"adults":1,"children":%5B%5D%7D%5D`;
            }
            return (
              <PopularItem
                key={i}
                item={item}
                itemType={itemsType}
                itemLink={itemLink}
              />
            );
          })}
        </Slider>
        <div className="carousel-nav">
          <ul>
            <li><button className="icon-arrow-left" onClick={() => this.prev(slider)}></button></li>
            <li><button className="btn">See all</button></li>
            <li><button className="icon-arrow-right" onClick={() => this.next(slider)}></button></li>
          </ul>
        </div>
      </div> : <div className="loader sm-none"></div>;
  }

  render() {
    const { listings, hotels } = this.state;

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
            </ul>
          </HomePageContentItem>
          <HomePageContentItem
            title="Popular"
            text="Hotels around the world"
          >
            {this.getSlider(hotels, 'hotels')}
          </HomePageContentItem>
          <HomePageContentItem
            title="Popular"
            text="Homes around the world"
          >
            {this.getSlider(listings, 'homes')}
          </HomePageContentItem>
          <HomePageContentItem
            title="Top Destinations"
            text="Discover your next experience"
          >
            <PopularDestinationsCarousel handleDestinationPick={this.handleDestinationPick} />
          </HomePageContentItem>
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
