import React from 'react';
import PropTypes from 'prop-types';
import NumberRangeSlider from '../../../common/numberRangeSlider';

import '../../../../styles/css/components/hotels_search/filter/filter.css';

function FilterPanel(props) {
  return (
    <div className="filter-box">
      <div className="checkbox-filters">
        <h5>Cities</h5>
        <div className="filter-check-box">
          <ul>
            {props.cities.map((item, i) => {
              return (
                <li key={i} onClick={(e) => { props.toggleFilter('cities', item.text); props.handleSearch(e); }}>
                  <div className="key">
                    <input type="checkbox" name={item.text} checked={props.citiesToggled.has(item.text)} />
                    <label htmlFor={item.text}>{item.text}</label>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="range-filters">
        <h5>Pricing</h5>

        <NumberRangeSlider
          minLabel={`$${props.priceValue.min}`}
          maxLabel={`$${props.priceValue.max}`}
          minValue={0}
          maxValue={5000}
          value={props.priceValue}
          onChange={value => { props.setPriceValue(value); props.handleSearch(); }}
        />
      </div>
      <div className="clearfix" />

      <div className="checkbox-filters">
        <h5>Property Type</h5>
        <ul>
          {props.propertyTypes.map((item, i) => {
            return (
              <li key={i} onClick={(e) => { props.toggleFilter('propertyTypes', item.text); props.handleSearch(e); }}>
                <div className="key">
                  <input type="checkbox" name={item.text} checked={props.propertyTypesToggled.has(item.text)} />
                  <label htmlFor={item.text}>{item.text}</label>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <button type="submit" onClick={props.clearFilters} className="button">Clear Filters</button>
    </div>
  );
}

FilterPanel.propTypes = {
  cities: PropTypes.array,
  citiesToggled: PropTypes.object,
  propertyTypes: PropTypes.array,
  propertyTypesToggled: PropTypes.object,
  priceValue: PropTypes.array,
  setPriceValue: PropTypes.func,
  countryId: PropTypes.string,
  handleSearch: PropTypes.func,
  toggleFilter: PropTypes.func,
  clearFilters: PropTypes.func,
};

export default FilterPanel;