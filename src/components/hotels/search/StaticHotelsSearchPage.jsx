import "../../../styles/css/components/hotels_search/sidebar/sidebar.css";

import {
  setRegion,
  setHotelsSearchInfo
} from "../../../actions/hotelsSearchInfo";
import {
  asyncSetStartDate,
  asyncSetEndDate
} from "../../../actions/searchDatesInfo";
import { getStartDate, getEndDate } from "../../../selectors/searchDatesInfo";
import { getRegion } from "../../../selectors/hotelsSearchInfo";

import { Config } from "../../../config";
import FilterPanel from "./filter/FilterPanel";
import HotelsSearchBar from "./HotelsSearchBar";
import MultiMarkerGoogleMap from "./google-map/MultiMarkerGoogleMap";
import Pagination from "../../common/pagination/Pagination";
import PropTypes from "prop-types";
import React from "react";
import ResultsHolder from "./ResultsHolder";
import Stomp from "stompjs";
import _ from "lodash";
import { connect } from "react-redux";
import moment from "moment";
import queryString from "query-string";
import requester from "../../../requester";
import { setCurrency } from "../../../actions/paymentInfo";
import { isLogged } from "../../../selectors/userInfo";
import { getCurrency } from "../../../selectors/paymentInfo";
import uuid from "uuid";
import { withRouter } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import { LONG } from "../../../constants/notificationDisplayTimes";
import { FILTERED_UNAVAILABLE_HOTELS } from "../../../constants/infoMessages";
import AsideContentPage from "../../common/asideContentPage/AsideContentPage";

const DEBUG_SOCKET = false;
const DELAY_INTERVAL = 100;
const DEBOUNCE_INTERVAL = 1000;

class StaticHotelsSearchPage extends React.Component {
  constructor(props) {
    super(props);

    let queryParams = queryString.parse(this.props.location.search);
    this.queryParams = queryParams;
    this.isMobile = (this.props.location.pathname.indexOf("/mobile") !== -1);

    if (this.isMobile) {
      localStorage.setItem('currency', queryParams.currency);
      try {
        this.props.dispatch(setCurrency(queryParams.currency));
        console.info(`[StaticHotelsSearchPage] CURRENCY, before: ${props.currency}, after: ${localStorage.setItem('currency')}`,{queryParams, props:props});
      } catch (e) {
        console.error(e)
      }
    }

    this.client = null;
    this.subscription = null;
    this.hotelInfo = [];
    this.hotelInfoById = {};
    this.intervalCounter = 0;
    this.delayIntervals = [];

    const startDate = moment(queryParams.startDate, "DD/MM/YYYY");
    const endDate = moment(queryParams.endDate, "DD/MM/YYYY");
    const nights = endDate.diff(startDate, "days");

    this.state = {
      allElements: false,
      hotelName: "",
      showUnavailable: false,
      orderBy: "rank,desc",
      stars: [false, false, false, false, false],
      priceRange: { min: 0, max: 5000 },
      city: "",
      hotels: [],
      mapInfo: [],
      searchParams: null,
      loading: true,
      page: !queryParams.page ? 0 : Number(queryParams.page),
      showMap: false,
      windowWidth: 0,
      showFiltersMobile: false,
      nights
    };

    this.onPageChange = this.onPageChange.bind(this);
    this.clearFilters = this.clearFilters.bind(this);

    this.handlePriceRangeSelect = this.handlePriceRangeSelect.bind(this);
    this.handleOrderBy = this.handleOrderBy.bind(this);
    this.applyFilters = _.debounce(
      this.applyFilters.bind(this),
      DEBOUNCE_INTERVAL
    );
    this.handleToggleStar = this.handleToggleStar.bind(this);
    this.toggleMap = this.toggleMap.bind(this);
    this.getRandomInt = this.getRandomInt.bind(this);
    this.updateMapInfo = this.updateMapInfo.bind(this);
    this.clearIntervals = this.clearIntervals.bind(this);
    this.search = this.search.bind(this);
    this.handleFilterByName = this.handleFilterByName.bind(this);
    this.handleShowUnavailable = this.handleShowUnavailable.bind(this);
    this.isSearchReady = this.isSearchReady.bind(this);
    this.populateFilters = this.populateFilters.bind(this);
    this.getCityLocation = this.getCityLocation.bind(this);
    this.handleShowFilters = this.handleShowFilters.bind(this);
    this.getSearchString = this.getSearchString.bind(this);
    this.getFilterString = this.getFilterString.bind(this);
    this.removeAll = this.removeAll.bind(this);
    this.distributeSearchParameters = this.distributeSearchParameters.bind(
      this
    );

    // SOCKET BINDINGS
    this.handleReceiveMessage = this.handleReceiveMessage.bind(this);
    this.connectSocket = this.connectSocket.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
    this.disconnect = this.disconnect.bind(this);

    // WINDOW WIDTH BINGINGS
    this.updateWindowWidth = _.throttle(
      this.updateWindowWidth.bind(this),
      DEBOUNCE_INTERVAL
    );
  }

