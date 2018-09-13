import React from 'react';

import LocalizationNav from './LocalizationNav';
import ProfileNav from './ProfileNav';

function ProfileHeader() {
  return (
    <div>
      <LocalizationNav />
      <ProfileNav />
    </div>
  );
}

export default ProfileHeader;