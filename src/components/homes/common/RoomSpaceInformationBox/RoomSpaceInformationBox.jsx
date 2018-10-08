import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

function RoomSpaceInformationBox(props) {
  const { property_type, guests, size, bathroom, bedrooms } = props;
  return (
    <div className="icons-container-space">
      {property_type &&
        <div>
          <img src="/images/icon-review/icon-home.png" alt="icon-home" />
          <p>{property_type}</p>
        </div>
      }

      {guests &&
        <div>
          <img src="/images/icon-review/icon-guest.png" alt="icon-guest" />
          <p>Guests x{guests}</p>
        </div>
      }

      {size &&
        <div>
          <img src="/images/icon-review/icon-size.png" alt="icon-size" />
          <p>{size} m2</p>
        </div>
      }

      {bathroom && bathroom.toString() &&
        <div>
          <img src="/images/icon-review/icon-bathroom.png" alt="icon-bathroom" />
          <p>{bathroom} {bathroom === 1 ? 'Bathroom' : 'Bathrooms'}</p>
        </div>
      }

      {bathroom && bedrooms.toString() &&
        <div>
          <img src="/images/icon-review/icon-bedrooms.png" alt="icon-bedrooms" />
          <p>{bedrooms} {bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</p>
        </div>
      }
    </div>
  );
}


RoomSpaceInformationBox.propTypes = {
  property_type: PropTypes.any,
  guests: PropTypes.any,
  size: PropTypes.any,
  bathroom: PropTypes.any,
  bedrooms: PropTypes.any,
};

export default RoomSpaceInformationBox;
