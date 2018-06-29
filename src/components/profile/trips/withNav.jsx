import React from 'react';

import TripsNav from './TripsNav';

const withNav = function (WrappedComponent) {
  return (
    <div>
      <TripsNav />
      <hr />
      <WrappedComponent />
    </div>
  );
};

export default withNav;
