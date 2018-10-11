import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import requester from '../../requester';
import HomesSearchBar from '../homes/search/HomesSearchBar';
import HotelsSearchBar from '../hotels/search/HotelsSearchBar';
import AirTicketsSearchBar from '../airTickets/search/AirTicketsSearchBar';
import ListingTypeNav from '../common/listingTypeNav/ListingTypeNav';

import '../../styles/css/components/hero-component.css';
import '../../styles/css/components/tabs-component.css';

class HeroComponent extends React.Component {
  constructor(props) {
    super(props);

    let startDate = moment().add(1, 'day');
    let endDate = moment().add(2, 'day');

    this.state = {
      countryId: '',
      countries: undefined,
      startDate: startDate,
      endDate: endDate,
      guests: '2',
      listings: undefined
    };

    this.onChange = this.onChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleDatePick = this.handleDatePick.bind(this);
    this.handleDestinationPick = this.handleDestinationPick.bind(this);
    this.redirectToHotelsSearchPage = this.redirectToHotelsSearchPage.bind(this);
  }

  componentDidMount() {
    requester.getTopListings().then(res => {
      res.body.then(data => {
        this.setState({ listings: data.content });
      });
    });

    requester.getCountries().then(res => {
      res.body.then(data => {
        this.setState({ countries: data });
      });
    });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSearch(e) {
    e.preventDefault();
    let queryString = '?';

    queryString += 'countryId=' + this.state.countryId;
    queryString += '&startDate=' + this.state.startDate.format('DD/MM/YYYY');
    queryString += '&endDate=' + this.state.endDate.format('DD/MM/YYYY');
    queryString += '&guests=' + this.state.guests;

    this.props.history.push('/homes/listings' + queryString);
  }

  handleDatePick(event, picker) {
    this.setState({
      startDate: picker.startDate,
      endDate: picker.endDate,
    });
  }

  handleDestinationPick(region) {
    this.setState({ countryId: region.countryId.toString() });
    document.getElementsByName('stay')[0].click();
  }

  redirectToHotelsSearchPage(queryString) {
    this.props.history.push('/hotels/listings' + queryString);
  }

  getSearchBar(homePage) {
    switch (homePage) {
      case 'homes':
        return (
          <HomesSearchBar
            countryId={this.state.countryId}
            countries={this.state.countries}
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            guests={this.state.guests}
            onChange={this.onChange}
            handleSearch={this.handleSearch}
            handleDatePick={this.handleDatePick}
          />
        );
      case 'tickets':
        return <AirTicketsSearchBar />;
      default:
        return <HotelsSearchBar redirectToSearchPage={this.redirectToHotelsSearchPage} />;
    }
  }

  render() {
    return (
      <div className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Discover your next experience</h1>
            <h2>Browse for homes &amp; hotels worldwide</h2>
            <div className="source-data">
              <ListingTypeNav />
              {this.getSearchBar(this.props.homePage)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

HeroComponent.propTypes = {
  homePage: PropTypes.string,

  // Router props
  history: PropTypes.object
};

export default withRouter(HeroComponent);