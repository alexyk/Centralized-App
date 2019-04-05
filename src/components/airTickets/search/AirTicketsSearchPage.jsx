import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { NotificationManager } from "react-notifications";
import PropTypes from "prop-types";
import queryString from "query-string";
import moment from "moment";
import uuid from "uuid";
import Stomp from "stompjs";
import Pagination from "../../common/pagination/Pagination";
import BookingSteps from "../../common/bookingSteps";
import AirTicketsSearchBar from "./AirTicketsSearchBar";
import {
  setOrigin,
  setDestination,
  setAirTicketsSearchInfo
} from "../../../actions/airTicketsSearchInfo";
import {
  asyncSetStartDate,
  asyncSetEndDate
} from "../../../actions/searchDatesInfo";
import { Config } from "../../../config";
import AirTicketsResultsHolder from "./AirTicketsSearchResultsHolder";
// import AirTicketsSearchFilterPanel from "./filter/AirTicketsSearchFilterPanel";
import FiltersPanel from "./filter/components/filters-panel";
import { LONG } from "../../../constants/notificationDisplayTimes";
import AsideContentPage from "../../common/asideContentPage/AsideContentPage";
import { getFilters, sort } from "../../common/flights/filter";
import orderSegments from "./order-flights/order-flights";
import { stopIds } from '../../../constants/constants'
import _ from 'lodash';
import "../../../styles/css/components/airTickets/search/air-tickets-search-page.css";

import {filterFlights} from "./filter/filtering-function/filtering-function"


const DEFAULT_PAGE_SIZE = 10;




class AirTicketsSearchPage extends Component {
  constructor(props) {
    super(props);

    const queryParams = queryString.parse(this.props.location.search);

    this.state = {
      currentPageResults: "",
      allElements: false,
      allResults: "",
      loading: true,
      totalElements: 0,
      page: !queryParams.page ? 0 : Number(queryParams.page),
      filters: null,
      windowWidth: 0,
      showFiltersMobile: false,
      results: null
    };

    this.filterResults = null;
    this.onPageChange = this.onPageChange.bind(this);
    this.searchAirTickets = this.searchAirTickets.bind(this);
    this.applyFilters = this.applyFilters.bind(this);
    this.initAirTicketsSearchPage = this.initAirTicketsSearchPage.bind(this);
    this.handleShowFilters = this.handleShowFilters.bind(this);

    // SOCKET BINDINGS
    this.handleReceiveMessageSearch = this.handleReceiveMessageSearch.bind(
      this
    );
    this.connectSocketSearch = this.connectSocketSearch.bind(this);
    this.subscribeSearch = this.subscribeSearch.bind(this);
    this.unsubscribeSearch = this.unsubscribeSearch.bind(this);
    this.disconnectSearch = this.disconnectSearch.bind(this);
    this.handleReceiveMessageFilters = this.handleReceiveMessageFilters.bind(
      this
    );
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
  }

  initAirTicketsSearchPage() {
    const queryParams = queryString.parse(this.props.location.search);

    this.setState({
      currentPageResults: "",
      allElements: false,
      allResults: "",
      loading: true,
      totalElements: 0,
      page: !queryParams.page ? 0 : Number(queryParams.page),
      filters: null
    });

    this.unsubscribeSearch();
    this.unsubscribeFilters();

    this.queueId = null;
    this.filtersQueueId = null;
    this.clientSearch = null;
    this.clientFilters = null;
    this.subscriptionSearch = null;
    this.subscriptionFilters = null;

    this.searchId = null;
    this.results = {};
    this.totalElements = 0;

    this.initUUIDs();
    this.populateSearchBar();
    this.requestFlightsSearch();
    this.updateWindowWidth();
    window.addEventListener("resize", this.updateWindowWidth);
  }

  initUUIDs(forceUUIDUpdate) {
    if (!localStorage.getItem("tickets-uuid") || forceUUIDUpdate === true) {
      localStorage.setItem("tickets-uuid", `${uuid()}`);
    }
    const ticketsUUID = localStorage.getItem("tickets-uuid");
    const rnd = this.getRandomInt();
    this.queueId = `${ticketsUUID}-${rnd}`;

    const filtersUUID = localStorage.getItem("tickets-uuid");
    const rndFilters = this.getRandomInt();
    this.filtersQueueId = `${filtersUUID}-${rndFilters}`;
  }

