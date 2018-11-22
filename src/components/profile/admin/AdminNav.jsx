import '../../../styles/css/components/profile/admin/navigation-tab.scss';

import PropTypes from 'prop-types';
import React from 'react';

function AdminNav(props) {
  return (
    <div>
      <ul className="navigation-tab">
        {props.children}
      </ul>
    </div>
  );
}

AdminNav.propTypes = {
  children: PropTypes.object
};

export default AdminNav;
