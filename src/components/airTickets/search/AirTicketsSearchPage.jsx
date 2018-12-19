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
import AsideContentPage from '../../common/asideContentPage/AsideContentPage';

import '../../../styles/css/components/airTickets/search/air-tickets-search-page.css';

const DEBUG_SOCKET = false;
const DEFAULT_PAGE_SIZE = 10;

class AirTicketsSearchPage extends Component {
  constructor(props) {
    super(props);

    const queryParams = queryString.parse(this.props.location.search);

    this.state = {
      currentPageResults: '',
      allElements: false,
      allResults: '',
      loading: true,
      totalElements: 0,
      page: !queryParams.page ? 0 : Number(queryParams.page),
      filters: null,
      windowWidth: 0,
      showFiltersMobile: false
    };

    this.onPageChange = this.onPageChange.bind(this);
    this.searchAirTickets = this.searchAirTickets.bind(this);
    this.applyFilters = this.applyFilters.bind(this);
    this.initAirTicketsSearchPage = this.initAirTicketsSearchPage.bind(this);
    this.handleShowFilters = this.handleShowFilters.bind(this);

    // SOCKET BINDINGS
    this.handleReceiveMessageSearch = this.handleReceiveMessageSearch.bind(this);
    this.connectSocketSearch = this.connectSocketSearch.bind(this);
    this.subscribeSearch = this.subscribeSearch.bind(this);
    this.unsubscribeSearch = this.unsubscribeSearch.bind(this);
    this.disconnectSearch = this.disconnectSearch.bind(this);
    this.handleReceiveMessageFilters = this.handleReceiveMessageFilters.bind(this);
    this.connectSocketFilters = this.connectSocketFilters.bind(this);
    this.subscribeFilters = this.subscribeFilters.bind(this);
    this.unsubscribeFilters = this.unsubscribeFilters.bind(this);
    this.disconnectFilters = this.disconnectFilters.bind(this);

    // WINDOW WIDTH BINGINGS
    this.updateWindowWidth = this.updateWindowWidth.bind(this);
  }

  componentDidMount() {
    this.props.initSearchAirTicketsSetTimeout(this.initAirTicketsSearchPage);
  }

  componentWillUnmount() {
    this.unsubscribeSearch();
    this.unsubscribeFilters();
    this.disconnectSearch();
    this.disconnectFilters();
    this.clearIntervals();
  }

  initAirTicketsSearchPage() {
    const queryParams = queryString.parse(this.props.location.search);

    this.setState({
      currentPageResults: '',
      allElements: false,
      allResults: '',
      loading: true,
      totalElements: 0,
      page: !queryParams.page ? 0 : Number(queryParams.page),
      filters: null
    });

    this.unsubscribeSearch();
    this.unsubscribeFilters();
    this.clearIntervals();

    this.queueId = null;
    this.filtersQueueId = null;
    this.clientSearch = null;
    this.clientFilters = null;
    this.subscriptionSearch = null;
    this.subscriptionFilters = null;

    this.searchId = null;
    this.results = {};
    this.totalElements = 0;

    this.flightsResultsIntervalSearch = null;
    this.flightsResultsIntervalFilters = null;

    this.initUUIDs();
    this.populateSearchBar();
    this.requestFlightsSearch();
    this.updateWindowWidth();
    window.addEventListener('resize', this.updateWindowWidth);
  }

  initUUIDs() {
    if (!localStorage.getItem('tickets-uuid')) {
      localStorage.setItem('tickets-uuid', `${uuid()}`);
    }
    const ticketsUUID = localStorage.getItem('tickets-uuid');
    const rnd = this.getRandomInt();
    this.queueId = `${ticketsUUID}-${rnd}`;

    const filtersUUID = localStorage.getItem('tickets-uuid');
    const rndFilters = this.getRandomInt();
    this.filtersQueueId = `${filtersUUID}-${rndFilters}`;
  }

