import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import StringUtils from '../../../services/utilities/stringUtilities.js';
import Datepicker from '../../common/datepicker';
import { setCountry, setGuests } from '../../../actions/homesSearchInfo';
import requester from '../../../requester';
import Select from 'react-select';

const customStyles = {
  container: (styles) => ({
    ...styles,
    flex: '1 1 0',
    outline: 'none',
    cursor: 'pointer'
  }),
  valueContainer: (styles) => ({
    ...styles,
    fontSize: '1.2em'
  }),
  input: (styles) => ({
    ...styles,
    outline: 'none',
  }),
  control: (styles) => ({
    ...styles,
    padding: '0 10px',
    cursor: 'pointer',
    boxShadow: 'none',
    border: 0,
  }),
  indicatorSeparator: (styles) => ({
    ...styles,
    display: 'none'
  }),
  menu: (styles) => ({
    ...styles,
    marginTop: '20px'
  }),
  option: (styles, { data, isFocused, isSelected }) => {
    const color = isSelected ? '#d87a61' : 'black';
    return {
      ...styles,
      fontSize: '1.2em',
      textAlign: 'left',
      cursor: 'pointer',
      backgroundColor: isFocused
        ? '#f0f1f3'
        : 'none',
      color: isSelected
        ? color
        : data.color,
      fontWeight: isSelected && '400',
      paddingLeft: isSelected && '30px',
    };
  },
};

class HomesSearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      countries: ''
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.handleChangeCountry = this.handleChangeCountry.bind(this);
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

  handleChangeCountry(selectedOption) {
    if (selectedOption) {
      const country = {
        id: selectedOption.value,
        name: selectedOption.label
      };

      this.props.dispatch(setCountry(country.id));
    }
  }

  render() {
    const { countries } = this.state;
    const { searchDatesInfo, homesSearchInfo } = this.props;
    const { country: countryId } = homesSearchInfo;

    let options = [];
    if (countries) {
      options = countries && countries.map((item, i) => {
        return {
          value: item.id,
          label: StringUtils.shorten(item.name, 30)
        };
      });
    }

    let selectedOption = null;
    if (countryId && countries) {
      const selectedCountry = countries.find((c) => {
        return Number(c.id) === Number(countryId);
      });

      if (selectedCountry) {
        selectedOption = {
          value: selectedCountry.id,
          label: selectedCountry.name,
        };
      }
    }

    return (
      <form className="source-panel" onSubmit={this.handleSearch}>
        <div className="select-wrap source-panel-item">
          <Select
            styles={customStyles}
            value={selectedOption}
            onChange={this.handleChangeCountry}
            options={options}
            placeholder={'Choose a location'}
          />
        </div>

        <div className="check-wrap source-panel-item">
          <div className="check">
            <Datepicker minDate={moment().add(1, 'days')} enableRanges />
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
        <button type="submit" className="button">Search</button>
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