import React from 'react';
import PropTypes from 'prop-types';

import FilterCheckbox from '../../common/filter/FilterCheckbox';
import BasicsAside from '../aside/BasicsAside';
import ListingCrudNav from '../navigation/ListingCrudNav';
import FooterNav from '../navigation/FooterNav';

import '../../../styles/css/components/profile/listings/listing-safety-amenities.scss';

function ListingSafetyFacilities(props) {
  const category = props.values.categories.filter(category => category.name === 'Safety Amenities');
  const safetyAmenities = [];
  category.forEach((c, j) => {
    if (c.amenities.length > 0) {
      safetyAmenities.push(
        <div key={j} className="checkbox-filters">
          <h2>{c.name}</h2>
          <ul>
            {c.amenities.map((item, i) => {
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

  return (
    <div id="listing-safety-amenities">
      <ListingCrudNav progress='33%' />
      <div className="container">
        <div className="row">
          <div className="listings create">
            <div className="col-md-3">
              <BasicsAside routes={props.routes} />
            </div>

            <div className="col-md-9">
              <h2>What safety amenities do you offer to your guests?</h2>

              <div className="form-group">
                <div className="filter-check-box">
                  {safetyAmenities}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterNav next={props.next} prev={props.prev} handleClickNext={props.updateProgress} step={4} />
    </div>
  );
}

ListingSafetyFacilities.propTypes = {
  values: PropTypes.any,
  updateProgress: PropTypes.func,
  prev: PropTypes.string,
  next: PropTypes.string,
  routes: PropTypes.object,
};

export default ListingSafetyFacilities;
