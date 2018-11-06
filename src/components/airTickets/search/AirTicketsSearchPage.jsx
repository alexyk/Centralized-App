import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import moment from 'moment';
import uuid from 'uuid';
import Stomp from 'stompjs';
import Pagination from '../../common/pagination/Pagination';
import AirTicketsSearchBar from './AirTicketsSearchBar';
import { setOrigin, setDestination, setAirTicketsSearchInfo } from '../../../actions/airTicketsSearchInfo';
import { Config } from '../../../config';
import AirTicketsResultsHolder from './AirTicketsSearchResultsHolder';
import AirTicketsSearchFilterPanel from './filter/AirTicketsSearchFilterPanel';
import { LONG } from '../../../constants/notificationDisplayTimes';

import '../../../styles/css/components/airTickets/search/air-tickets-search-page.css';

const DEBUG_SOCKET = false;
const DEFAULT_PAGE_SIZE = 10;

class AirTicketsSearchPage extends Component {
  constructor(props) {
    super(props);

    let queryParams = queryString.parse(this.props.location.search);

    this.queueId = null;
    this.client = null;
    this.subscription = null;
    this.results = [];

    this.flightsResultsInterval = null;

    this.state = {
      results: [],
      allElements: false,
      loading: true,
      page: !queryParams.page ? 0 : Number(queryParams.page),
    };

    this.onPageChange = this.onPageChange.bind(this);
    this.redirectToSearchPage = this.redirectToSearchPage.bind(this);

    // SOCKET BINDINGS
    this.handleReceiveMessage = this.handleReceiveMessage.bind(this);
    this.connectSocket = this.connectSocket.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
    this.disconnect = this.disconnect.bind(this);

    // WINDOW WIDTH BINGINGS
    this.updateWindowWidth = this.updateWindowWidth.bind(this);
  }

  componentDidMount() {
    if (!localStorage.getItem('uuid')) {
      localStorage.setItem('uuid', `${uuid()}`);
    }
    const ticketsUUID = localStorage.getItem('tickets-uuid');
    const rnd = this.getRandomInt();
    this.queueId = `${ticketsUUID}-${rnd}`;

    this.populateSearchBar();

    this.requestFlightsSearch();

    this.updateWindowWidth();
    window.addEventListener('resize', this.updateWindowWidth);
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.disconnect();
    this.clearIntervals();
  }

  requestFlightsSearch() {
    fetch(`${Config.getValue('apiHost')}flight/search${this.props.location.search}&uuid=${this.queueId}`)
      .then(res => {
        if (res.ok) {
          this.connectSocket();
        }
      });
  }

  updateWindowWidth() {
    this.setState({ windowWidth: window.innerWidth });
  }

  getAirportInfo(airportCode) {
    return fetch(`http://localhost:8080/flight/city/search/${airportCode}`, {
      headers: {
        'Content-type': 'application/json'
      }
    }).then(res => {
      return new Promise((resolve, reject) => {
        if (res.ok) {
          res.json().then((data) => {
            resolve(data);
          });
        } else {
          res.json().then((errors) => {
            reject(errors);
          });
        }
      });
    });
  }

  populateAirports(origin, destination) {
    this.getAirportInfo(origin)
      .then((data) => {
        this.props.dispatch(setOrigin({ code: origin, name: `${data.cityName}, ${data.cityState ? data.cityState + ', ' : ''}${data.countryName}, ${origin} airport` }));
      });


    this.getAirportInfo(destination)
      .then((data) => {
        this.props.dispatch(setDestination({ code: destination, name: `${data.cityName}, ${data.cityState ? data.cityState + ', ' : ''}${data.countryName}, ${destination} airport` }));
      });
  }

  populateSearchBar() {
    if (this.props.location.search) {
      const searchParams = queryString.parse(this.props.location.search);
      const routing = searchParams.routing;
      const flightClass = searchParams.flightClass;
      const stops = searchParams.stops;
      const departureTime = searchParams.departureTime ? searchParams.departureTime : '';
      const origin = { id: searchParams.origin };
      const destination = { id: searchParams.destination };
      const departureDate = moment(searchParams.departureDate, 'DD/MM/YYYY');
      let arrivalDate = null;
      if (routing === '2') {
        arrivalDate = moment(searchParams.arrivalDate, 'DD/MM/YYYY');
      }
      const adultsCount = searchParams.adults;
      const children = JSON.parse(searchParams.children);
      const infants = searchParams.infants;
      const hasChildren = children.length !== 0 || infants > 0;
      const page = searchParams.page;

      this.props.dispatch(setAirTicketsSearchInfo(routing, flightClass, stops, departureTime, origin, destination, departureDate, arrivalDate, adultsCount, children, infants, hasChildren));

      this.populateAirports(searchParams.origin, searchParams.destination);

      this.setState({
        page: page ? Number(page) : 0,
      });
    }
  }