  requestFlightsSearch() {
    localStorage.setItem("search_uuid", this.queueId);
    fetch(
      `${Config.getValue("apiHost")}flight/search${
        this.props.location.search
      }&uuid=${this.queueId}`
    )
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
    const res = getFilters(this.searchId);

    res.then(data => {
      data.json().then(filters => {
        this.setState({
          filters: filters,
          allElements: true
        });
      });
    });
  }

  // applyFilters(filtersObject) {
  //   console.log("filtersObject", filtersObject)
  //   let results = this.state.allResults;
  //    // results = sort(this.state.allResults, filtersObject);
  //   const filters = {
  //     airlines: (filtersObject.airlines) ? filtersObject.airlines.map(a => a.airlines) : [],
  //     stops: (!_.isEmpty(filtersObject.stops)) ? (Object.values(filtersObject.stops)).map(a => a.changesId) : [],
  //     minPrice: filtersObject.priceRange && filtersObject.priceRange.min,
  //     maxPrice: filtersObject.priceRange && filtersObject.priceRange.max,
  //     minWaitTime: filtersObject.waitingTimeRange && filtersObject.waitingTimeRange.min,
  //     maxWaitTime: filtersObject.waitingTimeRange && filtersObject.waitingTimeRange.max,
  //     airportsArrival: (filtersObject.airportsArrival != undefined) ? filtersObject.airportsArrival.map(a => a.airportId) : [],
  //     airportsTransfer: (filtersObject.airportsTransfer) ? filtersObject.airportsTransfer.map(a => a.airportId) : [],
  //     departureTime: filtersObject.departureAirports || [],
  //     arrivalTime: filtersObject.arrivalAirports || [],
  //     journeyTime: filtersObject.transferAirports || []
  //   };
  //
  //   const arrivalStartTime = moment(filters.arrivalTime.start, "HH:mm");
  //   const arrivalEndTime = moment(filters.arrivalTime.end, "HH:mm");
  //   const departureStartTime = moment(filters.departureTime.start, "HH:mm");
  //   const departureEndTime = moment(filters.departureTime.end, "HH:mm");
  //   const journeyStartTime = moment(filters.journeyTime.start, "HH:mm");
  //   const journeyEndTime = moment(filters.journeyTime.end, "HH:mm");
  //
  //   const items = results.filter((item, i) => {
  //     const segments = item.segments;
  //     const isDirect = segments.length === 2 && filters.stops.indexOf(stopIds.D) != -1;
  //     const isOneStop = segments.length === 4 && filters.stops.indexOf(stopIds.O) != -1;
  //     const isMultiStop = segments.length > 4 && filters.stops.indexOf(stopIds.M) != -1;
  //     const origin = segments[0].origin;
  //     const destination = segments[segments.length - 1].destination;
  //     const flightJourneyTime = departureStartTime.add(item.journeyTime).format("HH:mm");
  //     const originTime = moment(origin.time, "HH:mm");
  //     const destinationTime = moment(destination.time, "HH:mm");
  //     const waitTimeTotal = segments.map(segment => {
  //         return segment.waitTime;
  //     });
  //
  //     const arrivalAirports = segments.map(segment => {
  //       return segment.destination.code;
  //     });
  //
  //     const transferAirports = segments.map((segment, index) => {
  //         return segment.origin.code;
  //     });
  //
  //
  //     if (isDirect) {
  //       return true;
  //     } else if (isOneStop) {
  //       return true;
  //     } else if (isMultiStop) {
  //       return true;
  //     }
  //
  //     if (departureStartTime.isValid() && departureStartTime.isSameOrBefore(originTime)) {
  //       return true
  //     }
  //
  //     if (departureEndTime.isValid() && departureEndTime.isSameOrAfter(originTime)) {
  //       return true
  //     }
  //
  //     if (arrivalStartTime.isValid() && arrivalStartTime.isSameOrBefore(destinationTime)) {
  //       return true
  //     }
  //
  //     if (arrivalEndTime.isValid() && arrivalEndTime.isSameOrAfter(destinationTime)) {
  //       return true
  //     }
  //
  //     if (journeyStartTime.isValid() && journeyStartTime.isSameOrBefore(flightJourneyTime)) {
  //       return true
  //     }
  //
  //     if (journeyEndTime.isValid() && journeyEndTime.isSameOrAfter(flightJourneyTime)) {
  //       return true
  //     }
  //
  //     if (filters.minPrice >= item.price.total && item.price.total <= filters.maxPrice) {
  //       return true
  //     }
  //
  //     if (filters.minWaitTime !== '' && waitTimeTotal.indexOf(filters.minWaitTime) !== -1) {
  //       return true
  //     }
  //
  //     if (filters.maxWaitTime !== '' && waitTimeTotal.indexOf(filters.maxWaitTime) !== -1) {
  //       return true
  //     }
  //
  //     if (filters.airportsArrival.length) {
  //       for (const k in arrivalAirports) {
  //         const arrival = arrivalAirports[k];
  //         if (filters.airportsArrival.indexOf(arrival) !== -1) {
  //           return true
  //         }
  //       }
  //     }
  //
  //     if (filters.airportsTransfer.length) {
  //       for (const k in transferAirports) {
  //         const transfer = transferAirports[k];
  //         if (filters.airportsTransfer.indexOf(transfer) !== -1) {
  //           return true
  //         }
  //       }
  //     }
  //   });
  //
  //   const data = !items.length ? results : items;
  //
  //   this.setState({
  //     loading: false,
  //     allElements: true,
  //     allResults: data,
  //     currentPageResults: data.slice(0, 10),
  //     totalElements: data.length,
  //     page: 0
  //   });
  // }

