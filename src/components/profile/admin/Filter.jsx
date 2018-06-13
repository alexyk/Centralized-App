import PropTypes from 'prop-types';
import React from 'react';
import Select from 'react-select';

import '../../../styles/css/components/profile/admin_panel/filter.css';

export default class Filter extends React.Component {
  render() {
    if (this.props.loading) {
      return <div className="loader"></div>;
    }

    const renderCountries = this.props.countries.map((item) => {
      return { value: item.id, label: item.name };
    });

    const renderCities = this.props.cities.map((item) => {
      return { value: item.id, label: item.name };
    });

    return (
      <div className="filter">
        <form onSubmit={this.props.onSearch}>
          <input
            type="text"
            name="name"
            placeholder="Listing Title"
            value={this.props.name}
            onChange={this.props.onChange} />
          <input
            type="text"
            name="hostEmail"
            placeholder="Host Email"
            value={this.props.hostEmail}
            onChange={this.props.onChange} />
          <Select
            name="country"
            placeholder="Country"
            onSelectResetsInput={true}
            clearable={true}
            className="filter_select"
            style={{ border: 'none', boxShadow: 'none' }}
            value={this.props.country}
            onChange={this.props.updateCountry}
            options={renderCountries}
          />
          <Select
            name="city"
            placeholder="City"
            className="filter_select"
            style={{ border: 'none', boxShadow: 'none' }}
            value={this.props.city}
            onChange={option => this.props.onSelect('city', option)}
            options={renderCities}
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </div>
    );
  }
}

Filter.propTypes = {
  onSelect: PropTypes.func,
  city: PropTypes.string,
  country: PropTypes.string,
  name: PropTypes.string,
  updateCountry: PropTypes.func,
  countries: PropTypes.array,
  cities: PropTypes.array,
  hostEmail: PropTypes.string,
  loading: PropTypes.bool,
  onSearch: PropTypes.func,
  onChange: PropTypes.func
};