  onPageChange(page) {
    this.setState({
      page: page - 1
    });

    window.scrollTo(0, 0);
  }

  isSearchReady() {
    return this.props.location.search.indexOf('&filters=') !== -1;
  }

  getRandomInt() {
    const MAX = 999999999999;
    return Math.floor(Math.random() * Math.floor(MAX));
  }

  connectSocket() {

    this.flightsResultsInterval = setInterval(() => {
      console.log('');
    }, 1000);

    const url = Config.getValue('socketHost');
    this.client = Stomp.client(url);

    if (!DEBUG_SOCKET) {
      this.client.debug = () => { };
    }

    this.client.connect(null, null, this.subscribe);
  }

  subscribe() {
    const search = this.props.location.search;
    const endOfSearch = search.indexOf('&filters=') !== -1 ? search.indexOf('&filters=') : search.length;
    const destination = 'flight/' + this.queueId;
    const client = this.client;
    const handleReceiveTicketsResults = this.handleReceiveMessage;

    this.subscription = client.subscribe(destination, handleReceiveTicketsResults);

    const msgObject = {
      uuid: this.queueId,
      query: search.substr(0, endOfSearch),
    };

    const msg = JSON.stringify(msgObject);

    const sendDestination = 'flight';
    const headers = {
      'content-length': false
    };

    client.send(sendDestination, headers, msg);
  }

  unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  disconnect() {
    if (this.client) {
      this.client.disconnect();
    }
  }

  clearIntervals() {
    clearInterval(this.flightsResultsInterval);
  }

  handleReceiveMessage(message) {
    const messageBody = JSON.parse(message.body);
    console.log(messageBody);
    if (messageBody.allElements) {
      this.results = this.results.sort((r1, r2) => r1.solutions[0].priceInfo.totalPrice - r2.solutions[0].priceInfo.totalPrice);
      this.setState({ results: this.results, loading: false, allElements: true });
      this.unsubscribe();
      this.clearIntervals();
    } else if (messageBody.success === false) {
      this.setState({ loading: false });
      this.clearIntervals();
      NotificationManager.warning(messageBody.message, '', LONG);
    } else if (messageBody.solutions) {
      this.results.push(messageBody);
    }
  }

  redirectToSearchPage(queryString) {
    this.unsubscribe();
    this.disconnect();
    this.clearIntervals();

    this.props.history.push('/tickets/results' + queryString);

    this.setState({
      loading: true,
      page: 0,
      results: [],
      allElements: false,
    }, () => this.requestFlightsSearch());
  }

  render() {
    const { exchangeRatesInfo, paymentInfo, userInfo } = this.props;
    const { results, allElements, loading } = this.state;

    return (
      <div className="container">
        <AirTicketsSearchBar redirectToSearchPage={this.redirectToSearchPage} />
        <div className="air-tickets-search-results">
          <div className="air-tickets-search-filter-panel">
            <AirTicketsSearchFilterPanel
              isSearchReady={allElements}
            />
          </div>
          <div className="air-tickets-search-results-holder">
            <AirTicketsResultsHolder
              results={results.filter((el, index) => index >= (this.state.page * DEFAULT_PAGE_SIZE) && index < (this.state.page * DEFAULT_PAGE_SIZE) + DEFAULT_PAGE_SIZE)}
              exchangeRatesInfo={exchangeRatesInfo}
              paymentInfo={paymentInfo}
              userInfo={userInfo}
              allElements={allElements}
              loading={loading}
            />
            {!this.state.loading &&
              <Pagination
                loading={this.state.loading}
                onPageChange={this.onPageChange}
                currentPage={this.state.page + 1}
                pageSize={DEFAULT_PAGE_SIZE}
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
  history: PropTypes.object,

  // Redux props
  dispatch: PropTypes.func,
  exchangeRatesInfo: PropTypes.object,
  paymentInfo: PropTypes.object,
  userInfo: PropTypes.object
};

const mapStateToProps = (state) => {
  const { exchangeRatesInfo, paymentInfo, userInfo, airTicketsSearchInfo } = state;

  return {
    exchangeRatesInfo,
    paymentInfo,
    userInfo,
    airTicketsSearchInfo
  };
};

export default withRouter(connect(mapStateToProps)(AirTicketsSearchPage));