  applyFilters(_filters){
    let filters = {
      ..._filters,
      price: {
        minPrice: _filters.price.min,
        maxPrice: _filters.price.max,
      }
    };
    let allResults = Object.values(this.results);
    let filteredFlights = filterFlights(filters, allResults);
    this.setState({
      loading: false,
      allElements: true,
      allResults: allResults,
      currentPageResults: filteredFlights.slice(0, 10),
      totalElements: filteredFlights.length,
      page: 0
    });
  }

  updateWindowWidth() {
    this.setState({ windowWidth: window.innerWidth });
  }

  handleShowFilters() {
    this.setState({ showFiltersMobile: true });
  }

  // requestAirportInfo(airportCode) {
  //   return new Promise((resolve, reject)=>{
  //     setTimeout(()=>{
  //       fetch(
  //         `${Config.getValue("apiHost")}flight/city/airports/${airportCode}`,
  //         {
  //           headers: {
  //             "Content-type": "application/json"
  //           }
  //         }
  //       ).then(res => {
  //         if (res.ok) {
  //           res.json().then(data => {
  //             resolve(data);
  //           });
  //         } else {
  //           res.json().then(data => {
  //             reject(data);
  //           });
  //         }
  //       });
  //     }, 30000)
  //
  //   })
  //
  //   return fetch(
  //     `${Config.getValue("apiHost")}flight/city/airports/${airportCode}`,
  //     {
  //       headers: {
  //         "Content-type": "application/json"
  //       }
  //     }
  //   ).then(res => {
  //     return new Promise((resolve, reject) => {
  //       if (res.ok) {
  //         res.json().then(data => {
  //           resolve(data);
  //         });
  //       } else {
  //         res.json().then(data => {
  //           reject(data);
  //         });
  //       }
  //     });
  //   });
  // }

  requestAirportInfo(airportCode) {
    return fetch(
      `${Config.getValue("apiHost")}flight/city/airports/${airportCode}`,
      {
        headers: {
          "Content-type": "application/json"
        }
      }
    ).then(res => {
      return new Promise((resolve, reject) => {
        if (res.ok) {
          res.json().then(data => {
            resolve(data);
          });
        } else {
          res.json().then(data => {
            reject(data);
          });
        }
      });
    });
  }

