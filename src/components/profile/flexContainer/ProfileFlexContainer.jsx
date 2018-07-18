import React from 'react';
import PropTypes from 'prop-types';

import './flex-container.css';

function ProfileFlexContainer(props) {
  return (
    <div className={props.styleClass}>
      {props.children}
    </div>
  );
}

ProfileFlexContainer.propTypes = {
  styleClass: PropTypes.string
};

export default ProfileFlexContainer;