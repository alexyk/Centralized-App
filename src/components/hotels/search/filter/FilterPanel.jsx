import React from 'react';
import PropTypes from 'prop-types';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import FilterStarCheckbox from './FilterStarCheckbox';

import '../../../../styles/css/components/hotels_search/filter/filter.css';

function FilterPanel(props) {
  if (!props.isSearchReady) {
    return (
      <div className="filter-box">
        <div className="form-group">
          <h6 className="filter-info">Search in progress, filtering will be possible after it is completed</h6>
        </div>
      </div>
    );
  }

  console.log(props.showFiltersMobile);
  if (props.windowWidth <= 991 && !props.showFiltersMobile) {
    return (
      <div className="filter-box">
        <div onClick={props.handleShowFilters} className='show-filters'>Show Filters</div>
      </div>
    );
  }

  return (
    <div className="filter-box">
      {props.isSearchReady}
      <div>
        <div>

          <div className="text-filters">
            <h5>Name</h5>
            <input type='text' name='hotelName' value={props.hotelName} onChange={props.handleFilterByName}></input>
          </div>

          <div className="checkbox-filters">
            <h5>Availability</h5>
            <ul>
              <li onClick={props.handleShowUnavailable}>
                <div className="key">
                  <input type="checkbox" name='showUnavailable' checked={props.showUnavailable} />
                  <label htmlFor="showUnavailable">Show Unavailable</label>
                </div>
              </li>
            </ul>
          </div>

          <div className='order-filters'>
            <h5>Order By</h5>
            <div className='select'>
              <select name={'orderBy'} value={props.orderBy} onChange={props.handleOrderBy}>
                <option value='priceForSort,asc'>Lowest price</option>
                <option value='priceForSort,desc'>Highest price</option>
              </select>
            </div>
          </div>


          <div className="star-filters">
            <h5>Star Rating</h5>
            <FilterStarCheckbox
              name='star-one'
              value={0}
              text={'1'}
              checked={props.stars[0]}
              handleToggleStar={props.handleToggleStar} />
            <FilterStarCheckbox
              name='star-two'
              value={1}
              text={'2'}
              checked={props.stars[1]}
              handleToggleStar={props.handleToggleStar} />
            <FilterStarCheckbox
              name='star-three'
              value={2}
              text={'3'}
              checked={props.stars[2]}
              handleToggleStar={props.handleToggleStar} />
            <FilterStarCheckbox
              name='star-four'
              value={3}
              text={'4'}
              checked={props.stars[3]}
              handleToggleStar={props.handleToggleStar} />
            <FilterStarCheckbox
              name='star-six'
              value={4}
              text={'5'}
              checked={props.stars[4]}
              handleToggleStar={props.handleToggleStar} />
            <div className='clearfix'></div>
          </div>

          <div className="range-filters">
            <h5>Pricing</h5>
            <ReactBootstrapSlider
              value={props.priceRange}
              slideStop={(e) => { props.handlePriceRangeSelect(e); }}
              step={5}
              max={5000}
              min={1}
              orientation="horizontal"
              range={true} />
            <div className="labels">
              <label>$0.000</label>
              <label>$5.000</label>
            </div>
          </div>
        </div>

        <button type="submit" onClick={props.clearFilters} className="btn btn">Clear Filters</button>
      </div>
    </div>
  );
}

FilterPanel.propTypes = {
  priceRange: PropTypes.array,
  isSearchReady: PropTypes.bool,
  orderBy: PropTypes.string,
  stars: PropTypes.array,
  handleOrderBy: PropTypes.func,
  clearFilters: PropTypes.func,
  handlePriceRangeSelect: PropTypes.func,
  handleToggleStar: PropTypes.func,
};

export default FilterPanel;