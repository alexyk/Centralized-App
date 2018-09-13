import '../../../styles/css/components/profile/me/profile-edit-nav.css';

import { NavLink } from 'react-router-dom';
import React from 'react';

function ProfileEditNav() {
  return (
    <div>
      <div className="host-step"><NavLink exact activeClassName="active" to="/profile/me/edit">Edit Profile</NavLink></div>
      <div className="host-step"><NavLink exact activeClassName="active" to="/profile/me/additional-info">Additional Info</NavLink></div>
      <div className="host-step"><NavLink exact activeClassName="active" to="/profile/me/edit/photos">Photos</NavLink></div>
      <div className="host-step"><NavLink exact activeClassName="active" to="/profile/me/verification">Trust and Verification</NavLink></div>
      {/* <div className="host-step"><NavLink exact activeClassName="active" to="/profile/me/reviews">Reviews</NavLink></div> */}
    </div>
  );
}

export default ProfileEditNav;
