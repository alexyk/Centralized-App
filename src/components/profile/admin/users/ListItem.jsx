import '../../../../styles/css/components/profile/admin_panel/unpublished-item.css';

import { Config } from '../../../../config.js';
import PropTypes from 'prop-types';
import React from 'react';

function ListItem(props) {
  const { firstName, id, lastName, city, country, email, phoneNumber, idCardPicture, address, zipCode } = props.item;
  const verified = props.verified;

  return (
    <div className="unpublished-item">
      <div className="unpublished-item_images">
        <img src={Config.getValue('imgHost') + idCardPicture} />
      </div>
      <div className="unpublished-item_content">
        <div className="header">
          <h2><span>{firstName} {lastName}</span></h2>
          <h6>{email}</h6>

          <p>City: {city ? city : 'Missing'}</p>
          <p>Country: {country && country.name ? country.name : 'Missing'}</p>
          <p>Phone number: {phoneNumber ? phoneNumber : 'Missing'}</p>
          <p>Address: {address ? address : 'Missing'}</p>
          <p>Zip code: {zipCode ? zipCode : 'Missing'}</p>
          <img src={idCardPicture} style={{width: '50%'}} />
        </div>

        <div className="unpublished-item_actions">
          <div className="minor-actions">

          </div>
          <div className="major-actions">
            {verified === false &&
              <div><a href="#" onClick={(e) => props.updateUserStatus(e, id, true)}>Verify</a></div>
            }
            {verified === false &&
              <div><a href="#" onClick={(e) => props.updateUserStatus(e, id, false)}>Deny</a></div>
            }
            {verified === true &&
              <div><a href="#" onClick={(e) => props.updateUserStatus(e, id, false)}>Unverify</a></div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

ListItem.propTypes = {
  item: PropTypes.object,
  updateUserStatus: PropTypes.func,
  verified: PropTypes.bool
};

export default ListItem;
