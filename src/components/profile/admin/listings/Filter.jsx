import '../../../../styles/css/components/profile/admin/filter.scss';

import PropTypes from 'prop-types';
import React from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';

const customStyles = {
  container: (styles) => ({
    ...styles,
    flex: '1 1 0',
    outline: 'none',
    cursor: 'pointer',
    marginRight: '10px'
  }),
  valueContainer: (styles) => ({
    ...styles,
    fontSize: '1.2em',
    height: '60px'
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

function Filter(props) {
  const { countries, cities } = props;

  if (!countries) {
    return <div className="loader"></div>;
  }

  return (
    <div className="filter">
      <form onSubmit={props.onSearch}>
        <input
          type="text"
          name="name"
          placeholder="Listing Title"
          value={props.name}
          onChange={props.onChange} />
        <input
          type="text"
          name="hostEmail"
          placeholder="Host Email"
          value={props.hostEmail}
          onChange={props.onChange} />
        <Select
          styles={customStyles}
          placeholder={'Country'}
          value={props.country.id && props.country}
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.id}
          onChange={props.handleSelectCountry}
          options={countries}
        />
        <Select
          styles={customStyles}
          placeholder="City"
          value={props.city}
          onChange={props.handleSelectCity}
          options={cities}
        />
        <button type="submit" className="button">Search</button>
      </form>
    </div>
  );
}

Filter.propTypes = {
  onSelect: PropTypes.func,
  city: PropTypes.string,
  country: PropTypes.object,
  name: PropTypes.string,
  handleSelectCountry: PropTypes.func,
  handleSelectCity: PropTypes.func,
  cities: PropTypes.array,
  hostEmail: PropTypes.string,
  loading: PropTypes.bool,
  onSearch: PropTypes.func,
  onChange: PropTypes.func,

  // Redux props
  countries: PropTypes.array
};

const mapStateToProps = (state) => {
  const { countriesInfo } = state;

  return {
    countries: countriesInfo.countries
  };
};

export default connect(mapStateToProps)(Filter);
