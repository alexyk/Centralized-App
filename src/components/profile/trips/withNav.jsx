import React from 'react';

import TripsNav from './TripsNav';

const withNav = function (WrappedComponent) {
  return (
    <div>
      <TripsNav />
      <WrappedComponent />
    </div>
  );
};

export default withNav;