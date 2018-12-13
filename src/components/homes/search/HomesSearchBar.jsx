import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import StringUtils from '../../../services/utilities/stringUtilities.js';
import Datepicker from '../../common/datepicker';
import { setCountry, setGuests } from '../../../actions/homesSearchInfo';
import { getCountries } from '../../../selectors/countriesInfo';
import Select from 'react-select';
import { NotificationManager } from 'react-notifications';

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

function HomesSearchBar(props) {

  let select = null;

  const getQueryString = () => {
    let queryString = '?';

    queryString += 'countryId=' + props.countryId;
    queryString += '&startDate=' + props.searchDatesInfo.startDate.format('DD/MM/YYYY');
    queryString += '&endDate=' + props.searchDatesInfo.endDate.format('DD/MM/YYYY');
    queryString += '&guests=' + props.guests;

    return queryString;
  };

  const handleSearch = (e) => {
    if (e) {
      e.preventDefault();
    }

    if (!props.countryId) {
      select.focus();
      NotificationManager.info('Please choose a location.');
    } else {
      props.search(getQueryString());
    }
  };

  const handleChangeCountry = (selectedOption) => {
    if (selectedOption) {
      const country = {
        id: selectedOption.value,
        name: selectedOption.label
      };

      props.dispatch(setCountry(country.id.toString()));
    }
  };

  const { countries, searchDatesInfo, countryId, guests } = props;

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
    <form className="source-panel" onSubmit={handleSearch}>
      <div className="select-wrap source-panel-item">
        <Select
          ref={(node) => select = node}
          styles={customStyles}
          value={selectedOption}
          onChange={handleChangeCountry}
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
        <select onChange={e => props.dispatch(setGuests(e.target.value))}
          className="guest-count"
          value={guests}
          id="location-select"
          name="guests"
          required="required">
          <option value={1}>1 Guest</option>
          <option value={2}>2 Guests</option>
          <option value={3}>3 Guests</option>
          <option value={4}>4 Guests</option>
          <option value={5}>5 Guests</option>
          <option value={6}>6 Guests</option>
          <option value={7}>7 Guests</option>
          <option value={8}>8 Guests</option>
          <option value={9}>9 Guests</option>
          <option value={10}>10 Guests</option>
        </select>
      </div>
      <button type="submit" className="button">Search</button>
    </form>
  );
}

HomesSearchBar.propTypes = {
  excludedDates: PropTypes.array,
  search: PropTypes.func,

  // Redux props
  dispatch: PropTypes.func,
  countryId: PropTypes.string,
  guests: PropTypes.string,
  countries: PropTypes.array,
  searchDatesInfo: PropTypes.object
};

const mapStateToProps = (state) => {
  const { homesSearchInfo, searchDatesInfo, countriesInfo } = state;

  return {
    countryId: homesSearchInfo.country,
    guests: homesSearchInfo.guests,
    searchDatesInfo,
    countries: getCountries(countriesInfo)
  };
};

export default withRouter(connect(mapStateToProps)(HomesSearchBar));