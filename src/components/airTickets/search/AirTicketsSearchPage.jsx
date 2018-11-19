import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import moment from 'moment';
import uuid from 'uuid';
import Stomp from 'stompjs';
import Pagination from '../../common/pagination/Pagination';
import BookingSteps from '../../common/bookingSteps';
import AirTicketsSearchBar from './AirTicketsSearchBar';
import { setOrigin, setDestination, setAirTicketsSearchInfo } from '../../../actions/airTicketsSearchInfo';
import { asyncSetStartDate, asyncSetEndDate } from '../../../actions/searchDatesInfo';
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

    this.searchId = null;

    this.flightsResultsInterval = null;

    this.state = {
      results: [],
      allElements: false,
      loading: true,
      page: !queryParams.page ? 0 : Number(queryParams.page),
      filters: null
    };

    this.onPageChange = this.onPageChange.bind(this);
    this.searchAirTickets = this.searchAirTickets.bind(this);

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
      })
      .catch(res => {
        console.log(res);
      });
  }

  requestFilters() {
    fetch(`${Config.getValue('apiHost')}flight/search/filter/data?searchId=${this.searchId}`)
      .then(res => {
        if (res.ok) {
          res.json().then((data) => {
            this.setState({
              filters: JSON.parse(data)
            });
          });
        }
      })
      .catch(res => {
        console.log(res);
      });
  }

  updateWindowWidth() {
    this.setState({ windowWidth: window.innerWidth });
  }

  requestAirportInfo(airportCode) {
    return fetch(`${Config.getValue('apiHost')}flight/city/search/${airportCode}`, {
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
          res.json().then((data) => {
            reject(data);
          });
        }
      });
    });
  }

  populateAirports(origin, destination) {
    this.requestAirportInfo(origin)
      .then((data) => {
        this.props.dispatch(setOrigin({ code: origin, name: `${data.cityName}, ${data.cityState ? data.cityState + ', ' : ''}${data.countryName}, ${origin} airport` }));
      })
      .catch(() => {
        NotificationManager.warning('Wrong origin airport IATA code', '', LONG);
      });


    this.requestAirportInfo(destination)
      .then((data) => {
        this.props.dispatch(setDestination({ code: destination, name: `${data.cityName}, ${data.cityState ? data.cityState + ', ' : ''}${data.countryName}, ${destination} airport` }));
      })
      .catch(() => {
        NotificationManager.warning('Wrong destination airport IATA code', '', LONG);
      });
  }

  populateSearchBar() {
    if (this.props.location.search) {
      const searchParams = queryString.parse(this.props.location.search);
      const flightRouting = searchParams.routing;
      const flightClass = searchParams.flightClass;
      const stops = searchParams.stops;
      const departureTime = searchParams.departureTime ? searchParams.departureTime : '';
      const origin = { id: searchParams.origin };
      const destination = { id: searchParams.destination };
      const departureDate = moment(searchParams.departureDate, 'DD/MM/YYYY');
      let returnDate = moment(departureDate);
      if (flightRouting === '2') {
        returnDate = moment(searchParams.returnDate, 'DD/MM/YYYY');
      }
      const adultsCount = searchParams.adults;
      const children = JSON.parse(searchParams.children);
      const infants = searchParams.infants;
      const hasChildren = children.length !== 0 || infants > 0;
      const page = searchParams.page;

      this.props.dispatch(asyncSetStartDate(departureDate));
      this.props.dispatch(asyncSetEndDate(returnDate));
      this.props.dispatch(setAirTicketsSearchInfo(flightRouting, flightClass, stops, departureTime, origin, destination, adultsCount, children, infants, hasChildren));

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
    // console.log(messageBody);
    if (messageBody.allElements) {
      let results = this.state.results.slice();
      results = results.sort((r1, r2) => r1.price.total - r2.price.total);
      this.setState({ allElements: messageBody.allElements, results, loading: false });
      this.unsubscribe();
      this.clearIntervals();
    } else if (messageBody.success === false || messageBody.errorMessage) {
      this.setState({ loading: false });
      this.clearIntervals();
      NotificationManager.warning(messageBody.message || messageBody.errorMessage, '', LONG);
    } else if (messageBody.id) {
      if (!this.searchId) {
        this.searchId = messageBody.searchId;
        this.requestFilters();
      }
      this.setState({ results: [...this.state.results, messageBody] });
    }
  }

  searchAirTickets(queryString) {
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
    const { results, allElements, loading, filters } = this.state;

    return (
      <Fragment>
        <div className="container">
          <AirTicketsSearchBar search={this.searchAirTickets} />
        </div>
        <BookingSteps steps={['Search', 'Details', 'Prepare Booking', 'Confirm & Pay']} currentStepIndex={0} />
        <div className="container">
          <div className="air-tickets-search-results">
            <div className="air-tickets-search-filter-panel">
              <AirTicketsSearchFilterPanel
                loading={loading}
                filters={filters}
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
      </Fragment>
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