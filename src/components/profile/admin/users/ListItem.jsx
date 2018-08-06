import '../../../../styles/css/components/profile/admin_panel/unpublished-item.css';

import { Config } from '../../../../config.js';
import PropTypes from 'prop-types';
import React from 'react';

function ListItem(props) {
  const { firstName, gender, id, lastName, city, country, email, birthday, image, verified, idImage } = props.item;


  return (
    <div className="unpublished-item">
      <div className="unpublished-item_images">
        <img src={Config.getValue('imgHost') + image} />
      </div>
      <div className="unpublished-item_content">
        <div className="header">
          <h2><span><a href={`/homes/listings/${id}`}>{firstName} {lastName}</a></span></h2>
          <h6>{email}</h6>

          <p>Birthday: {birthday ? birthday : 'Missing'}</p>
          <p>City: {city ? city : 'Missing'}</p>
          <p>Country: {country ? country : 'Missing'}</p>
          <p>Gender: {gender ? gender : 'Missing'}</p>
          <img src={idImage} style={{width: '50%'}} />

        </div>

        <div className="unpublished-item_actions">
          <div className="minor-actions">

          </div>
          <div className="major-actions">
            {verified === false &&
              <div><a href="#" onClick={(e) => props.updateListingStatus(e, id, 'active')}>Verify</a></div>
            }
            {verified === false &&
              <div><a href="#" onClick={(e) => props.updateListingStatus(e, id, 'denied')}>Deny</a></div>
            }
            {verified === true &&
              <div><a href="#" onClick={(e) => props.updateListingStatus(e, id, 'inactive')}>Unverify</a></div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

ListItem.propTypes = {
  item: PropTypes.object,
  isExpanded: PropTypes.bool,
  handleExpandListing: PropTypes.func,
  handleShrinkListing: PropTypes.func,
  openContactHostModal: PropTypes.func,
  handleOpenDeleteListingModal: PropTypes.func,
  updateListingStatus: PropTypes.func
};

export default ListItem;