  populateAirports(origin, destination) {
    this.requestAirportInfo(origin)
      .then(data => {
        this.props.dispatch(
          setOrigin({
            code: origin,
            name: `${data.cityName}, ${
              data.cityState ? data.cityState + ", " : ""
            }${data.countryName}, ${origin} airport`
          })
        );
      })
      .catch(() => {
        NotificationManager.warning("Wrong origin airport IATA code", "", LONG);
      });

    this.requestAirportInfo(destination)
      .then(data => {
        this.props.dispatch(
          setDestination({
            code: destination,
            name: `${data.cityName}, ${
              data.cityState ? data.cityState + ", " : ""
            }${data.countryName}, ${destination} airport`
          })
        );
      })
      .catch(() => {
        NotificationManager.warning(
          "Wrong destination airport IATA code",
          "",
          LONG
        );
      });
  }

  async populateSearchBar() {
    if (this.props.location.search) {
      const searchParams = queryString.parse(this.props.location.search);

      const destinations = JSON.parse(searchParams.destinations);
      const flightRouting = searchParams.routing;
      const origin = { id: destinations[0].origin };
      const destination = { id: destinations[0].destination };
      const departureDate = moment(destinations[0].date, "DD/MM/YYYY");
      let returnDate = moment(departureDate, "DD/MM/YYYY");
      if (flightRouting === "2") {
        returnDate = moment(destinations[1].date, "DD/MM/YYYY");
      } else if (flightRouting === "3") {
        returnDate = moment(destinations[1].date, "DD/MM/YYYY");
        // debugger;
        // destinations.shift();
        // debugger;

      }

      let updatedDestinations = await Promise.all(destinations.map(async destination=>{
        let origin = await this.requestAirportInfo(destination.origin).then(data => {
          return {
            city: data.cityName,
            code: data.code,
            name: `${data.cityName}, ${
              data.cityState ? data.cityState + ", " : ""
              }${data.countryName}, ${data.code} airport`
          };
        });
        let dest = await this.requestAirportInfo(destination.destination).then(data => {
          return {
            city: data.cityName,
            code: data.code,
            name: `${data.cityName}, ${
              data.cityState ? data.cityState + ", " : ""
              }${data.countryName}, ${data.code} airport`
          };
        });
        let date = moment(destination.date, "DD/MM/YYYY");
        return {
          origin,
          destination: dest,
          date
        }
      }))

      // destinations.forEach(destination => {
      //   this.requestAirportInfo(destination.origin).then(data => {
      //     destination.origin = {
      //       code: data.code,
      //       name: `${data.cityName}, ${
      //         data.cityState ? data.cityState + ", " : ""
      //       }${data.countryName}, ${data.code} airport`
      //     };
      //   });
      //   this.requestAirportInfo(destination.destination).then(data => {
      //     destination.destination = {
      //       code: data.code,
      //       name: `${data.cityName}, ${
      //         data.cityState ? data.cityState + ", " : ""
      //       }${data.countryName}, ${data.code} airport`
      //     };
      //   });
      //   destination.date = moment(destination.date, "DD/MM/YYYY");
      // });
      const flightClass = searchParams.flightClass;
      const stops = searchParams.stops;
      const departureTime = searchParams.departureTime
        ? searchParams.departureTime
        : "";
      const adultsCount = searchParams.adults;
      const children = JSON.parse(searchParams.children);
      const page = searchParams.page;
      const flexSearch = searchParams.flexSearch === true;

      this.props.dispatch(asyncSetStartDate(departureDate));
      this.props.dispatch(asyncSetEndDate(returnDate));
      this.props.dispatch(
        setAirTicketsSearchInfo(
          flightRouting,
          flightClass,
          stops,
          departureTime,
          origin,
          destination,
          adultsCount,
          children,
          flexSearch,
          updatedDestinations
        )
      );

      this.populateAirports(origin.id, destination.id);

      this.setState({
        page: page ? Number(page) : 0
      });
    }
  }

