import React from 'react';
import PropTypes from 'prop-types';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import FilterStarCheckbox from './FilterStarCheckbox';

const MobileFilterPanel = (props) => (
  <div className="filter-box-mobile">
    {props.isSearchReady
      ? (
        <div>
          <div className="form-group">
            <div className="filter-order">
              <select name={'orderBy'} className="form-control filter-select" value={props.orderBy} onChange={props.handleOrderBy}>
                <option value=''>Order by</option>
                <option value='asc'>Lowest price</option>
                <option value='desc'>Highest price</option>
              </select>
              <div className="clearfix" />
            </div>

            <div className="filter-stars">
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
              <div className="clearfix" />
            </div>

            <div className="filter-pricing">
              <label>Pricing</label>
              <div className="filter-slider">
                <ReactBootstrapSlider
                  value={props.priceRange}
                  slideStop={(e) => { props.handlePriceRangeSelect(e); }}
                  step={5}
                  max={5000}
                  min={1}
                  orientation="horizontal"
                  range={true} />
                <div className="clearfix" />
              </div>
            </div>
          </div>
          <div className="clearfix" />

          <div className="form-group buttons">
            <button type="submit" onClick={props.clearFilters} className="btn btn-left">Clear Filters</button>
            {props.showMap
              ? <button onClick={props.toggleMap} className="btn btn-primary">Show list</button>
              : <button onClick={props.toggleMap} className="btn btn-primary">Show on map</button>
            }
          </div>
        </div>
      )
      : (
        <div>
          <div className="form-group">
            <h5 className="filter-info">Search in progress, filtering will be possible after it is completed</h5>
            {/* <button type="submit" onClick={props.handleStopSearch} className="btn btn">Stop Search</button> */}
          </div>
        </div>
      )
    }
  </div>
);

MobileFilterPanel.propTypes = {
  priceRange: PropTypes.array,
  isSearchReady: PropTypes.bool,
  orderBy: PropTypes.string,
  stars: PropTypes.array,
  handleOrderBy: PropTypes.func,
  clearFilters: PropTypes.func,
  handlePriceRangeSelect: PropTypes.func,
  handleToggleStar: PropTypes.func,
};

export default MobileFilterPanel;