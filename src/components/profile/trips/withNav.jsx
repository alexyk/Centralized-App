import React from 'react';

import TripsNav from './TripsNav';

const withNav = function (WrappedComponent) {
  const highOrderedComponent = function () {
    return (
      <div>
        <TripsNav />
        <hr />
        <WrappedComponent />
      </div>
    );
  };

  return highOrderedComponent;
};

export default withNav;