  onPageChange(page) {
    const { allElements, allResults } = this.state;
    const currentPage = page - 1;
    const startResultsIndex = currentPage * 10;
    const endResultsIndex = startResultsIndex + 10;
    let items = this.results;

    if (allElements) {
      if (Array.isArray(allResults)) {
        items = allResults.slice(startResultsIndex, endResultsIndex);
      } else {
        items = Object.values(allResults).slice(
          startResultsIndex,
          endResultsIndex
        );
      }
    } else {
      items = Object.values(items).slice(startResultsIndex, endResultsIndex);
    }

    this.setState({
      page: currentPage,
      currentPageResults: items
    });

    window.scrollTo(0, 0);
  }

  getRandomInt() {
    const MAX = 999999999999;
    return Math.floor(Math.random() * Math.floor(MAX));
  }

  connectSocketSearch() {
    const url = Config.getValue("socketHost");
    this.clientSearch = Stomp.client(url);
    this.clientSearch.debug = null;
    this.clientSearch.connect(null, null, this.subscribeSearch, () => {
      this.setState({
        currentPageResults: "",
        allElements: true,
        allResults: {},
        loading: false,
        totalElements: 0,
        page: 0,
        filters: null,
        windowWidth: 0,
        showFiltersMobile: false
      });
    });
  }

  connectSocketFilters() {
    const url = Config.getValue("socketHost");
    this.clientFilters = Stomp.client(url);
    this.clientFilters.connect(null, null, this.subscribeFilters);
  }

  subscribeSearch() {
    const search = this.props.location.search;
    const endOfSearch = search.length;
    const destination = "flight/" + this.queueId;
    const client = this.clientSearch;
    const handleReceiveTicketsResults = this.handleReceiveMessageSearch;
    this.results = {};
    this.subscriptionSearch = client.subscribe(
      destination,
      handleReceiveTicketsResults
    );

    const msgObject = {
      uuid: this.queueId,
      query: search.substr(0, endOfSearch)
    };

    const msg = JSON.stringify(msgObject);

    const sendDestination = "flight";
    const headers = {
      "content-length": false
    };

    client.send(sendDestination, headers, msg);
  }