  componentDidMount() {
    const query = this.props.location.search;
    const queryParams = queryString.parse(query);

    this.distributeSearchParameters();

    if (!this.props.currency) {
      this.props.dispatch(setCurrency(queryParams.currency));
    }

    if (this.isSearchReady()) {
      this.populateFilters();
    }

    this.requestStaticHotels(queryParams);

    this.updateWindowWidth();
    window.addEventListener("resize", this.updateWindowWidth);
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.disconnect();
    this.clearIntervals();
    this.hotelInfo = [];
    this.hotelInfoById = {};
  }

  distributeSearchParameters() {
    if (this.props.location.search) {
      const searchParams = queryString.parse(this.props.location.search);
      const rooms = JSON.parse(decodeURI(searchParams.rooms));
      const adults = this.getAdults(rooms);
      const hasChildren = this.getHasChildren(rooms);
      const startDate = moment(searchParams.startDate, "DD/MM/YYYY");
      const endDate = moment(searchParams.endDate, "DD/MM/YYYY");
      const regionId = searchParams.region;
      const region = { id: regionId };
      const page = searchParams.page;

      this.props.dispatch(asyncSetStartDate(startDate));
      this.props.dispatch(asyncSetEndDate(endDate));
      this.props.dispatch(
        setHotelsSearchInfo(region, rooms, adults, hasChildren)
      );
      if (this.props.location.pathname.indexOf("/mobile") !== -1) {
        const currency = searchParams.currency;
        this.props.dispatch(setCurrency(currency));
      }

      this.setState({
        page: page ? Number(page) : 0
      });

      this.getCityLocation(regionId);
    }
  }

  requestStaticHotels(queryParams) {
    const { region } = queryParams;
    requester.getStaticHotels(region).then(res => {
      res.body.then(data => {
        const { content } = data;
        content.forEach(l => {
          if (this.hotelInfoById[l.id]) {
            l.price = this.hotelInfoById[l.id];
          }
        });

        const hotels = content;
        this.setState(
          { hotels, totalElements: data.totalElements, loading: false },
          () => {
            this.connectSocket();
          }
        );
      });
    });
  }

  updateWindowWidth() {
    this.setState({ windowWidth: window.innerWidth });
  }

  handleReceiveMessage(message) {
    const messageBody = JSON.parse(message.body);
    if (messageBody.allElements) {
      this.setState({ allElements: true });
      this.unsubscribe();
      this.applyFilters(false, () => {
        NotificationManager.info(FILTERED_UNAVAILABLE_HOTELS, "", LONG);
      });
    } else {
      const { id } = messageBody;
      this.hotelInfoById[id] = messageBody;
      this.hotelInfo.push(messageBody);
      this.updateMapInfo(messageBody);
      // const listing = this.state && this.state.hotels ? this.state.hotels.filter(h => h.id === id)[0] : null;
      const index =
        this.state && this.state.hotels
          ? this.state.hotels.findIndex(h => h.id === id)
          : null;
      if (index !== -1) {
        const hotels = this.state.hotels.slice(0);
        hotels[index].price = this.hotelInfoById[id].price;
        // const hotels = { ...this.state.hotels, [id]: listing };
        this.setState({ hotels });
      }
    }
  }

  // connectSocketForLocRate(){
  //   const topic = "/loc_rate";
  //   const url = Config.getValue("socketHost");
  //   let client = Stomp.client(url);
  //   const onSubscribe = ()=>client.subscribe(topic, (data)=>{
  //   });
  //
  //   this.client.connect(
  //     null,
  //     null,
  //     onSubscribe
  //   );
  // }

  connectSocket() {
    if (!localStorage.getItem("uuid")) {
      localStorage.setItem("uuid", `${uuid()}`);
    }

    const url = Config.getValue("socketHost");
    this.client = Stomp.client(url);

    if (!DEBUG_SOCKET) {
      this.client.debug = () => {};
    }

    this.client.connect(
      null,
      null,
      this.subscribe
    );
  }

