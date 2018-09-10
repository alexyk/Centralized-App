import '../../../styles/css/components/profile/me/profile-verification.css';

import { Link } from 'react-router-dom';
import { ProfileVerification } from '../../../constants/profileVerification';
import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';

function VerificationItem(props) {
  const { item, verified } = props;
  const sufix = verified === true ? '_VERIFIED' : '_UNVERIFIED';
  return (
    <div className="verification-item">
      <div>
        <h2>{_.startCase(_.camelCase(item))}</h2>
        <h5>{ProfileVerification[item.toUpperCase() + sufix]}</h5>
      </div>
      {/* <div className="right-part">
        {verified === true ? null : <Link to="/profile/me/edit" className="button">Provide</Link>}
      </div> */}
    </div>
  );
}

VerificationItem.propTypes = {
  item: PropTypes.string,
  verified: PropTypes.bool
};

export default VerificationItem;
