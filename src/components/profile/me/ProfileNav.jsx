import React from 'react';

import { NavLink } from 'react-router-dom';

function ProfileNav() {
  return (
    <div>
      <div className="host-step"><NavLink exact activeClassName="active" to="/profile/me/edit">Edit Profile</NavLink></div>
      <div className="host-step"><NavLink exact activeClassName="active" to="/profile/me/edit/photos">Photos</NavLink></div>
      {/* <div className="host-step"><NavLink exact activeClassName="active" to="/profile/me/verification">Trist and Verification</NavLink></div>
                <div className="host-step"><NavLink exact activeClassName="active" to="/profile/me/reviews">Reviews</NavLink></div> */}
    </div>
  );
}

export default ProfileNav;