  subscribe() {
    const id = localStorage.getItem("uuid");
    const rnd = this.getRandomInt();
    const search = this.props.location.search;
    const endOfSearch =
      search.indexOf("&filters=") !== -1
        ? search.indexOf("&filters=")
        : search.length;
    const queueId = `${id}&${rnd}`;
    const destination = "search/" + queueId;
    const client = this.client;
    const handleReceiveHotelPrice = this.handleReceiveMessage;
    this.subscription = client.subscribe(destination, handleReceiveHotelPrice);
    const msgObject = {
      uuid: queueId,
      query: search.substr(0, endOfSearch)
    };

    const msg = JSON.stringify(msgObject);

    const sendDestination = "search";
    const headers = {
      "content-length": false
    };

    client.send(sendDestination, headers, msg);
  }

  getCityLocation(regionId) {
    this.geocoder = new window.google.maps.Geocoder();
    requester.getRegionNameById(regionId).then(res => {
      res.body.then(data => {
        this.props.dispatch(setRegion(data));
        const address = data.query;

        this.geocoder.geocode({ address: address }, (results, status) => {
          if (status === window.google.maps.GeocoderStatus.OK) {
            this.setState({
              lat: results[0].geometry.location.lat(),
              lon: results[0].geometry.location.lng()
            });
          }
        });
      });
    });
  }

  getAdults(rooms) {
    let adults = 0;
    for (let i = 0; i < rooms.length; i++) {
      adults += Number(rooms[i].adults);
    }
    return adults.toString();
  }

