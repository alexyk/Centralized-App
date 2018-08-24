import '../../../styles/css/components/hotels/details/facilities.css';

import React from 'react';
import PropTypes from 'prop-types';
import { Config } from '../../../config';

const Facilities = ({ facilities }) => {

  if (!facilities || facilities.length === 0) {
    return null;
  }

  const mostPopularFacilities = facilities.filter(a => a.picture != null);

  return (
    <div id="facilities">
      <h2>Facilities</h2>
      <hr />
      {mostPopularFacilities && mostPopularFacilities.length > 0 &&
        <div className="hotel-details__most-popular clearfix">
          {mostPopularFacilities.map((item, i) => {
            return (
              item.picture != null && (
                <div key={i} className="most-popular__icon" tooltip={item.text}>
                  <span>
                    <img src={Config.getValue('imgHost') + item.picture} alt={item.text} />
                  </span>
                </div>
              )
            );
          })}
        </div>
      }
      <div className="hotel-details__facilities">
        {facilities.map((facility, index) => {
          return (<div key={index} className="hotel-details__facility">{facility.text}</div>);
        })}
      </div>
    </div>
  );
};

Facilities.propTypes = {
  facilities: PropTypes.array
};

export default Facilities;