  requestFlightsSearch() {
    fetch(`${Config.getValue('apiHost')}flight/search${this.props.location.search}&uuid=${this.queueId}`)
      .then(res => {
        if (res.ok) {
          this.connectSocketSearch();
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
              filters: data
            });
          });
        }
      })
      .catch(res => {
        console.log(res);
      });
  }

  applyFilters(filtersObject) {
    const filters = {
      airlines: filtersObject.airlines.map(a => a.airlineId).join(',') || null,
      stops: filtersObject.stops.map(a => a.changesId).join(',') || null,
      minPrice: filtersObject.priceRange && filtersObject.priceRange.min,
      maxPrice: filtersObject.priceRange && filtersObject.priceRange.max,
      minWaitTime: filtersObject.waitingTimeRange && filtersObject.waitingTimeRange[0],
      maxWaitTime: filtersObject.waitingTimeRange && filtersObject.waitingTimeRange[1],
      airportsDeparture: filtersObject.airportsDeparture.map(a => a.airportId).join(',') || null,
      airportsArrival: filtersObject.airportsArrival.map(a => a.airportId).join(',') || null,
      airportsTransfer: filtersObject.airportsTransfer.map(a => a.airportId).join(',') || null,
      searchId: this.searchId,
      uuid: this.filtersQueueId
    };

    fetch(`${Config.getValue('apiHost')}flight/search/filter`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(filters)
    })
      .then(res => {
        if (res.ok) {
          res.json().then(() => {
            this.setState({
              loading: true,
              page: 0,
              currentPageResults: '',
              allElements: false,
              totalElements: 0
            }, () => this.connectSocketFilters());
          });
        } else {
          res.json().then((data) => {
            console.log(data);
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

  handleShowFilters() {
    this.setState({ showFiltersMobile: true });
  }

  requestAirportInfo(airportCode) {
    return fetch(`${Config.getValue('apiHost')}flight/city/airports/${airportCode}`, {
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

      const destinations = JSON.parse(searchParams.destinations);
      const flightRouting = searchParams.routing;
      const origin = { id: destinations[0].origin };
      const destination = { id: destinations[0].destination };
      const departureDate = moment(destinations[0].date, 'DD/MM/YYYY');
      let returnDate = moment(departureDate, 'DD/MM/YYYY');
      if (flightRouting === '2') {
        returnDate = moment(destinations[1].date, 'DD/MM/YYYY');
      } else if (flightRouting === '3') {
        returnDate = moment(destinations[1].date, 'DD/MM/YYYY');
        destinations.shift();
      }
      destinations.forEach((destination) => {
        this.requestAirportInfo(destination.origin)
          .then((data) => {
            destination.origin = { code: data.code, name: `${data.cityName}, ${data.cityState ? data.cityState + ', ' : ''}${data.countryName}, ${data.code} airport` };
          });
        this.requestAirportInfo(destination.destination)
          .then((data) => {
            destination.destination = { code: data.code, name: `${data.cityName}, ${data.cityState ? data.cityState + ', ' : ''}${data.countryName}, ${data.code} airport` };
          });
        destination.date = moment(destination.date, 'DD/MM/YYYY');
      });
      const flightClass = searchParams.flightClass;
      const stops = searchParams.stops;
      const departureTime = searchParams.departureTime ? searchParams.departureTime : '';
      const adultsCount = searchParams.adults;
      const children = JSON.parse(searchParams.children);
      const page = searchParams.page;
      const flexSearch = Boolean(searchParams.flexSearch);


      this.props.dispatch(asyncSetStartDate(departureDate));
      this.props.dispatch(asyncSetEndDate(returnDate));
      this.props.dispatch(setAirTicketsSearchInfo(flightRouting, flightClass, stops, departureTime, origin, destination, adultsCount, children, flexSearch, destinations));

      this.populateAirports(origin.id, destination.id);

      this.setState({
        page: page ? Number(page) : 0,
      });
    }
  }

  onPageChange(page) {
    const { allElements, allResults } = this.state;
    const currentPage = page - 1;
    const startResultsIndex = currentPage * 10;
    const endResultsIndex = (currentPage * 10) + 10;
    this.setState({
      page: currentPage,
      currentPageResults: allElements ? allResults.slice(startResultsIndex, endResultsIndex) : Object.values(this.results).slice(startResultsIndex, endResultsIndex)
    });

    window.scrollTo(0, 0);
  }

  getRandomInt() {
    const MAX = 999999999999;
    return Math.floor(Math.random() * Math.floor(MAX));
  }

  connectSocketSearch() {
    this.flightsResultsIntervalSearch = setInterval(() => {
      console.log('');
    }, 1000);

    const url = Config.getValue('socketHost');
    this.clientSearch = Stomp.client(url);

    if (!DEBUG_SOCKET) {
      this.clientSearch.debug = () => { };
    }

    this.clientSearch.connect(null, null, this.subscribeSearch);
  }

  connectSocketFilters() {
    this.flightsResultsIntervalFilters = setInterval(() => {
      console.log('');
    }, 1000);

    const url = Config.getValue('socketHost');
    this.clientFilters = Stomp.client(url);

    if (!DEBUG_SOCKET) {
      this.clientFilters.debug = () => { };
    }

    this.clientFilters.connect(null, null, this.subscribeFilters);
  }

  subscribeSearch() {
    const search = this.props.location.search;
    const endOfSearch = search.length;
    const destination = 'flight/' + this.queueId;
    const client = this.clientSearch;
    const handleReceiveTicketsResults = this.handleReceiveMessageSearch;

    this.subscriptionSearch = client.subscribe(destination, handleReceiveTicketsResults);

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

  subscribeFilters() {
    const search = this.props.location.search;
    const endOfSearch = search.length;
    const destination = 'flight/' + this.filtersQueueId;
    const client = this.clientFilters;
    const handleReceiveTicketsResults = this.handleReceiveMessageFilters;

    this.subscriptionFilters = client.subscribe(destination, handleReceiveTicketsResults);

    const msgObject = {
      uuid: this.filtersQueueId,
      query: search.substr(0, endOfSearch),
    };

    const msg = JSON.stringify(msgObject);

    const sendDestination = 'flight';
    const headers = {
      'content-length': false
    };

    client.send(sendDestination, headers, msg);
  }

  unsubscribeSearch() {
    if (this.subscriptionSearch) {
      this.subscriptionSearch.unsubscribe();
      this.subscriptionSearch = null;
    }
  }

  unsubscribeFilters() {
    if (this.subscriptionFilters) {
      this.subscriptionFilters.unsubscribe();
      this.subscriptionFilters = null;
    }
  }

  disconnectSearch() {
    if (this.clientSearch) {
      this.clientSearch.disconnect();
    }
  }

  disconnectFilters() {
    if (this.clientFilters) {
      this.clientFilters.disconnect();
    }
  }

  clearIntervals() {
    clearInterval(this.flightsResultsIntervalSearch);
    clearInterval(this.flightsResultsIntervalFilters);
  }

  handleReceiveMessageSearch(message) {
    const messageBody = JSON.parse(message.body);
    // console.log(messageBody);
    if (messageBody.allElements) {
      let allResults = Object.values(this.results);
      allResults = allResults.sort((r1, r2) => r1.price.total - r2.price.total);
      this.setState({ allElements: messageBody.allElements, allResults, currentPageResults: allResults.slice(0, 10), loading: false, totalElements: this.totalElements });
      this.results = {};
      this.totalElements = 0;
      this.requestFilters();
      this.unsubscribeSearch();
      this.unsubscribeFilters();
      this.clearIntervals();
    } else if (messageBody.success === false || messageBody.errorMessage) {
      this.setState({ loading: false });
      this.clearIntervals();
      NotificationManager.warning(messageBody.message || messageBody.errorMessage, '', LONG);
    } else if (messageBody.id) {
      if (!this.searchId) {
        this.searchId = messageBody.searchId;
      }
      if (!this.results.hasOwnProperty(messageBody.id)) {
        this.totalElements += 1;
      }
      this.results[messageBody.id] = messageBody;
      if (this.totalElements === 10) {
        this.setState({ currentPageResults: Object.values(this.results), totalElements: this.totalElements, loading: false });
      } else if (this.totalElements % 10 === 0) {
        this.setState({ totalElements: this.totalElements });
      }
    }
  }

  handleReceiveMessageFilters(message) {
    const messageBody = JSON.parse(message.body);
    // console.log(messageBody);
    if (messageBody.allElements) {
      let allResults = Object.values(this.results);
      allResults = allResults.sort((r1, r2) => r1.price.total - r2.price.total);
      this.setState({ allElements: messageBody.allElements, allResults, currentPageResults: allResults.slice(0, 10), loading: false, totalElements: this.totalElements });
      this.results = {};
      this.totalElements = 0;
      this.unsubscribeSearch();
      this.unsubscribeFilters();
      this.clearIntervals();
    } else if (messageBody.success === false || messageBody.errorMessage) {
      this.setState({ loading: false, allElements: true });
      this.clearIntervals();
      NotificationManager.warning(messageBody.message || messageBody.errorMessage, '', LONG);
    } else if (messageBody.id) {
      if (!this.searchId) {
        this.searchId = messageBody.searchId;
      }
      if (!this.results.hasOwnProperty(messageBody.id)) {
        this.totalElements += 1;
      }
      this.results[messageBody.id] = messageBody;
      if (this.totalElements === 10) {
        this.setState({ currentPageResults: Object.values(this.results), totalElements: this.totalElements, loading: false });
      } else if (this.totalElements % 10 === 0) {
        this.setState({ totalElements: this.totalElements });
      }
    }
  }

  searchAirTickets(queryString) {
    this.unsubscribeSearch();
    this.unsubscribeFilters();
    this.disconnectSearch();
    this.disconnectFilters();
    this.clearIntervals();

    this.props.history.push('/tickets/results' + queryString);

    this.setState({
      allResults: '',
      totalElements: 0,
      filters: null,
      loading: true,
      page: 0,
      currentPageResults: '',
      allElements: false,
    }, () => this.requestFlightsSearch());
  }

  render() {
    const { currentPageResults, allElements, loading, filters, totalElements, page, windowWidth, showFiltersMobile } = this.state;

    return (
      <Fragment>
        <div className="container">
          <AirTicketsSearchBar search={this.searchAirTickets} />
        </div>
        <BookingSteps steps={['Search', 'Details', 'Prepare Booking', 'Confirm & Pay']} currentStepIndex={0} />
        <div className="container">
          <AsideContentPage>
            <AsideContentPage.Aside>
              <div className="air-tickets-search-filter-panel">
                <AirTicketsSearchFilterPanel
                  windowWidth={windowWidth}
                  showFiltersMobile={showFiltersMobile}
                  loading={!allElements}
                  filters={filters}
                  handleShowFilters={this.handleShowFilters}
                  applyFilters={this.applyFilters}
                />
              </div>
            </AsideContentPage.Aside>
            <AsideContentPage.Content>
              <div className="air-tickets-search-results-holder">
                <AirTicketsResultsHolder
                  results={currentPageResults}
                  allElements={allElements}
                  loading={loading}
                />
                {!loading &&
                  <Pagination
                    onPageChange={this.onPageChange}
                    currentPage={page + 1}
                    pageSize={DEFAULT_PAGE_SIZE}
                    totalElements={totalElements}
                  />
                }
              </div>
            </AsideContentPage.Content>
          </AsideContentPage>
        </div>
      </Fragment>
    );
  }
}

AirTicketsSearchPage.propTypes = {
  initSearchAirTicketsSetTimeout: PropTypes.func,

  // Router props
  location: PropTypes.object,
  history: PropTypes.object,

  //Redux props
  dispatch: PropTypes.func
};

export default withRouter(connect()(AirTicketsSearchPage));