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
    <div className="box">
      <div className="col-md-8">
        <h2>{_.startCase(_.camelCase(item))}</h2>
        <h5>{ProfileVerification[item.toUpperCase() + sufix]}</h5>
      </div>
      <div className="col-md-4">
        {verified === true ? null : <Link to="/profile/me/edit" className="btn btn-primary">Provide</Link>}
      </div>
    </div>
  );
}

VerificationItem.propTypes = {
  item: PropTypes.string,
  verified: PropTypes.bool
};

export default VerificationItem;
