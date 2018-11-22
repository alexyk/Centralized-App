import React from 'react';
import PropTypes from 'prop-types';

import BasicsAside from '../aside/BasicsAside';
import ListingCrudNav from '../navigation/ListingCrudNav';
import FilterCheckbox from '../../common/filter/FilterCheckbox';
import FooterNav from '../navigation/FooterNav';

import '../../../styles/css/components/profile/listings/listing-facilities.scss';

function ListingFacilities(props) {
  if (!props) {
    return null;
  }

  const facilities = [];
  props.values.categories.forEach((category, j) => {
    if (category.amenities.length > 0 && category.name !== 'Safety Amenities') {
      facilities.push(
        <div key={j} className="checkbox-filters">
          <h4>{category.name}</h4>
          <ul>
            {category.amenities.map((item, i) => {
              return (
                <li key={i} onClick={() => props.toggle(item.id)}>
                  <FilterCheckbox
                    id={item.id}
                    key={i}
                    text={item.name}
                    checked={props.values.facilities.has(item.id)} />
                </li>
              );
            })}
          </ul>
        </div>
      );
    }
  });

  const columns = [[], [], []];
  facilities.forEach((item, i) => {
    columns[i % 3].push(item);
  });

  return (
    <div id="listing-facilicites">
      <ListingCrudNav progress='33%' />
      <div className="container">
        <div className="row">
          <div className="listings create">
            <div className="col-md-3">
              <BasicsAside routes={props.routes} />
            </div>
            <div className="col-md-9">
              <div className="form-group">
                <h2>What facilities do you offer to your guests</h2>

                <div className="col-md-4">
                  {columns[0]}
                </div>

                <div className="col-md-4">
                  {columns[1]}
                </div>

                <div className="col-md-4">
                  {columns[2]}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterNav next={props.next} prev={props.prev} handleClickNext={props.updateProgress} step={3} />
    </div>
  );
}

ListingFacilities.propTypes = {
  values: PropTypes.any,
  updateProgress: PropTypes.func,
  prev: PropTypes.string,
  next: PropTypes.string,
  routes: PropTypes.object,
};

export default ListingFacilities;