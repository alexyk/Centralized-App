import '../../../../styles/css/components/profile/admin/filter.css';

import PropTypes from 'prop-types';
import React from 'react';
import Select from 'react-select';

function Filter(props) {
  if (props.loading) {
    return <div className="loader"></div>;
  }

  const renderCountries = props.countries.map((item) => {
    return { value: item.id, label: item.name };
  });

  const renderCities = props.cities.map((item) => {
    return { value: item.id, label: item.name };
  });

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
          name="country"
          placeholder="Country"
          onSelectResetsInput={true}
          clearable={true}
          className="filter_select"
          style={{ border: 'none', boxShadow: 'none' }}
          value={props.country}
          onChange={props.handleSelectCountry}
          options={renderCountries}
        />
        <Select
          name="city"
          placeholder="City"
          className="filter_select"
          style={{ border: 'none', boxShadow: 'none' }}
          value={props.city}
          onChange={props.handleSelectCity}
          options={renderCities}
        />
        <button type="submit" className="btn btn-primary">Search</button>
      </form>
    </div>
  );
}

Filter.propTypes = {
  onSelect: PropTypes.func,
  city: PropTypes.string,
  country: PropTypes.string,
  name: PropTypes.string,
  handleSelectCountry: PropTypes.func,
  handleSelectCity: PropTypes.func,
  countries: PropTypes.array,
  cities: PropTypes.array,
  hostEmail: PropTypes.string,
  loading: PropTypes.bool,
  onSearch: PropTypes.func,
  onChange: PropTypes.func
};

export default Filter;