  subscribeFilters() {
    const search = this.props.location.search;
    const endOfSearch = search.length;
    const destination = "flight/" + this.filtersQueueId;
    const client = this.clientFilters;
    const handleReceiveTicketsResults = this.handleReceiveMessageFilters;

    this.subscriptionFilters = client.subscribe(
      destination,
      handleReceiveTicketsResults
    );

    const msgObject = {
      uuid: this.filtersQueueId,
      query: search.substr(0, endOfSearch)
    };

    const msg = JSON.stringify(msgObject);

    const sendDestination = "flight";
    const headers = {
      "content-length": false
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

  handleReceiveMessageSearch(message) {
    const messageBody = JSON.parse(message.body);

    if (messageBody.allElements) {
      let allResults = Object.values(this.results);
      allResults = allResults.sort((r1, r2) => r1.price.total - r2.price.total);
      this.setState({
        allElements: messageBody.allElements,
        allResults: allResults,
        currentPageResults: allResults.slice(0, 10),
        loading: false,
        totalElements: this.totalElements,
        results: allResults
      });
      this.totalElements = 0;
      this.unsubscribeFilters();
      this.requestFilters();
    } else if (messageBody.success === false || messageBody.errorMessage) {
      this.setState({ loading: false });
      NotificationManager.warning(
        messageBody.message || messageBody.errorMessage,
        "",
        LONG
      );
    } else if (messageBody.id) {
      if (!this.searchId) {
        this.searchId = messageBody.searchId;
      }
      if (!this.results.hasOwnProperty(messageBody.id)) {
        this.totalElements += 1;
      }

      var orderedSegments = orderSegments(messageBody.segments);

      this.results[messageBody.id] = {
        ...messageBody,
        orderedSegments: orderedSegments
      };

      if (this.totalElements === 10) {
        this.setState({
          currentPageResults: Object.values(this.results),
          totalElements: this.totalElements,
          loading: false
        });
      } else if (this.totalElements % 10 === 0) {
        this.setState({ totalElements: this.totalElements });
      }
    }
  }

  handleReceiveMessageFilters(message) {
    const messageBody = JSON.parse(message.body);

    if (messageBody.allElements) {
      let allResults = Object.values(this.results);
      allResults = allResults.sort((r1, r2) => r1.price.total - r2.price.total);
      this.setState({
        allElements: messageBody.allElements,
        allResults: allResults,
        currentPageResults: allResults.slice(0, 10),
        loading: false,
        totalElements: this.totalElements
      });
      this.totalElements = 0;
      this.unsubscribeSearch();
      this.unsubscribeFilters();
    } else if (messageBody.success === false || messageBody.errorMessage) {
      this.setState({ loading: false, allElements: true });
      NotificationManager.warning(
        messageBody.message || messageBody.errorMessage,
        "",
        LONG
      );
    } else if (messageBody.id) {
      if (!this.searchId) {
        this.searchId = messageBody.searchId;
      }
      if (!this.results.hasOwnProperty(messageBody.id)) {
        this.totalElements += 1;
      }
      this.results[messageBody.id] = messageBody;
      if (this.totalElements === 10) {
        this.setState({
          currentPageResults: Object.values(this.results),
          totalElements: this.totalElements,
          loading: false
        });
      } else if (this.totalElements % 10 === 0) {
        this.setState({ totalElements: this.totalElements });
      }
    }
  }

  searchAirTickets(queryString) {
    this.props.history.push("/tickets/results" + queryString);
    this.setState(
      {
        currentPageResults: "",
        allElements: false,
        allResults: "",
        loading: true,
        totalElements: 0,
        page: 0,
        filters: null
      },
      e => {
        this.unsubscribeSearch();
        this.unsubscribeFilters();
        this.initUUIDs();
        this.requestFlightsSearch();
      }
    );
  }



  render() {

    if(this.state.allElements){
      console.log(JSON.stringify(Object.values(this.results).filter(result=>{
        let segments = result.segments;
        let withMultipleSegmentsInZero = segments.filter(segment=>segment.group === "0");
        let withMultipleSegmentsInOne = segments.filter(segment=>segment.group === "1");
        let withMultipleSegmentsInTwo = segments.filter(segment=>segment.group === "2");
        if(withMultipleSegmentsInZero.length === 3 || withMultipleSegmentsInOne.length === 3 || withMultipleSegmentsInTwo.length === 3){
          return true;
        }
      })))
    }

    const {
      currentPageResults,
      allElements,
      loading,
      filters,
      totalElements,
      page,
      windowWidth,
      showFiltersMobile
    } = this.state;
    return (
      <Fragment>
        <div className="container">
          <AirTicketsSearchBar search={this.searchAirTickets} />
        </div>
        <BookingSteps
          steps={["Search", "Details", "Prepare Booking", "Confirm & Pay"]}
          currentStepIndex={0}
        />
        <h4 style={{ color: "red", textAlign: "center", marginBottom: "20px" }}>
          LockTrip Flights are still in alpha
        </h4>
        <div className="container">
          <AsideContentPage>
            <AsideContentPage.Aside>
              <div className="air-tickets-search-filter-panel">
                {
                  filters && (
                    <FiltersPanel
                      onSelectedFiltersChange={this.applyFilters}
                      windowWidth={windowWidth}
                      showFiltersMobile={showFiltersMobile}
                      loading={!allElements}
                      filters={filters}
                      handleShowFilters={this.handleShowFilters}
                      results={allElements && Object.values(this.results)}
                    />)
                }
              </div>
            </AsideContentPage.Aside>
            <AsideContentPage.Content>
              <div className="air-tickets-search-results-holder">
                <AirTicketsResultsHolder
                  results={currentPageResults}
                  allElements={allElements}
                  loading={loading}
                />
                {!loading && (
                  <Pagination
                    onPageChange={this.onPageChange}
                    currentPage={page + 1}
                    pageSize={DEFAULT_PAGE_SIZE}
                    totalElements={totalElements}
                  />
                )}
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
