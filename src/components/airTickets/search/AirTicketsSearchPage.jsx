import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import moment from 'moment';
import Pagination from '../../common/pagination/Pagination';
import AirTicketsSearchBar from './AirTicketsSearchBar';
import { setOrigin, setDestination, setAirTicketsSearchInfo } from '../../../actions/airTicketsSearchInfo';
import requester from '../../../requester';
import AirTicketsResultsHolder from './AirTicketsSearchResultsHolder';
import * as airTicketsResults from './mockData/airTicketsResults.json';

class AirTicketsSearchPage extends Component {
  constructor(props) {
    super(props);

    this.populateSearchBar();

    this.state = {
      results: [],
      allElements: false,
      loading: true
    };

    this.onPageChange = this.onPageChange.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        results: airTicketsResults.default,
        loading: false
      });
    }, 1000);
  }

  getCityInfo(cityId) {
    return requester.getRegionNameById(cityId).then(res => {
      return new Promise((resolve, reject) => {
        if (res.success) {
          res.body.then((data) => {
            resolve(data);
          });
        } else {
          res.errors.then((errors) => {
            reject(errors);
          });
        }
      });
    });
  }

  populateLocations(origin, destination) {
    this.getCityInfo(origin)
      .then((data) => {
        this.props.dispatch(setOrigin(data));
      });


    this.getCityInfo(destination)
      .then((data) => {
        this.props.dispatch(setDestination(data));
      });
  }

  populateSearchBar() {
    if (this.props.location.search) {
      const searchParams = queryString.parse(this.props.location.search);
      const routing = searchParams.routing;
      const flightClass = searchParams.class;
      const stops = searchParams.stops;
      const departureTime = searchParams.departureTime ? searchParams.departureTime : '';
      const origin = { id: searchParams.origin };
      const destination = { id: searchParams.destination };
      const departureDate = moment().add(1, 'day');
      const arrivalDate = moment().add(2, 'day');
      const adultsCount = searchParams.adults;
      const children = searchParams.children;
      const infants = searchParams.infants;
      const hasChildren = searchParams.children.length;
      const page = searchParams.page;

      this.props.dispatch(setAirTicketsSearchInfo(routing, flightClass, stops, departureTime, origin, destination, departureDate, arrivalDate, adultsCount, children, infants, hasChildren));

      this.populateLocations(searchParams.origin, searchParams.destination);

      this.setState({
        page: page ? Number(page) : 0,
      });
    }
  }

  onPageChange(page) {
    this.setState({
      page: page - 1,
      loading: true
    });

    const query = this.props.location.search;
    const searchParams = queryString.parse(query);

    window.scrollTo(0, 0);

    // if (this.isSearchReady()) {
    //   this.applyFilters();
    // } else {
    //   requester.getStaticHotels(region, page - 1).then(res => {
    //     res.body.then(data => {
    //       const listings = data.content;
    //       listings.forEach(l => {
    //         if (this.hotelInfoById[l.id]) {
    //           l.price = this.hotelInfoById[l.id].price;
    //         }
    //       });
    //       const hotels = listings;

    //       this.setState({
    //         hotels,
    //         totalElements: data.totalElements,
    //         loading: false
    //       });
    //     });
    //   });
    // }
  }

  render() {
    const { exchangeRatesInfo, paymentInfo, userInfo } = this.props;
    const { results, allElements, loading } = this.state;

    return (
      <div className="container">
        <AirTicketsSearchBar />
        {this.state.loading
          ? <div className="loader"></div>
          : <AirTicketsResultsHolder
            results={results}
            exchangeRatesInfo={exchangeRatesInfo}
            paymentInfo={paymentInfo}
            userInfo={userInfo}
            allElements={allElements}
            loading={loading}
          />
        }
        {!this.state.loading &&
          <Pagination
            loading={this.state.loading}
            onPageChange={this.onPageChange}
            currentPage={this.state.page + 1}
            pageSize={10}
            totalElements={results.length}
          />
        }
      </div>
    );
  }
}

AirTicketsSearchPage.propTypes = {
  // Router props
  location: PropTypes.object,

  // Redux props
  dispatch: PropTypes.func,
  exchangeRatesInfo: PropTypes.object,
  paymentInfo: PropTypes.object,
  userInfo: PropTypes.object
};

const mapStateToProps = (state) => {
  const { exchangeRatesInfo, paymentInfo, userInfo } = state;

  return {
    exchangeRatesInfo,
    paymentInfo,
    userInfo
  };
};

export default withRouter(connect(mapStateToProps)(AirTicketsSearchPage));