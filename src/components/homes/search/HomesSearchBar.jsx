import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import StringUtils from '../../../services/utilities/stringUtilities.js';
import Datepicker from '../../common/datepicker';
import { setCountry, setGuests } from '../../../actions/homesSearchInfo';
import requester from '../../../requester';

class HomesSearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      countries: ''
    };

    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    this.requestCountries();
  }

  requestCountries() {
    requester.getCountries().then(res => {
      res.body.then(data => {
        this.setState({ countries: data });
      });
    });
  }

  getQueryString() {
    let queryString = '?';

    queryString += 'countryId=' + this.props.homesSearchInfo.country;
    queryString += '&startDate=' + this.props.searchDatesInfo.startDate.format('DD/MM/YYYY');
    queryString += '&endDate=' + this.props.searchDatesInfo.endDate.format('DD/MM/YYYY');
    queryString += '&guests=' + this.props.homesSearchInfo.guests;

    return queryString;
  }

  handleSearch(e) {
    if (e) {
      e.preventDefault();
    }

    this.props.search(this.getQueryString());
  }

  render() {
    const { countries } = this.state;
    const { searchDatesInfo, homesSearchInfo } = this.props;

    return (
      <form className="source-panel" onSubmit={this.handleSearch}>
        <div className="source-panel-select source-panel-item">
          {countries &&
            <select onChange={e => this.props.dispatch(setCountry(e.target.value))}
              value={homesSearchInfo.country}
              id="location-select"
              name="countryId"
              required="required">
              <option disabled value="">Choose a location</option>
              {countries.map((item, i) => {
                return <option key={i} value={item.id}>{StringUtils.shorten(item.name, 30)}</option>;
              })}
            </select>
          }
        </div>

        <div className="check-wrap source-panel-item">
          <div className="check">
            <Datepicker minDate={moment()} enableRanges excludedDates={this.props.excludedDates || []} />
          </div>

          <div className="days-of-stay">
            <span className="icon-moon"></span>
            <span>{searchDatesInfo.endDate.diff(searchDatesInfo.startDate, 'days')} nights</span>
          </div>
        </div>

        <div className="source-panel-select source-panel-item">
          <select onChange={e => this.props.dispatch(setGuests(e.target.value))}
            value={homesSearchInfo.guests}
            id="location-select"
            name="guests"
            required="required">
            <option value={1}>Guests: 1</option>
            <option value={2}>Guests: 2</option>
            <option value={3}>Guests: 3</option>
            <option value={4}>Guests: 4</option>
            <option value={5}>Guests: 5</option>
            <option value={6}>Guests: 6</option>
            <option value={7}>Guests: 7</option>
            <option value={8}>Guests: 8</option>
            <option value={9}>Guests: 9</option>
            <option value={10}>Guests: 10</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Search</button>
      </form>
    );
  }
}

HomesSearchBar.propTypes = {
  excludedDates: PropTypes.array,
  search: PropTypes.func,

  // Redux props
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

export default withRouter(connect(mapStateToProps)(HomesSearchBar));