  getHasChildren(rooms) {
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].children.length !== 0) {
        return true;
      }
    }
    return false;
  }

  search(query) {
    this.unsubscribe();
    this.disconnect();
    this.clearIntervals();
    this.hotelInfoById = {};
    this.hotelInfo = [];

    this.props.history.push("/hotels/listings" + query);

    const region = this.props.region.id;

    this.getCityLocation(region);
    const queryParams = queryString.parse(query);
    const startDate = moment(queryParams.startDate, "DD/MM/YYYY");
    const endDate = moment(queryParams.endDate, "DD/MM/YYYY");
    const nights = endDate.diff(startDate, "days");

    this.setState(
      {
        loading: true,
        childrenModal: false,
        page: 0,
        hotels: [],
        mapInfo: [],
        allElements: false,
        stars: [false, false, false, false, false],
        nights
      },
      () => {
        requester.getStaticHotels(region).then(res => {
          res.body.then(data => {
            const hotels = data.content;
            this.setState(
              { hotels, totalElements: data.totalElements, loading: false },
              () => {
                this.connectSocket();
              }
            );
          });
        });
      }
    );
  }

  handleOrderBy(event) {
    this.setState({ loading: true });
    const orderBy = event.target.value;
    this.setState({ orderBy, showMap: false, page: 0 }, () => {
      this.applyFilters(true);
    });
  }

  handlePriceRangeSelect(value) {
    const priceRange = value;
    this.setState({ priceRange, showMap: false, page: 0 }, () => {
      this.applyFilters(true);
    });
  }

  handleFilterByName(event) {
    // this.setState({ loading: true, });
    const hotelName = event.target.value;
    this.setState({ hotelName, showMap: false, page: 0 }, () => {
      this.applyFilters(true);
    });
  }

  handleToggleStar(star) {
    this.setState({ loading: true });
    const stars = this.state.stars;
    stars[star] = !stars[star];
    this.setState({ stars, showMap: false, page: 0 }, () => {
      this.applyFilters(true);
    });
  }

  handleShowUnavailable() {
    const showUnavailable = !this.state.showUnavailable;
    this.setState({ showUnavailable, showMap: false, page: 0 }, () => {
      this.applyFilters(true);
    });
  }

  handleShowFilters() {
    this.setState({ showFiltersMobile: true });
  }

  mapStars(stars) {
    let hasStars = false;
    let mappedStars = [];
    stars.forEach(s => {
      if (s) {
        hasStars = true;
      }
    });

    if (!hasStars) {
      for (let i = 0; i <= 5; i++) {
        mappedStars.push(i);
      }
    } else {
      mappedStars.push(0);
      stars.forEach((s, i) => {
        if (s) {
          mappedStars.push(i + 1);
        }
      });
    }

    return mappedStars;
  }

  populateFilters() {
    const params = queryString.parse(this.props.location.search);
    const filters = JSON.parse(params.filters);
    const stars = [false, false, false, false, false];
    if (filters.stars.length < 6) {
      filters.stars.forEach(s => {
        const star = s - 1;
        if (star >= 0) {
          stars[star] = true;
        }
      });
    }
    this.setState({
      hotelName: filters.name,
      showUnavailable: filters.showUnavailable,
      priceRange: { min: filters.minPrice, max: filters.maxPrice },
      stars: stars,
      orderBy: params.sort,
      page: params.page ? Number(params.page) : 0
    });
  }

  applyFilters(setLoading, onSuccess) {
    if (setLoading) {
      this.setState({ loading: true });
    }
    const baseUrl =
      this.props.location.pathname.indexOf("/mobile") !== -1
        ? "/mobile/hotels/listings"
        : "/hotels/listings";
    const search = this.getSearchString();
    const filters = this.getFilterString();
    const page = this.state.page ? this.state.page : 0;
    requester.getLastSearchHotelResultsByFilter(search, filters).then(res => {
      if (res.success) {
        res.body.then(data => {
          this.setState(
            {
              loading: false,
              hotels: data.content,
              page,
              totalElements: data.totalElements
            },
            () => {
              this.props.history.replace(baseUrl + search + filters);
              if (onSuccess) {
                onSuccess();
              }
            }
          );
        });
      } else {
        this.setState({ loading: false });
      }
    });
  }

  getSearchString() {
    const queryParams = queryString.parse(this.props.location.search);
    let search = `?region=${encodeURI(queryParams.region)}`;
    search += `&currency=${encodeURI(queryParams.currency)}`;
    search += `&startDate=${encodeURI(queryParams.startDate)}`;
    search += `&endDate=${encodeURI(queryParams.endDate)}`;
    search += `&rooms=${encodeURI(queryParams.rooms)}`;
    search += `&nat=${encodeURI(queryParams.nat)}`;
    return search;
  }

  getFilterString() {
    const filtersObj = {
      showUnavailable: this.state.showUnavailable,
      name: this.state.hotelName,
      minPrice: this.state.priceRange.min,
      maxPrice: this.state.priceRange.max,
      stars: this.mapStars(this.state.stars)
    };

    const page = this.state.page ? this.state.page : 0;
    const sort = this.state.orderBy;
    const pagination = `&page=${page}&sort=${sort}`;

    const filters =
      `&filters=${encodeURI(JSON.stringify(filtersObj))}` + pagination;
    return filters;
  }

  clearFilters() {
    this.setState(
      {
        hotelName: "",
        showUnavailable: false,
        orderBy: "rank,desc",
        stars: [false, false, false, false, false],
        priceRange: { min: 0, max: 5000 },
        showMap: false,
        loading: true
      },
      () => {
        this.applyFilters(true);
      }
    );
  }

  toggleMap(e) {
    if (e) {
      e.preventDefault();
    }

    const showMap = this.state.showMap;

    if (showMap) {
      // If map was opened, close it
      this.clearIntervals();
      this.setState({ showMap: !showMap });
      return;
    }

    if (!this.isSearchReady()) {
      // Use partial information from socket
      this.setState({
        showMap: !showMap,
        mapInfo: this.hotelInfo
      });
      return;
    }
    requester.getMapInfo(this.props.location.search).then(res => {
      res.body.then(data => {
        if (!data.isCacheExpired) {
          let mapInfo = [];
          mapInfo = data.content.map(hotel => {
            return {
              id: hotel.id,
              lat: hotel.latitude,
              lon: hotel.longitude,
              name: hotel.name,
              price: hotel.price,
              stars: hotel.star,
              thumbnail: { url: hotel.hotelPhoto }
            };
          });

          this.setState({
            mapInfo: mapInfo,
            showMap: !showMap
          });
        } else {
          const search = this.getSearchString();
          const filters = this.getFilterString();
          const page = this.state.page ? this.state.page : 0;
          this.setState({ loading: true });
          requester
            .getLastSearchHotelResultsByFilter(search, filters)
            .then(res => {
              if (res.success) {
                res.body.then(data => {
                  this.setState({
                    loading: false,
                    hotels: data.content,
                    page,
                    totalElements: data.totalElements
                  });
                  this.toggleMap();
                });
              } else {
              }
            });
        }
      });
    });
  }

  updateMapInfo(hotel) {
    if (this.state.showMap) {
      this.intervalCounter += 1;
      const timeout = this.intervalCounter * DELAY_INTERVAL;
      const delayInterval = setTimeout(() => {
        this.setState(prev => {
          const mapInfo = prev.mapInfo.slice(0);
          mapInfo.push(hotel);
          return {
            mapInfo
          };
        });
      }, timeout);

      this.delayIntervals.push(delayInterval);
    }
  }

  onPageChange(page) {
    this.setState({
      page: page - 1,
      loading: true
    });

    const query = this.props.location.search;
    const searchParams = queryString.parse(query);
    const { region } = searchParams;

    window.scrollTo(0, 0);

    if (this.isSearchReady()) {
      this.applyFilters(true);
    } else {
      requester.getStaticHotels(region, page - 1).then(res => {
        res.body.then(data => {
          const listings = data.content;
          listings.forEach(l => {
            if (this.hotelInfoById[l.id]) {
              l.price = this.hotelInfoById[l.id].price;
            }
          });
          const hotels = listings;

          this.setState({
            hotels,
            totalElements: data.totalElements,
            loading: false
          });
        });
      });
    }
  }

  isSearchReady() {
    return this.props.location.search.indexOf("&filters=") !== -1;
  }

  getRandomInt() {
    const MAX = 999999999999;
    return Math.floor(Math.random() * Math.floor(MAX));
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
    this.intervalCounter = 0;
    this.delayIntervals.forEach(interval => {
      clearInterval(interval);
    });
  }

  removeAll() {
    this.setState({ hotels: [] });
  }

  render() {
    const { hotels, totalElements } = this.state;
    const { nights } = this.state;

    return (
      <React.Fragment>
        <div className="container">
          <HotelsSearchBar search={this.search} />
          <AsideContentPage>
            <AsideContentPage.Aside>
              <div className="hotels-search-sidebar">
                <FilterPanel
                  windowWidth={this.state.windowWidth}
                  showFiltersMobile={this.state.showFiltersMobile}
                  hotelName={this.state.hotelName}
                  priceRange={this.state.priceRange}
                  isSearchReady={this.state.allElements}
                  orderBy={this.state.orderBy}
                  stars={this.state.stars}
                  showUnavailable={this.state.showUnavailable}
                  handleOrderBy={this.handleOrderBy}
                  clearFilters={this.clearFilters}
                  handlePriceRangeSelect={this.handlePriceRangeSelect}
                  handleToggleStar={this.handleToggleStar}
                  handleFilterByName={this.handleFilterByName}
                  handleShowUnavailable={this.handleShowUnavailable}
                  handleShowFilters={this.handleShowFilters}
                />

                <div className="map">
                  <div className="img-holder">
                    <a href="" onClick={this.toggleMap}>
                      See Results {this.state.showMap ? "List" : "on Map"}
                    </a>
                  </div>
                </div>
              </div>
            </AsideContentPage.Aside>

            <AsideContentPage.Content>
              {this.state.showMap ? (
                <div>
                  {this.state.mapLoading ? (
                    <div className="loader" />
                  ) : (
                    <MultiMarkerGoogleMap
                      lat={this.state.lat}
                      lon={this.state.lon}
                      hotels={hotels}
                      mapInfo={this.state.mapInfo}
                      isLogged={this.props.isUserLogged}
                      nights={nights}
                      loading={this.state.loading}
                    />
                  )}
                </div>
              ) : (
                <div>
                  {this.state.loading ? (
                    <div className="loader" />
                  ) : (
                    <ResultsHolder
                      hotels={hotels}
                      allElements={this.state.allElements}
                      nights={nights}
                      loading={this.state.loading}
                    />
                  )}

                  {!this.state.loading && (
                    <Pagination
                      loading={this.state.loading}
                      onPageChange={this.onPageChange}
                      currentPage={this.state.page + 1}
                      pageSize={10}
                      totalElements={totalElements}
                    />
                  )}
                </div>
              )}
            </AsideContentPage.Content>
          </AsideContentPage>
        </div>
      </React.Fragment>
    );
  }
}

StaticHotelsSearchPage.propTypes = {
  // start Router props
  location: PropTypes.object,
  history: PropTypes.object,

  // start Redux props
  dispatch: PropTypes.func,
  currency: PropTypes.string,
  isUserLogged: PropTypes.bool,
  region: PropTypes.object,
  startDate: PropTypes.object,
  endDate: PropTypes.object
};

function mapStateToProps(state) {
  const { paymentInfo, userInfo, hotelsSearchInfo, searchDatesInfo } = state;
  return {
    currency: getCurrency(paymentInfo),
    isUserLogged: isLogged(userInfo),
    region: getRegion(hotelsSearchInfo),
    startDate: getStartDate(searchDatesInfo),
    endDate: getEndDate(searchDatesInfo)
  };
}

export default withRouter(connect(mapStateToProps)(StaticHotelsSearchPage));
