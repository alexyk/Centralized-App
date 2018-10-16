import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
// import { NotificationManager } from 'react-notifications';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import moment from 'moment';
import uuid from 'uuid';
import Stomp from 'stompjs';
// import _ from 'lodash';
import Pagination from '../../common/pagination/Pagination';
import AirTicketsSearchBar from './AirTicketsSearchBar';
import { setOrigin, setDestination, setAirTicketsSearchInfo } from '../../../actions/airTicketsSearchInfo';
import requester from '../../../requester';
import { Config } from '../../../config';
import AirTicketsResultsHolder from './AirTicketsSearchResultsHolder';
import * as airTicketsResults from './mockData/airTicketsResults.json';
import AirTicketsSearchFilterPanel from './filter/AirTicketsSearchFilterPanel';
// import { FILTERED_UNAVAILABLE_HOTELS } from '../../../constants/infoMessages';
// import { LONG } from '../../../constants/notificationDisplayTimes';

import '../../../styles/css/components/airTickets/search/air-tickets-search-page.css';

const DEBUG_SOCKET = false;
// const DELAY_INTERVAL = 100;
// const DEBOUNCE_INTERVAL = 1000;

class AirTicketsSearchPage extends Component {
  constructor(props) {
    super(props);

    let queryParams = queryString.parse(this.props.location.search);

    this.client = null;
    this.subscription = null;
    // this.hotelInfo = [];
    // this.hotelInfoById = {};
    this.intervalCounter = 0;
    this.delayIntervals = [];

    this.state = {
      results: [],
      allElements: false,
      loading: true,
      page: !queryParams.page ? 0 : Number(queryParams.page),
    };

    this.onPageChange = this.onPageChange.bind(this);

    // SOCKET BINDINGS
    this.handleReceiveMessage = this.handleReceiveMessage.bind(this);
    this.connectSocket = this.connectSocket.bind(this);
    this.subscribe = this.subscribe.bind(this);
    // this.unsubscribe = this.unsubscribe.bind(this);
    // this.disconnect = this.disconnect.bind(this);


    // WINDOW WIDTH BINGINGS
    this.updateWindowWidth = this.updateWindowWidth.bind(this);
  }

  componentDidMount() {
    this.populateSearchBar();
    // this.connectSocket();
    setTimeout(() => {
      this.setState({
        results: airTicketsResults,
        loading: false,
        allElements: true
      });
    }, 1000);

    this.updateWindowWidth();
    window.addEventListener('resize', this.updateWindowWidth);
  }

  componentWillUnmount() {
    // this.unsubscribe();
    // this.disconnect();
    // this.clearIntervals();
    // this.hotelInfo = [];
    // this.hotelInfoById = {};
  }
  
  updateWindowWidth() {
    this.setState({ windowWidth: window.innerWidth });
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

    // const query = this.props.location.search;
    // const searchParams = queryString.parse(query);

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

  isSearchReady() {
    return this.props.location.search.indexOf('&filters=') !== -1;
  }

  connectSocket() {
    if (!localStorage.getItem('tickets-uuid')) {
      localStorage.setItem('tickets-uuid', `${uuid()}`);
    }

    const url = Config.getValue('socketHost');
    this.client = Stomp.client(url);

    if (!DEBUG_SOCKET) {
      this.client.debug = () => { };
    }

    this.client.connect(null, null, this.subscribe);
  }

  subscribe() {
    const id = localStorage.getItem('tickets-uuid');
    const rnd = this.getRandomInt();
    const search = this.props.location.search;
    const endOfSearch = search.indexOf('&filters=') !== -1 ? search.indexOf('&filters=') : search.length;
    const queueId = `${id}&${rnd}`;
    const destination = 'search/' + queueId;
    const client = this.client;
    const handleReceiveHotelPrice = this.handleReceiveMessage;

    this.subscription = client.subscribe(destination, handleReceiveHotelPrice);

    const msgObject = {
      uuid: queueId,
      query: search.substr(0, endOfSearch),
    };

    const msg = JSON.stringify(msgObject);

    const sendDestination = 'search';
    const headers = {
      'content-length': false
    };

    client.send(sendDestination, headers, msg);
  }

  handleReceiveMessage(message) {
    const messageBody = JSON.parse(message.body);
    if (messageBody.allElements) {
      this.setState({ allElements: true });
      this.unsubscribe();
      // this.applyFilters(() => {
      //   NotificationManager.info(FILTERED_UNAVAILABLE_HOTELS, '', LONG);
      // });
    } else {
      const { id } = messageBody;
      this.hotelInfoById[id] = messageBody;
      this.hotelInfo.push(messageBody);
      this.updateMapInfo(messageBody);
      // const listing = this.state && this.state.hotels ? this.state.hotels.filter(h => h.id === id)[0] : null;
      const index = this.state && this.state.hotels ? this.state.hotels.findIndex(h => h.id === id) : null;
      if (index !== -1) {
        const hotels = this.state.hotels.slice(0);
        hotels[index].price = this.hotelInfoById[id].price;
        // const hotels = { ...this.state.hotels, [id]: listing };
        this.setState({ hotels });
      }
    }
  }

  render() {
    const { exchangeRatesInfo, paymentInfo, userInfo } = this.props;
    const { results, allElements, loading } = this.state;

    return (
      <div className="container">
        <AirTicketsSearchBar />
        <div className="air-tickets-search-results">
          <div className="air-tickets-search-filter-panel">
            <AirTicketsSearchFilterPanel
              isSearchReady={allElements}
            />
          </div>
          <div className="air-tickets-search-results-holder">
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
        </div>
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