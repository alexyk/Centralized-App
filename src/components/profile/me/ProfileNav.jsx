import '../../../styles/css/components/profile/me/profile-nav.css';

import { NavLink } from 'react-router-dom';
import React from 'react';

function ProfileNav() {
  return (
    <div>
      <div className="host-step"><NavLink exact activeClassName="active" to="/profile/me/edit">Edit Profile</NavLink></div>
      <div className="host-step"><NavLink exact activeClassName="active" to="/profile/me/edit/photos">Photos</NavLink></div>
      <div className="host-step"><NavLink exact activeClassName="active" to="/profile/me/verification">Trust and Verification</NavLink></div>
      {/* <div className="host-step"><NavLink exact activeClassName="active" to="/profile/me/reviews">Reviews</NavLink></div> */}
    </div>
  );
}

export default ProfileNav;
