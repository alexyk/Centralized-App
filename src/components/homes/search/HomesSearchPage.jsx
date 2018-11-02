import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import querystring from 'query-string';
import FilterPanel from './filter/FilterPanel';
import HomeResult from './HomeResult';
import HomesSearchBar from './HomesSearchBar';
import Pagination from '../../common/pagination/Pagination';
import requester from '../../../requester';
import { asyncSetStartDate, asyncSetEndDate } from '../../../actions/searchDatesInfo';
import { setHomesSearchInfo } from '../../../actions/homesSearchInfo';

class HomesSearchPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cities: [],
      propertyTypes: [],
      filters: '',
      listings: '',
      loading: true,
      totalItems: 0,
      currentPage: 0,
    };

    this.search = this.search.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.toggleFilter = this.toggleFilter.bind(this);
    this.setFilterPriceValue = this.setFilterPriceValue.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
  }

  componentWillMount() {
    if (this.props.location.search) {
      const searchParams = querystring.parse(this.props.location.search);
      const country = searchParams.countryId;
      const startDate = moment(searchParams.startDate, 'DD/MM/YYYY');
      const endDate = moment(searchParams.endDate, 'DD/MM/YYYY');
      const guests = searchParams.guests;

      const filters = {};
      filters.minPriceValue = searchParams.priceMin && Number(searchParams.priceMin) > 1 ? Number(searchParams.priceMin) : 1;
      filters.maxPriceValue = searchParams.priceMax && Number(searchParams.priceMax) < 5000 ? Number(searchParams.priceMax) : 5000;
      filters.cities = this.getCities(searchParams);
      filters.propertyTypes = this.getPropertyTypes(searchParams);

      this.props.dispatch(asyncSetStartDate(startDate));
      this.props.dispatch(asyncSetEndDate(endDate));
      this.props.dispatch(setHomesSearchInfo(country, guests));

      this.setState({
        filters,
      });
    }
  }

  componentDidMount() {
    let searchTerms = this.getSearchTerms(this.props.location.search);
    searchTerms.push(`page=${this.state.currentPage}`);
    requester.getListingsByFilter(searchTerms).then(res => {
      res.body.then(data => {
        this.setState({
          listings: data.filteredListings.content,
          totalItems: data.filteredListings.totalElements,
          loading: false,
          cities: data.cities,
          propertyTypes: data.types
        });
      });
    });
  }

  componentWillUnmount() {
    this.setState({
      listings: null,
      loading: true,
      currentPage: 0,
      totalItems: 0
    });
  }

  getCities(searchParams) {
    const cities = new Set();
    if (searchParams.cities) {
      searchParams.cities.split(',').forEach(city => {
        cities.add(city);
      });
    }

    return cities;
  }

  getPropertyTypes(searchParams) {
    const propertyTypes = new Set();
    if (searchParams.propertyTypes) {
      searchParams.propertyTypes.split(',').forEach(propertyType => {
        propertyTypes.add(propertyType);
      });
    }

    return propertyTypes;
  }

  search(queryString) {
    this.setState({
      listings: null,
      loading: true,
      totalItems: 0,
      cities: [],
      propertyTypes: []
    });

    this.clearFilters();
    const searchTerms = this.getSearchTerms(queryString);
    requester.getListingsByFilter(searchTerms).then(res => {
      res.body.then(data => {
        this.setState({
          listings: data.filteredListings.content,
          loading: false,
          totalItems: data.filteredListings.totalElements,
          cities: data.cities,
          propertyTypes: data.types
        });
      });
    });

    this.props.history.push('/homes/listings' + queryString);
  }

  handleFilter(e) {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    this.setState({
      listings: null,
      loading: true
    });

    let searchTerms = this.getSearchTerms(this.props.location.search);
    requester.getListingsByFilter(searchTerms).then(res => {
      res.body.then(data => {
        this.setState({
          listings: data.filteredListings.content,
          loading: false,
          totalItems: data.filteredListings.totalElements
        });
      });
    });
    let url = `/homes/listings/?${searchTerms.join('&')}`;
    this.props.history.push(url);
  }

  clearFilters() {
    const filters = Object.assign({}, this.state.filters);

    filters.minPriceValue = 1;
    filters.maxPriceValue = 5000;
    filters.cities = new Set();
    filters.propertyTypes = new Set();

    this.setState({
      filters,
    }, () => this.handleFilter());
  }

  toggleFilter(key, value) {
    const filters = Object.assign({}, this.state.filters);
    if (filters[key].has(value)) {
      filters[key].delete(value);
    } else {
      filters[key].add(value);
    }

    this.setState({ filters });
  }

  setFilterPriceValue(e) {
    const filters = Object.assign({}, this.state.filters);

    const minPrice = e.target.value[0];
    const maxPrice = e.target.value[1];
    filters.minPriceValue = minPrice;
    filters.maxPriceValue = maxPrice;

    this.setState({
      filters
    });
  }

  onPageChange(page) {
    window.scrollTo(0, 0);
    this.setState({
      currentPage: page - 1,
      loading: true
    });

    let searchTerms = this.getSearchTerms(this.props.location.search);
    searchTerms.push(`page=${page - 1}`);
    requester.getListingsByFilter(searchTerms).then(res => {
      res.body.then(data => {
        this.setState({
          listings: data.filteredListings.content,
          loading: false,
          totalItems: data.filteredListings.totalElements
        });
      });
    });
  }

  getSearchTerms(queryString) {
    const { filters } = this.state;
    const searchParams = querystring.parse(queryString);

    let pairs = [];
    pairs.push(`countryId=${searchParams.countryId}`);
    pairs.push(`startDate=${searchParams.startDate}`);
    pairs.push(`endDate=${searchParams.endDate}`);
    pairs.push(`guests=${searchParams.guests}`);
    pairs.push(`priceMin=${filters.minPriceValue}`);
    pairs.push(`priceMax=${filters.maxPriceValue}`);
    if (filters.cities.size > 0) {
      pairs.push(`cities=${Array.from(filters.cities).join(',')}`);
    }
    if (filters.propertyTypes.size > 0) {
      pairs.push(`propertyTypes=${Array.from(filters.propertyTypes).join(',')}`);
    }

    return pairs;
  }

  render() {
    const { listings } = this.state;
    const hasLoadedListings = listings ? true : false;
    const hasListings = hasLoadedListings && listings.length > 0 && listings[0].hasOwnProperty('defaultDailyPrice');

    let renderListings;

    if (!hasLoadedListings || this.state.loading === true) {
      renderListings = <div className="loader"></div>;
    } else if (!hasListings) {
      renderListings = <div className="text-center"><h3>No results</h3></div>;
    } else {
      renderListings = listings.map((item, i) => {
        return <HomeResult key={i} listing={item} />;
      });
    }

    return (
      <React.Fragment>
        <div className="container">
          <HomesSearchBar search={this.search} />
        </div>

        <section id="hotel-box">
          <div className="container">
            <div className="row">
              <div className="col-md-3">
                <FilterPanel
                  cities={this.state.cities}
                  citiesToggled={this.state.filters.cities}
                  propertyTypes={this.state.propertyTypes}
                  propertyTypesToggled={this.state.filters.propertyTypes}
                  priceValue={[this.state.filters.minPriceValue, this.state.filters.maxPriceValue]}
                  setPriceValue={this.setFilterPriceValue}
                  countryId={this.props.homesSearchInfo.country}
                  handleSearch={this.handleFilter}
                  toggleFilter={this.toggleFilter}
                  clearFilters={this.clearFilters} />
              </div>
              <div className="col-md-9">
                <div className="list-hotel-box" id="list-hotel-box">
                  {renderListings}

                  <Pagination
                    loading={this.state.totalItems === 0}
                    onPageChange={this.onPageChange}
                    currentPage={this.state.currentPage + 1}
                    totalElements={this.state.totalItems}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

HomesSearchPage.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,

  dispatch: PropTypes.func,
  homesSearchInfo: PropTypes.object,
  searchDatesInfo: PropTypes.object
};

const mapStateToProps = (state) => {
  const { homesSearchInfo, searchDatesInfo } = state;

  return {
    homesSearchInfo,
    searchDatesInfo
  };
};

export default withRouter(connect(mapStateToProps)(HomesSearchPage));