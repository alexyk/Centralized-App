import React from 'react';

import NavLocalization from './NavLocalization';
import NavProfile from './NavProfile';

function ProfileHeader() {
  return (
    <div>
      <NavLocalization />
      <NavProfile />
    </div>
  );
}

export default ProfileHeader;